const { User, Venue, Court, Payment, Booking } = require('../helper/db.helper');
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

async function getDistributions() {
  // Fetch bookings with venue (city) and court (sport_type) to aggregate
  const bookings = await Booking.findAll({
    attributes: ['id', 'total_amount'],
    include: [
      { model: Venue, as: 'venue', attributes: ['city'] },
      { model: Court, as: 'court', attributes: ['sport_type'] },
    ],
  });

  const cityMap = new Map();
  const sportEarnings = new Map();

  for (const b of bookings) {
    const city = (b.venue?.city || 'Unknown').trim() || 'Unknown';
    const amount = Number(b.total_amount || 0);
    const sport = b.court?.sport_type || 'Other';

    const c = cityMap.get(city) || { bookings: 0, revenue: 0 };
    c.bookings += 1;
    c.revenue += amount;
    cityMap.set(city, c);

    const se = sportEarnings.get(sport) || 0;
    sportEarnings.set(sport, se + amount);
  }

  // Get total courts per sport_type
  const allCourts = await Court.findAll({ attributes: ['sport_type'] });
  const sportCourts = new Map();
  for (const c of allCourts) {
    const s = c.sport_type || 'Other';
    sportCourts.set(s, (sportCourts.get(s) || 0) + 1);
  }

  // Compose arrays
  const cityWise = Array.from(cityMap.entries()).map(([name, v]) => ({
    name,
    value: v.bookings, // used as share for Pie
    bookings: v.bookings,
    revenue: Math.round(v.revenue),
  })).sort((a,b)=>b.bookings-a.bookings);

  const totalEarnings = Array.from(sportEarnings.values()).reduce((s,v)=>s+v,0) || 1;
  const gameWise = Array.from(sportEarnings.entries()).map(([name, earnings]) => ({
    name,
    value: Math.round((earnings/totalEarnings)*100), // share for Pie
    earnings: Math.round(earnings),
    courts: sportCourts.get(name) || 0,
  })).sort((a,b)=>b.earnings-a.earnings);

  return { cityWise, gameWise };
}

module.exports.getDistributions = getDistributions;

async function listUsers({ page = 1, page_size = 10, query, role, status }) {
  const where = {};
  if (role) where.role = role;
  if (typeof status !== 'undefined') where.is_active = status === 'active' ? true : status === 'inactive' ? false : undefined;
  if (where.is_active === undefined) delete where.is_active;

  // Simple search on email/full_name
  const { Op } = require('sequelize');
  if (query && query.trim()) {
    where[Op.or] = [
      { email: { [Op.iLike]: `%${query.trim()}%` } },
      { full_name: { [Op.iLike]: `%${query.trim()}%` } },
    ];
  }

  const users = await User.findAndCountAll({
    where,
    attributes: ['id', 'email', 'full_name', 'role', 'is_active', 'credit_balance', 'created_at'],
    order: [['created_at', 'DESC']],
    limit: Number(page_size) || 10,
    offset: ((Number(page) || 1) - 1) * (Number(page_size) || 10),
  });
  return { count: users.count, rows: users.rows };
}

async function setUserActive(user_id, is_active) {
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');
  user.is_active = !!is_active;
  await user.save();
  return user;
}

async function updateUserRole(user_id, role) {
  const allowed = ['user', 'owner', 'admin'];
  if (!allowed.includes(role)) throw new Error('Invalid role');
  const user = await User.findByPk(user_id);
  if (!user) throw new Error('User not found');
  user.role = role;
  await user.save();
  return user;
}

module.exports.listUsers = listUsers;
module.exports.setUserActive = setUserActive;
module.exports.updateUserRole = updateUserRole;


