import prisma from '../../utils/prisma.js';

export async function processPayment(req, res, next) {
  try {
    const { booking_id, method, simulate_status } = req.body;
    const userId = req.user.id;

    const booking = await prisma.booking.findFirst({
      where: { id: booking_id, user_id: userId },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const txnId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.payment.create({
      data: {
        booking_id,
        amount: booking.total_fare,
        status: simulate_status,
        method,
        transaction_id: txnId,
      },
    });

    if (simulate_status === 'FAILED') {
      return res.status(400).json({
        success: false,
        message: 'Payment failed as requested. Please try again or use another payment method.',
        data: { payment },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment successful! Your booking is confirmed.',
      data: {
        payment,
        pnr: booking.pnr,
      },
    });
  } catch (error) {
    next(error);
  }
}
