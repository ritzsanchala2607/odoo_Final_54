const { User, Venue, Court, Payment } = require('../helper/db.helper');
const { Op } = require('sequelize');

async function getPlatformStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const now = new Date();

  const [activeUsers, activeVenues, activeCourts, todayRevenueRaw, totalRevenueRaw] = await Promise.all([
    User.count({ where: { is_active: true } }),
    Venue.count({ where: { status: 'approved' } }),
    Court.count({ where: { is_active: true } }),
    Payment.sum('amount', { where: { status: 'completed', created_at: { [Op.between]: [todayStart, now] } } }),
    Payment.sum('amount', { where: { status: 'completed' } }),
  ]);

  const todayRevenue = Number(todayRevenueRaw || 0);
  const totalRevenue = Number(totalRevenueRaw || 0);

  return { activeUsers, activeVenues, activeCourts, todayRevenue, totalRevenue };
}

module.exports = { getPlatformStats };


