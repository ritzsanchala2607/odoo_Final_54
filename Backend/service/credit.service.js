const { User, CreditTransaction } = require('../helper/db.helper');
const { Sequelize } = require('sequelize');

async function creditUserBalance(userId, amount, reason = 'Top-up via Razorpay') {
  if (!userId) throw new Error('userId is required');
  const normalizedAmount = parseInt(amount, 10);
  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error('Invalid amount');
  }

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // Update credit balance atomically
  await User.update(
    { credit_balance: Sequelize.literal(`credit_balance + ${normalizedAmount}`) },
    { where: { id: userId } }
  );

  // Create ledger transaction
  await CreditTransaction.create({
    user_id: userId,
    amount: normalizedAmount,
    type: 'earn',
    reason,
    created_at: new Date()
  });

  // Return updated user
  const updated = await User.findByPk(userId);
  return updated;
}

module.exports = { creditUserBalance };
