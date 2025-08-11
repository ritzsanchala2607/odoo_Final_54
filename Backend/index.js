require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Initialize DB (loads models and associations)
require('./helper/db.helper');

// Routers
const userRouter = require('./routes/user.routes');
const venueRouter = require('./routes/venue.routes');
const courtRouter = require('./routes/court.routes');
const bookingRouter = require('./routes/booking.routes');
const reviewRouter = require('./routes/review.routes');
const paymentRouter = require('./routes/payment.routes');
const facilityRouter = require('./routes/facility.routes');
const notificationRouter = require('./routes/notification.routes');
const scheduleRouter = require('./routes/schedule.routes');
const slotRouter = require('./routes/slot.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // your frontend's URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and cookie middleware
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    sameSite: 'lax'
  }
}));

// Increase body size limits to allow base64 images in JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use('/avatar', express.static(path.join(__dirname, 'public/avatar')));

// API routes
app.use('/api/user', userRouter); // signup, login
app.use('/api/venues', venueRouter);
app.use('/api/courts', courtRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/facility', facilityRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/slots', slotRouter);

// Health
app.get('/', (req, res) => res.send('QuickCourt API'));

if (process.env.NODE_ENV !== 'production') {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
module.exports.handler = serverless(app);
