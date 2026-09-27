import prisma from '../../utils/prisma.js';
import { generatePNR } from '../../utils/pnrGenerator.js';

const CLASS_MULTIPLIERS = {
  '1A': 2.8,
  '2A': 1.9,
  '3A': 1.3,
  'SL': 0.55,
  'CC': 0.95,
  'EC': 2.1,
  '2S': 0.35,
};

const CLASS_COACH_PREFIX = {
  '1A': 'H',
  '2A': 'A',
  '3A': 'B',
  'SL': 'S',
  'CC': 'C',
  'EC': 'E',
  '2S': 'D',
};

export async function createBooking(req, res, next) {
  try {
    const userId = req.user.id;
    const { train_id, class: travelClass, journey_date, passengers } = req.body;

    const train = await prisma.train.findUnique({
      where: { id: train_id },
      include: { routes: true },
    });

    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    const distance = train.routes[0]?.distance || 500;
    const rate = CLASS_MULTIPLIERS[travelClass] || 1.0;
    const baseFarePerPassenger = Math.round(distance * rate);
    const totalFare = baseFarePerPassenger * passengers.length;

    // Check & update seat inventory
    let inventory = await prisma.seatInventory.findUnique({
      where: {
        train_id_class_date: {
          train_id,
          class: travelClass,
          date: journey_date,
        },
      },
    });

    if (!inventory) {
      // Create default inventory if not existing for that date
      inventory = await prisma.seatInventory.create({
        data: {
          train_id,
          class: travelClass,
          date: journey_date,
          total_seats: 60,
          available_seats: 45,
          rac_count: 0,
          waitlist_count: 0,
        },
      });
    }

    let bookingStatus = 'CONFIRMED';
    const coachPrefix = CLASS_COACH_PREFIX[travelClass] || 'S';

    let updatedAvail = inventory.available_seats;
    let updatedRac = inventory.rac_count;
    let updatedWl = inventory.waitlist_count;

    const passengersWithSeats = passengers.map((p, idx) => {
      let seatNo = '';
      if (updatedAvail > 0) {
        const coachNo = Math.floor(Math.random() * 3) + 1;
        const seatNum = Math.floor(Math.random() * 60) + 1;
        seatNo = `${coachPrefix}${coachNo}-${seatNum}`;
        updatedAvail -= 1;
      } else if (updatedRac < 10) {
        updatedRac += 1;
        bookingStatus = 'RAC';
        seatNo = `RAC-${updatedRac}`;
      } else {
        updatedWl += 1;
        bookingStatus = 'WAITLIST';
        seatNo = `WL-${updatedWl}`;
      }

      return {
        name: p.name,
        age: p.age,
        gender: p.gender,
        berth_preference: p.berth_preference,
        seat_number: seatNo,
      };
    });

    // Update inventory
    await prisma.seatInventory.update({
      where: { id: inventory.id },
      data: {
        available_seats: updatedAvail,
        rac_count: updatedRac,
        waitlist_count: updatedWl,
      },
    });

    // Generate unique PNR
    let pnr = generatePNR();
    let existingPnr = await prisma.booking.findUnique({ where: { pnr } });
    while (existingPnr) {
      pnr = generatePNR();
      existingPnr = await prisma.booking.findUnique({ where: { pnr } });
    }

    const booking = await prisma.booking.create({
      data: {
        user_id: userId,
        train_id,
        pnr,
        class: travelClass,
        journey_date,
        status: bookingStatus,
        total_fare: totalFare,
        passengers: {
          create: passengersWithSeats,
        },
      },
      include: {
        passengers: true,
        train: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Booking initialized successfully. Complete payment to confirm.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookingByPNR(req, res, next) {
  try {
    const { pnr } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { pnr },
      include: {
        train: {
          include: {
            routes: true,
          },
        },
        passengers: true,
        payments: true,
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'PNR not found or invalid' });
    }

    const stops = booking.train.routes[0]?.stops ? JSON.parse(booking.train.routes[0].stops) : [];

    return res.status(200).json({
      success: true,
      data: {
        ...booking,
        stops,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserBookings(req, res, next) {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        train: true,
        passengers: true,
        payments: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(id), user_id: userId },
      include: { passengers: true, payments: true },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' },
    });

    // Restore inventory
    const inventory = await prisma.seatInventory.findUnique({
      where: {
        train_id_class_date: {
          train_id: booking.train_id,
          class: booking.class,
          date: booking.journey_date,
        },
      },
    });

    if (inventory) {
      await prisma.seatInventory.update({
        where: { id: inventory.id },
        data: {
          available_seats: inventory.available_seats + booking.passengers.length,
        },
      });
    }

    // Process simulated refund
    const originalFare = Number(booking.total_fare);
    const cancellationFee = Math.round(originalFare * 0.1); // 10% cancellation charge
    const refundAmount = Math.max(0, originalFare - cancellationFee);

    const refundPayment = await prisma.payment.create({
      data: {
        booking_id: booking.id,
        amount: refundAmount,
        status: 'REFUNDED',
        method: 'REFUND_TO_SOURCE',
        transaction_id: `REFUND_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. Simulated refund of ₹${refundAmount} processed (Cancellation Fee: ₹${cancellationFee}).`,
      data: {
        booking: updatedBooking,
        refund: refundPayment,
      },
    });
  } catch (error) {
    next(error);
  }
}
