const paymentService = require('../service/payment.service');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function create(req, res) {
  try {
    const payment = await paymentService.createPayment(req.body);
    return res.status(201).json({ payment });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function getByBooking(req, res) {
  try {
    const payment = await paymentService.getPaymentByBooking(req.params.booking_id);
    return res.json({ payment });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// Create Razorpay order
async function createRazorpayOrder(req, res) {
  try {
    const { amount, currency = 'INR', bookingId } = req.body;

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${bookingId}`,
      notes: {
        booking_id: bookingId,
      },
    };

    const order = await razorpay.orders.create(options);
    
    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
}

// Verify Razorpay payment
async function verifyRazorpayPayment(req, res) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookingDetails,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified, save booking and payment details
      try {
        // Save booking to database
        const booking = await paymentService.createBooking({
          booking_id: bookingDetails.bookingId,
          venue_id: bookingDetails.venue.id,
          customer_name: bookingDetails.customerDetails.customerName,
          customer_email: bookingDetails.customerDetails.customerEmail,
          customer_phone: bookingDetails.customerDetails.customerPhone,
          booking_date: bookingDetails.date,
          time_slot: bookingDetails.timeSlot.id,
          sport: bookingDetails.sport.id,
          member_count: bookingDetails.memberCount,
          total_amount: bookingDetails.totalPrice,
          status: 'confirmed',
        });

        // Save payment details
        const payment = await paymentService.createPayment({
          booking_id: bookingDetails.bookingId,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          amount: bookingDetails.totalPrice,
          currency: 'INR',
          status: 'completed',
          payment_method: 'razorpay',
        });

        return res.status(200).json({
          success: true,
          message: 'Payment verified and booking confirmed',
          booking: booking,
          payment: payment,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Payment verified but failed to save booking',
          error: dbError.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
}

// Handle Razorpay webhooks (optional, for additional security)
async function handleRazorpayWebhook(req, res) {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (webhookSignature !== expectedSignature) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    if (event === 'payment.captured') {
      // Update payment status in database
      await paymentService.updatePaymentStatus(paymentEntity.order_id, 'captured');
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Webhook processing failed' });
  }
}

module.exports = { 
  create, 
  getByBooking, 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  handleRazorpayWebhook 
};

