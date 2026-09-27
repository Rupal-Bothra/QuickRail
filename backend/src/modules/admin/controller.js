import prisma from '../../utils/prisma.js';

function getNext7Days() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export async function getAdminStats(req, res, next) {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrains = await prisma.train.count();
    const totalBookings = await prisma.booking.count();

    const paymentAggregation = await prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    });

    const totalRevenue = paymentAggregation._sum.amount || 0;

    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        train: { select: { train_number: true, name: true } },
        passengers: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTrains,
          totalBookings,
          totalRevenue,
        },
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllTrainsAdmin(req, res, next) {
  try {
    const trains = await prisma.train.findMany({
      include: {
        routes: true,
        seat_inventories: true,
      },
      orderBy: { id: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: trains.length,
      data: trains,
    });
  } catch (error) {
    next(error);
  }
}

export async function createTrainAdmin(req, res, next) {
  try {
    const { train_number, name, source, destination, departure_time, arrival_time, duration, classes_available, distance, stops } = req.body;

    const existingTrain = await prisma.train.findUnique({ where: { train_number } });
    if (existingTrain) {
      return res.status(400).json({ success: false, message: 'Train number already exists' });
    }

    const train = await prisma.train.create({
      data: {
        train_number,
        name,
        source,
        destination,
        departure_time,
        arrival_time,
        duration,
        classes_available,
      },
    });

    // Create Route
    await prisma.route.create({
      data: {
        train_id: train.id,
        distance,
        stops: JSON.stringify(stops || []),
      },
    });

    // Create 7-day seat inventory for all classes
    const classes = classes_available.split(',');
    const dates = getNext7Days();

    for (const d of dates) {
      for (const cls of classes) {
        await prisma.seatInventory.create({
          data: {
            train_id: train.id,
            class: cls.trim(),
            date: d,
            total_seats: 60,
            available_seats: 50,
            rac_count: 0,
            waitlist_count: 0,
          },
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Train created successfully with route and seat inventory!',
      data: { train },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTrainAdmin(req, res, next) {
  try {
    const { id } = req.params;
    const { name, source, destination, departure_time, arrival_time, duration, classes_available, distance, stops } = req.body;

    const train = await prisma.train.update({
      where: { id: parseInt(id) },
      data: {
        name,
        source,
        destination,
        departure_time,
        arrival_time,
        duration,
        classes_available,
      },
    });

    if (distance || stops) {
      const route = await prisma.route.findFirst({ where: { train_id: train.id } });
      if (route) {
        await prisma.route.update({
          where: { id: route.id },
          data: {
            ...(distance && { distance }),
            ...(stops && { stops: JSON.stringify(stops) }),
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Train details updated successfully',
      data: { train },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTrainAdmin(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.train.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Train deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllBookingsAdmin(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        train: { select: { train_number: true, name: true, source: true, destination: true } },
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
