const Razorpay = require('razorpay');
const crypto = require('crypto');
const { creditUserBalance } = require('../service/credit.service');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(req, res) {
  try {
    const { amount } = req.body; // INR rupees
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `credits_${req.user.id}_${Date.now()}`,
      notes: { user_id: req.user.id, purpose: 'credit_topup' }
    });

    return res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Failed to create order' });
  }
}

async function verify(req, res) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Credit user
    const updatedUser = await creditUserBalance(req.user.id, Math.ceil(Number(amount)));

    return res.json({ success: true, user: updatedUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Verification failed' });
  }
}

module.exports = { createOrder, verify };
