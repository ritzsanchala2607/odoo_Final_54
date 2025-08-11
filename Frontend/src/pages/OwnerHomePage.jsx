// // import React, { useState } from 'react';
// // import {
// //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// //   LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
// // } from 'recharts';
// // import {
// //   Calendar, MapPin, Star, TrendingUp, Users, DollarSign, Activity, Trophy, AlertTriangle, Zap, Eye, BarChart3, TrendingDown
// // } from 'lucide-react';
// // import './OwnerHomePage.css';

// // const OwnerHomePage = () => {
// //   const [activeTab, setActiveTab] = useState('overview');

// //   // Mock data
// //   const courtBookingData = [
// //     { court: 'Arena Sports Complex - Court A', venue: 'Arena Sports Complex', bookings: 245, sport: 'Badminton', revenue: 12250, rating: 4.8, utilization: 92, peakHours: '6-8 PM' },
// //     { court: 'Metro Sports Hub - Court 1', venue: 'Metro Sports Hub', bookings: 198, sport: 'Tennis', revenue: 9900, rating: 4.6, utilization: 78, peakHours: '7-9 AM' },
// //     { court: 'City Turf - Field B', venue: 'City Turf', bookings: 176, sport: 'Football', revenue: 8800, rating: 4.7, utilization: 85, peakHours: '5-7 PM' },
// //     { court: 'Elite Sports Center - Court 3', venue: 'Elite Sports Center', bookings: 152, sport: 'Badminton', revenue: 7600, rating: 4.5, utilization: 68, peakHours: '8-10 AM' },
// //     { court: 'Sports Plaza - Court 2', venue: 'Sports Plaza', bookings: 134, sport: 'Basketball', revenue: 6700, rating: 4.3, utilization: 72, peakHours: '6-8 PM' },
// //     { court: 'Prime Courts - Court A', venue: 'Prime Courts', bookings: 128, sport: 'Tennis', revenue: 6400, rating: 4.4, utilization: 65, peakHours: '9-11 AM' },
// //     { court: 'Galaxy Sports - Field 1', venue: 'Galaxy Sports', bookings: 112, sport: 'Cricket', revenue: 5600, rating: 4.2, utilization: 58, peakHours: '4-6 PM' },
// //     { court: 'Victory Sports - Court B', venue: 'Victory Sports', bookings: 98, sport: 'Badminton', revenue: 4900, rating: 4.1, utilization: 55, peakHours: '7-9 PM' }
// //   ];

// //   const recentBookings = [
// //     { id: 1, user: 'Rajesh Kumar', venue: 'Arena Sports Complex', court: 'Court A', sport: 'Badminton', date: '2024-08-11', time: '18:00-19:00', status: 'Confirmed', amount: 500 },
// //     { id: 2, user: 'Priya Singh', venue: 'Metro Sports Hub', court: 'Court 1', sport: 'Tennis', date: '2024-08-11', time: '19:00-20:00', status: 'Confirmed', amount: 600 },
// //     { id: 3, user: 'Amit Sharma', venue: 'City Turf', court: 'Field B', sport: 'Football', date: '2024-08-11', time: '17:30-18:30', status: 'Pending', amount: 800 },
// //     { id: 4, user: 'Neha Patel', venue: 'Elite Sports Center', court: 'Court 3', sport: 'Badminton', date: '2024-08-11', time: '20:00-21:00', status: 'Confirmed', amount: 450 },
// //     { id: 5, user: 'Vikram Reddy', venue: 'Sports Plaza', court: 'Court 2', sport: 'Basketball', date: '2024-08-11', time: '16:00-17:00', status: 'Confirmed', amount: 550 }
// //   ];

// //   const recentFeedbacks = [
// //     { id: 1, user: 'Rahul Sharma', venue: 'Arena Sports Complex', court: 'Court A', rating: 5, comment: 'Excellent facilities and very clean courts. Staff was helpful too!', date: '2 hours ago', sport: 'Badminton' },
// //     { id: 2, user: 'Priya Patel', venue: 'Metro Sports Hub', court: 'Court 1', rating: 4, comment: 'Good court quality but parking could be better.', date: '5 hours ago', sport: 'Tennis' },
// //     { id: 3, user: 'Amit Kumar', venue: 'City Turf', court: 'Field B', rating: 5, comment: 'Amazing turf quality! Perfect for weekend matches.', date: '1 day ago', sport: 'Football' },
// //     { id: 4, user: 'Sneha Reddy', venue: 'Elite Sports Center', court: 'Court 3', rating: 3, comment: 'Court was okay but AC wasn\'t working properly.', date: '1 day ago', sport: 'Badminton' },
// //     { id: 5, user: 'Vikram Singh', venue: 'Sports Plaza', court: 'Court 2', rating: 4, comment: 'Good experience overall. Will book again.', date: '2 days ago', sport: 'Basketball' }
// //   ];

// //   const hourlyBookings = [
// //     { hour: '6 AM', bookings: 15, revenue: 750 },
// //     { hour: '7 AM', bookings: 28, revenue: 1400 },
// //     { hour: '8 AM', bookings: 35, revenue: 1750 },
// //     { hour: '9 AM', bookings: 22, revenue: 1100 },
// //     { hour: '10 AM', bookings: 18, revenue: 900 },
// //     { hour: '11 AM', bookings: 12, revenue: 600 },
// //     { hour: '12 PM', bookings: 8, revenue: 400 },
// //     { hour: '1 PM', bookings: 6, revenue: 300 },
// //     { hour: '2 PM', bookings: 9, revenue: 450 },
// //     { hour: '3 PM', bookings: 14, revenue: 700 },
// //     { hour: '4 PM', bookings: 25, revenue: 1250 },
// //     { hour: '5 PM', bookings: 32, revenue: 1600 },
// //     { hour: '6 PM', bookings: 45, revenue: 2250 },
// //     { hour: '7 PM', bookings: 48, revenue: 2400 },
// //     { hour: '8 PM', bookings: 38, revenue: 1900 },
// //     { hour: '9 PM', bookings: 25, revenue: 1250 },
// //     { hour: '10 PM', bookings: 12, revenue: 600 }
// //   ];

// //   const monthlyTrends = [
// //     { month: 'Jan', bookings: 1245, revenue: 62250, newUsers: 156 },
// //     { month: 'Feb', bookings: 1389, revenue: 69450, newUsers: 178 },
// //     { month: 'Mar', bookings: 1523, revenue: 76150, newUsers: 203 },
// //     { month: 'Apr', bookings: 1678, revenue: 83900, newUsers: 234 },
// //     { month: 'May', bookings: 1834, revenue: 91700, newUsers: 267 },
// //     { month: 'Jun', bookings: 1967, revenue: 98350, newUsers: 289 },
// //     { month: 'Jul', bookings: 2156, revenue: 107800, newUsers: 312 },
// //     { month: 'Aug', bookings: 1843, revenue: 92150, newUsers: 198 }
// //   ];

// //   const venuePerformance = [
// //     { venue: 'Arena Sports Complex', bookings: 245, revenue: 12250, utilization: 92, satisfaction: 4.8 },
// //     { venue: 'Metro Sports Hub', bookings: 198, revenue: 9900, utilization: 78, satisfaction: 4.6 },
// //     { venue: 'City Turf', bookings: 176, revenue: 8800, utilization: 85, satisfaction: 4.7 },
// //     { venue: 'Elite Sports Center', bookings: 152, revenue: 7600, utilization: 68, satisfaction: 4.5 },
// //     { venue: 'Sports Plaza', bookings: 134, revenue: 6700, utilization: 72, satisfaction: 4.3 },
// //     { venue: 'Prime Courts', bookings: 128, revenue: 6400, utilization: 65, satisfaction: 4.4 }
// //   ];

// //   const customerInsights = [
// //     { segment: 'Regular Players', count: 456, percentage: 32, avgSpend: 850 },
// //     { segment: 'Weekend Warriors', count: 389, percentage: 27, avgSpend: 650 },
// //     { segment: 'Tournament Players', count: 234, percentage: 16, avgSpend: 1200 },
// //     { segment: 'Casual Players', count: 298, percentage: 21, avgSpend: 400 },
// //     { segment: 'Corporate Groups', count: 56, percentage: 4, avgSpend: 2500 }
// //   ];

// //   const predictiveAnalytics = [
// //     { metric: 'Next Week Bookings', predicted: 285, confidence: 87, trend: 'up' },
// //     { metric: 'Revenue Forecast', predicted: 14250, confidence: 82, trend: 'up' },
// //     { metric: 'New User Signups', predicted: 45, confidence: 79, trend: 'down' },
// //     { metric: 'Peak Hour Demand', predicted: '6-8 PM', confidence: 95, trend: 'stable' }
// //   ];

// // const totalBookings = courtBookingData.reduce((sum, court) => sum + court.bookings, 0);
// //   const totalRevenue = courtBookingData.reduce((sum, court) => sum + court.revenue, 0);
// //   const averageRating = (courtBookingData.reduce((sum, court) => sum + court.rating, 0) / courtBookingData.length).toFixed(1);
// //   const averageUtilization = Math.round(courtBookingData.reduce((sum, court) => sum + court.utilization, 0) / courtBookingData.length);

// //   const tabs = [
// //     { id: 'overview', label: 'Overview', icon: Eye },
// //     { id: 'bookings', label: 'Bookings Analysis', icon: Calendar },
// //     { id: 'performance', label: 'Performance', icon: BarChart3 },
// //     { id: 'insights', label: 'Customer Insights', icon: Users },
// //     { id: 'predictions', label: 'Predictions', icon: Zap }
// //   ];
// // const renderStars = (rating) =>
// //     Array.from({ length: 5 }, (_, i) => (
// //       <Star key={i} className={i < rating ? 'star-gold' : 'star-gray'} />
// //     ));

// //   const getStatusClass = (status) => {
// //     if (status === 'Confirmed') return 'badge badge-green';
// //     if (status === 'Pending') return 'badge badge-yellow';
// //     if (status === 'Cancelled') return 'badge badge-red';
// //     return 'badge badge-gray';
// //   };

// //  const renderTabContent = () => {
// //     switch (activeTab) {
// //       case 'overview':
// //         return (
// //           <div className="grid-cols-lg-2">
// //             {/* Top Performing Courts */}
// //             <div className="card">
// //               <div className="card-header">
// //                 <h3>Top Performing Courts</h3>
// //               </div>
// //               <div className="card-body max-h-scroll">
// //                 {courtBookingData.slice(0, 5).map((court, index) => (
// //                   <div key={court.court} className="list-item">
// //                     <div className="list-index">{index + 1}</div>
// //                     <div className="list-info">
// //                       <div className="list-title">{court.court}</div>
// //                       <div className="list-subtitle">{court.venue} • {court.sport}</div>
// //                     </div>
// //                     <div className="list-value">
// //                       <div className="value-bold">{court.bookings}</div>
// //                       <div className="value-sub">₹{court.revenue.toLocaleString()}</div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //             {/* Recent Bookings */}
// //             <div className="card">
// //               <div className="card-header">
// //                 <h3>Recent Bookings</h3>
// //               </div>
// //               <div className="card-body max-h-scroll">
// //                 {recentBookings.map((booking) => (
// //                   <div key={booking.id} className="list-item justify-between border-b">
// //                     <div className="list-info">
// //                       <div className="list-title">{booking.user}</div>
// //                       <div className="list-subtitle">{booking.venue} - {booking.court}</div>
// //                       <div className="list-subtitle">{booking.date} • {booking.time}</div>
// //                     </div>
// //                     <div className="list-value">
// //                       <span className={getStatusClass(booking.status)}>
// //                         {booking.status}
// //                       </span>
// //                       <div className="value-bold">₹{booking.amount}</div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //             {/* Recent Feedbacks */}
// //             <div className="card col-span-2">
// //               <div className="card-header">
// //                 <h3>Recent Customer Feedback</h3>
// //               </div>
// //               <div className="card-body feedback-grid">
// //                 {recentFeedbacks.slice(0, 4).map((feedback) => (
// //                   <div key={feedback.id} className="feedback-card">
// //                     <div className="feedback-card-header">
// //                       <div>
// //                         <div className="list-title">{feedback.user}</div>
// //                         <div className="list-subtitle">{feedback.venue}</div>
// //                       </div>
// //                       <span className="feedback-date">{feedback.date}</span>
// //                     </div>
// //                     <div className="feedback-stars">
// //                       <div className="flex">{renderStars(feedback.rating)}</div>
// //                       <span className="star-number">({feedback.rating}/5)</span>
// //                     </div>
// //                     <div className="feedback-comment">{feedback.comment}</div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         );
// //       // [ ... The rest of the cases: 'bookings', 'performance', 'insights', 'predictions', same conversion: use card, card-header, card-body, etc. ... ]
// //       // For brevity in this answer, just repeat the same pattern from previous answers, using only semantic class names.
// //       default: return null;
// //     }
// //   };

// //   return (
// //     <div className="owner-homepage">
// //       <div className="owner-homepage-container">
// //         {/* Header */}
// //         <div className="owner-header">
// //           <h1>QuickCourt Analytics Dashboard</h1>
// //           <p>Comprehensive insights and performance analytics</p>
// //         </div>
// //         {/* Key Metrics Cards */}
// //         <div className="metric-grid">
// //           <div className="metric-card">
// //             <div className="metric-card-content">
// //               <div className="metric-card-text">
// //                 <div className="metric-label">Total Bookings</div>
// //                 <div className="metric-value">{totalBookings.toLocaleString()}</div>
// //                 <div className="metric-change-green">↗️ +12% from last month</div>
// //               </div>
// //               <Calendar className="metric-icon metric-icon-blue" />
// //             </div>
// //           </div>
// //           <div className="metric-card">
// //             <div className="metric-card-content">
// //               <div className="metric-card-text">
// //                 <div className="metric-label">Total Revenue</div>
// //                 <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
// //                 <div className="metric-change-green">↗️ +18% from last month</div>
// //               </div>
// //               <DollarSign className="metric-icon metric-icon-green" />
// //             </div>
// //           </div>
// //           <div className="metric-card">
// //             <div className="metric-card-content">
// //               <div className="metric-card-text">
// //                 <div className="metric-label">Avg Utilization</div>
// //                 <div className="metric-value">{averageUtilization}%</div>
// //                 <div className="metric-change-yellow">→ +2% from last month</div>
// //               </div>
// //               <Activity className="metric-icon metric-icon-yellow" />
// //             </div>
// //           </div>
// //           <div className="metric-card">
// //             <div className="metric-card-content">
// //               <div className="metric-card-text">
// //                 <div className="metric-label">Avg Rating</div>
// //                 <div className="metric-value">{averageRating}</div>
// //                 <div className="metric-change-green">↗️ +0.3 from last month</div>
// //               </div>
// //               <Star className="metric-icon metric-icon-orange" />
// //             </div>
// //           </div>
// //         </div>
// //         {/* Navigation Tabs */}
// //         <div className="tabs-container">
// //           <div className="tabs-scroll">
// //             {tabs.map((tab) => {
// //               const IconComponent = tab.icon;
// //               return (
// //                 <button
// //                   key={tab.id}
// //                   onClick={() => setActiveTab(tab.id)}
// //                   className={`tab-button${activeTab === tab.id ? ' active' : ''}`}
// //                   type="button"
// //                 >
// //                   <IconComponent className="tab-icon" />
// //                   {tab.label}
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         </div>
// //         {/* Tab Content */}
// //         <div className="tab-content">
// //           {renderTabContent()}
// //         </div>
// //         {/* Insights Footer */}
// //         <div className="footer-insights">
// //           <div className="gradient-blue">
// //             <h3>Peak Performance</h3>
// //             <p>Arena Sports Complex leads with 92% utilization rate</p>
// //             <div className="flex items-center">
// //               <Trophy className="footer-icon" />
// //               <span>Best performing venue this month</span>
// //             </div>
// //           </div>
// //           <div className="gradient-green">
// //             <h3>Revenue Growth</h3>
// //             <p>18% increase in monthly revenue compared to last month</p>
// //             <div className="flex items-center">
// //               <TrendingUp className="footer-icon" />
// //               <span>Consistent upward trend</span>
// //             </div>
// //           </div>
// //           <div className="gradient-purple">
// //             <h3>Customer Satisfaction</h3>
// //             <p>Average rating improved to 4.5/5 with 95% positive feedback</p>
// //             <div className="flex items-center">
// //               <Star className="footer-icon" />
// //               <span>Excellent customer experience</span>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="action-card">
// //           <div className="flex items-start">
// //             <AlertTriangle className="footer-icon warning" />
// //             <div>
// //               <div className="action-title">Action Items & Recommendations</div>
// //               <ul className="action-list">
// //                 <li>• Consider expanding operating hours for high-demand venues (6-8 PM peak)</li>
// //                 <li>• Victory Sports Court B shows low utilization (55%) - review pricing strategy</li>
// //                 <li>• Badminton courts show highest demand - consider adding more courts</li>
// //                 <li>• Schedule maintenance for Elite Sports Center AC system based on feedback</li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// // export default OwnerHomePage;

// import React, { useState } from 'react';
// import './OwnerHomePage.css';

// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
// } from 'recharts';
// import {
//   Calendar, MapPin, Star, TrendingUp, Users, DollarSign, Activity, Trophy, AlertTriangle, Zap, Eye, BarChart3, TrendingDown
// } from 'lucide-react';

// const OwnerHomePage = () => {
//   const [activeTab, setActiveTab] = useState('overview');

//   // Mock data
//   const courtBookingData = [
//     { court: 'Arena Sports Complex - Court A', venue: 'Arena Sports Complex', bookings: 245, sport: 'Badminton', revenue: 12250, rating: 4.8, utilization: 92, peakHours: '6-8 PM' },
//     { court: 'Metro Sports Hub - Court 1', venue: 'Metro Sports Hub', bookings: 198, sport: 'Tennis', revenue: 9900, rating: 4.6, utilization: 78, peakHours: '7-9 AM' },
//     { court: 'City Turf - Field B', venue: 'City Turf', bookings: 176, sport: 'Football', revenue: 8800, rating: 4.7, utilization: 85, peakHours: '5-7 PM' },
//     { court: 'Elite Sports Center - Court 3', venue: 'Elite Sports Center', bookings: 152, sport: 'Badminton', revenue: 7600, rating: 4.5, utilization: 68, peakHours: '8-10 AM' },
//     { court: 'Sports Plaza - Court 2', venue: 'Sports Plaza', bookings: 134, sport: 'Basketball', revenue: 6700, rating: 4.3, utilization: 72, peakHours: '6-8 PM' },
//     { court: 'Prime Courts - Court A', venue: 'Prime Courts', bookings: 128, sport: 'Tennis', revenue: 6400, rating: 4.4, utilization: 65, peakHours: '9-11 AM' },
//     { court: 'Galaxy Sports - Field 1', venue: 'Galaxy Sports', bookings: 112, sport: 'Cricket', revenue: 5600, rating: 4.2, utilization: 58, peakHours: '4-6 PM' },
//     { court: 'Victory Sports - Court B', venue: 'Victory Sports', bookings: 98, sport: 'Badminton', revenue: 4900, rating: 4.1, utilization: 55, peakHours: '7-9 PM' }
//   ];

//   const recentBookings = [
//     { id: 1, user: 'Rajesh Kumar', venue: 'Arena Sports Complex', court: 'Court A', sport: 'Badminton', date: '2024-08-11', time: '18:00-19:00', status: 'Confirmed', amount: 500 },
//     { id: 2, user: 'Priya Singh', venue: 'Metro Sports Hub', court: 'Court 1', sport: 'Tennis', date: '2024-08-11', time: '19:00-20:00', status: 'Confirmed', amount: 600 },
//     { id: 3, user: 'Amit Sharma', venue: 'City Turf', court: 'Field B', sport: 'Football', date: '2024-08-11', time: '17:30-18:30', status: 'Pending', amount: 800 },
//     { id: 4, user: 'Neha Patel', venue: 'Elite Sports Center', court: 'Court 3', sport: 'Badminton', date: '2024-08-11', time: '20:00-21:00', status: 'Confirmed', amount: 450 },
//     { id: 5, user: 'Vikram Reddy', venue: 'Sports Plaza', court: 'Court 2', sport: 'Basketball', date: '2024-08-11', time: '16:00-17:00', status: 'Confirmed', amount: 550 }
//   ];

//   const customerReviews = [
//     { id: 1, user: 'Rahul Sharma', venue: 'Arena Sports Complex', court: 'Court A', rating: 5, comment: 'Excellent facilities and very clean courts. Staff was helpful too!', date: '2 hours ago', sport: 'Badminton', verified: true },
//     { id: 2, user: 'Priya Patel', venue: 'Metro Sports Hub', court: 'Court 1', rating: 4, comment: 'Good court quality but parking could be better.', date: '5 hours ago', sport: 'Tennis', verified: true },
//     { id: 3, user: 'Amit Kumar', venue: 'City Turf', court: 'Field B', rating: 5, comment: 'Amazing turf quality! Perfect for weekend matches.', date: '1 day ago', sport: 'Football', verified: false },
//     { id: 4, user: 'Sneha Reddy', venue: 'Elite Sports Center', court: 'Court 3', rating: 3, comment: 'Court was okay but AC wasn\'t working properly. Need better maintenance.', date: '1 day ago', sport: 'Badminton', verified: true },
//     { id: 5, user: 'Vikram Singh', venue: 'Sports Plaza', court: 'Court 2', rating: 4, comment: 'Good experience overall. Will book again for sure.', date: '2 days ago', sport: 'Basketball', verified: true },
//     { id: 6, user: 'Kavya Nair', venue: 'Prime Courts', court: 'Court A', rating: 5, comment: 'Top-notch facilities and excellent lighting. Highly recommend!', date: '2 days ago', sport: 'Tennis', verified: true }
//   ];

//   const hourlyBookings = [
//     { hour: '6 AM', bookings: 15, revenue: 750 },
//     { hour: '7 AM', bookings: 28, revenue: 1400 },
//     { hour: '8 AM', bookings: 35, revenue: 1750 },
//     { hour: '9 AM', bookings: 22, revenue: 1100 },
//     { hour: '10 AM', bookings: 18, revenue: 900 },
//     { hour: '11 AM', bookings: 12, revenue: 600 },
//     { hour: '12 PM', bookings: 8, revenue: 400 },
//     { hour: '1 PM', bookings: 6, revenue: 300 },
//     { hour: '2 PM', bookings: 9, revenue: 450 },
//     { hour: '3 PM', bookings: 14, revenue: 700 },
//     { hour: '4 PM', bookings: 25, revenue: 1250 },
//     { hour: '5 PM', bookings: 32, revenue: 1600 },
//     { hour: '6 PM', bookings: 45, revenue: 2250 },
//     { hour: '7 PM', bookings: 48, revenue: 2400 },
//     { hour: '8 PM', bookings: 38, revenue: 1900 },
//     { hour: '9 PM', bookings: 25, revenue: 1250 },
//     { hour: '10 PM', bookings: 12, revenue: 600 }
//   ];

//   const monthlyTrends = [
//     { month: 'Jan', bookings: 1245, revenue: 62250, newUsers: 156 },
//     { month: 'Feb', bookings: 1389, revenue: 69450, newUsers: 178 },
//     { month: 'Mar', bookings: 1523, revenue: 76150, newUsers: 203 },
//     { month: 'Apr', bookings: 1678, revenue: 83900, newUsers: 234 },
//     { month: 'May', bookings: 1834, revenue: 91700, newUsers: 267 },
//     { month: 'Jun', bookings: 1967, revenue: 98350, newUsers: 289 },
//     { month: 'Jul', bookings: 2156, revenue: 107800, newUsers: 312 },
//     { month: 'Aug', bookings: 1843, revenue: 92150, newUsers: 198 }
//   ];

//   const venuePerformance = [
//     { venue: 'Arena Sports Complex', bookings: 245, revenue: 12250, utilization: 92, satisfaction: 4.8 },
//     { venue: 'Metro Sports Hub', bookings: 198, revenue: 9900, utilization: 78, satisfaction: 4.6 },
//     { venue: 'City Turf', bookings: 176, revenue: 8800, utilization: 85, satisfaction: 4.7 },
//     { venue: 'Elite Sports Center', bookings: 152, revenue: 7600, utilization: 68, satisfaction: 4.5 },
//     { venue: 'Sports Plaza', bookings: 134, revenue: 6700, utilization: 72, satisfaction: 4.3 },
//     { venue: 'Prime Courts', bookings: 128, revenue: 6400, utilization: 65, satisfaction: 4.4 }
//   ];

//   const sportsDistribution = [
//     { sport: 'Badminton', count: 465, percentage: 35 },
//     { sport: 'Tennis', count: 326, percentage: 25 },
//     { sport: 'Football', count: 264, percentage: 20 },
//     { sport: 'Basketball', count: 134, percentage: 10 },
//     { sport: 'Cricket', count: 132, percentage: 10 }
//   ];

//   // Prediction data with confidence intervals
//   const predictionMetrics = [
//     { 
//       metric: 'Bookings Next Week', 
//       current: 285, 
//       predicted: 312, 
//       confidence: 87, 
//       trend: 'up',
//       factors: ['Peak season approaching', 'New court opening', 'Marketing campaign']
//     },
//     { 
//       metric: 'Revenue Forecast (₹)', 
//       current: 14250, 
//       predicted: 16800, 
//       confidence: 82, 
//       trend: 'up',
//       factors: ['Premium court additions', 'Price optimization', 'Corporate bookings']
//     },
//     { 
//       metric: 'New User Signups', 
//       current: 45, 
//       predicted: 38, 
//       confidence: 79, 
//       trend: 'down',
//       factors: ['Market saturation', 'Competitor activity', 'Seasonal decline']
//     },
//     { 
//       metric: 'Customer Retention (%)', 
//       current: 78, 
//       predicted: 84, 
//       confidence: 91, 
//       trend: 'up',
//       factors: ['Loyalty program launch', 'Service improvements', 'Facility upgrades']
//     }
//   ];

//   const totalBookings = courtBookingData.reduce((sum, court) => sum + court.bookings, 0);
//   const totalRevenue = courtBookingData.reduce((sum, court) => sum + court.revenue, 0);
//   const averageRating = (courtBookingData.reduce((sum, court) => sum + court.rating, 0) / courtBookingData.length).toFixed(1);
//   const averageUtilization = Math.round(courtBookingData.reduce((sum, court) => sum + court.utilization, 0) / courtBookingData.length);

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: Eye },
//     { id: 'performance', label: 'Performance', icon: BarChart3 },
//     { id: 'insights', label: 'Customer Insights', icon: Users },
//     { id: 'predictions', label: 'Predictions', icon: Zap }
//   ];

//   const renderStars = (rating) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <Star key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
//     ));

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Confirmed': return 'status-confirmed';
//       case 'Pending': return 'status-pending';
//       case 'Cancelled': return 'status-cancelled';
//       default: return 'status-default';
//     }
//   };

//   const getTrendIcon = (trend) => {
//     switch (trend) {
//       case 'up': return <TrendingUp className="trend-up" />;
//       case 'down': return <TrendingDown className="trend-down" />;
//       default: return <Activity className="trend-stable" />;
//     }
//   };

//   const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea'];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return (
//           <div className="overview-grid">
//             <div className="card">
//               <div className="card-header">
//                 <h3>Top Performing Courts</h3>
//               </div>
//               <div className="card-body">
//                 {courtBookingData.slice(0, 6).map((court, index) => (
//                   <div key={court.court} className="performance-item">
//                     <div className="performance-rank">{index + 1}</div>
//                     <div className="performance-info">
//                       <div className="performance-title">{court.court}</div>
//                       <div className="performance-subtitle">{court.venue} • {court.sport}</div>
//                     </div>
//                     <div className="performance-stats">
//                       <div className="stat-value">{court.bookings}</div>
//                       <div className="stat-label">bookings</div>
//                     </div>
//                     <div className="performance-stats">
//                       <div className="stat-value">₹{court.revenue.toLocaleString()}</div>
//                       <div className="stat-label">revenue</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="card">
//               <div className="card-header">
//                 <h3>Recent Bookings</h3>
//               </div>
//               <div className="card-body">
//                 {recentBookings.map((booking) => (
//                   <div key={booking.id} className="booking-item">
//                     <div className="booking-info">
//                       <div className="booking-user">{booking.user}</div>
//                       <div className="booking-venue">{booking.venue} - {booking.court}</div>
//                       <div className="booking-time">{booking.date} • {booking.time}</div>
//                     </div>
//                     <div className="booking-status">
//                       <span className={getStatusClass(booking.status)}>
//                         {booking.status}
//                       </span>
//                       <div className="booking-amount">₹{booking.amount}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//       case 'performance':
//         return (
//           <div className="performance-grid">
//             <div className="card chart-card">
//               <div className="card-header">
//                 <h3>Hourly Booking Trends</h3>
//               </div>
//               <div className="card-body">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={hourlyBookings}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="hour" />
//                     <YAxis />
//                     <Tooltip />
//                     <Area type="monotone" dataKey="bookings" stroke="#2563eb" fill="#dbeafe" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="card chart-card">
//               <div className="card-header">
//                 <h3>Monthly Revenue Trend</h3>
//               </div>
//               <div className="card-body">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={monthlyTrends}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="card chart-card">
//               <div className="card-header">
//                 <h3>Venue Performance Comparison</h3>
//               </div>
//               <div className="card-body">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={venuePerformance}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="venue" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="utilization" fill="#2563eb" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="card chart-card">
//               <div className="card-header">
//                 <h3>Sports Distribution</h3>
//               </div>
//               <div className="card-body">
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={sportsDistribution}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={({ sport, percentage }) => `${sport} ${percentage}%`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="count"
//                     >
//                       {sportsDistribution.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         );

//       case 'insights':
//         return (
//           <div className="insights-grid">
//             <div className="card reviews-card">
//               <div className="card-header">
//                 <h3>Recent Customer Reviews</h3>
//               </div>
//               <div className="card-body">
//                 {customerReviews.map((review) => (
//                   <div key={review.id} className="review-item">
//                     <div className="review-header">
//                       <div className="review-user">
//                         <div className="user-name">{review.user}</div>
//                         {review.verified && <span className="verified-badge">Verified</span>}
//                       </div>
//                       <div className="review-date">{review.date}</div>
//                     </div>
//                     <div className="review-rating">
//                       <div className="stars">{renderStars(review.rating)}</div>
//                       <span className="rating-number">({review.rating}/5)</span>
//                     </div>
//                     <div className="review-venue">{review.venue} - {review.court}</div>
//                     <div className="review-comment">{review.comment}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//       case 'predictions':
//         return (
//           <div className="predictions-grid">
//             <div className="prediction-overview">
//               <h2>Predictive Analytics Dashboard</h2>
//               <p>AI-powered insights and forecasting for the next 7 days</p>
//             </div>
            
//             {predictionMetrics.map((pred, index) => (
//               <div key={index} className="prediction-card">
//                 <div className="prediction-header">
//                   <div className="prediction-metric">{pred.metric}</div>
//                   <div className="prediction-trend">{getTrendIcon(pred.trend)}</div>
//                 </div>
//                 <div className="prediction-values">
//                   <div className="current-value">
//                     <span className="value-label">Current</span>
//                     <span className="value-number">{pred.current.toLocaleString()}</span>
//                   </div>
//                   <div className="predicted-value">
//                     <span className="value-label">Predicted</span>
//                     <span className="value-number">{pred.predicted.toLocaleString()}</span>
//                   </div>
//                 </div>
//                 <div className="confidence-bar">
//                   <div className="confidence-label">Confidence: {pred.confidence}%</div>
//                   <div className="confidence-fill">
//                     <div 
//                       className="confidence-progress" 
//                       style={{ width: `${pred.confidence}%` }}
//                     ></div>
//                   </div>
//                 </div>
//                 <div className="prediction-factors">
//                   <div className="factors-label">Key Factors:</div>
//                   <ul className="factors-list">
//                     {pred.factors.map((factor, i) => (
//                       <li key={i}>{factor}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-container">
//         <div className="dashboard-header">
//           <h1>QuickCourt Analytics Dashboard</h1>
//           <p>Comprehensive insights and performance analytics</p>
//         </div>

//         <div className="metrics-grid">
//           <div className="metric-card">
//             <div className="metric-icon-container">
//               <Calendar className="metric-icon blue" />
//             </div>
//             <div className="metric-content">
//               <div className="metric-label">Total Bookings</div>
//               <div className="metric-value">{totalBookings.toLocaleString()}</div>
//               <div className="metric-change positive">+12% from last month</div>
//             </div>
//           </div>

//           <div className="metric-card">
//             <div className="metric-icon-container">
//               <DollarSign className="metric-icon green" />
//             </div>
//             <div className="metric-content">
//               <div className="metric-label">Total Revenue</div>
//               <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
//               <div className="metric-change positive">+18% from last month</div>
//             </div>
//           </div>

//           <div className="metric-card">
//             <div className="metric-icon-container">
//               <Activity className="metric-icon orange" />
//             </div>
//             <div className="metric-content">
//               <div className="metric-label">Avg Utilization</div>
//               <div className="metric-value">{averageUtilization}%</div>
//               <div className="metric-change neutral">+2% from last month</div>
//             </div>
//           </div>

//           <div className="metric-card">
//             <div className="metric-icon-container">
//               <Star className="metric-icon purple" />
//             </div>
//             <div className="metric-content">
//               <div className="metric-label">Avg Rating</div>
//               <div className="metric-value">{averageRating}</div>
//               <div className="metric-change positive">+0.3 from last month</div>
//             </div>
//           </div>
//         </div>

//         <div className="tabs-container">
//           <div className="tabs">
//             {tabs.map((tab) => {
//               const IconComponent = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`tab ${activeTab === tab.id ? 'active' : ''}`}
//                 >
//                   <IconComponent className="tab-icon" />
//                   {tab.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="tab-content">
//           {renderTabContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OwnerHomePage;

import React, { useState } from 'react';
import './OwnerHomePage.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Calendar, MapPin, Star, TrendingUp, Users, DollarSign, Activity, Trophy, AlertTriangle, Zap, Eye, BarChart3, TrendingDown,
  LogOut, User, Filter, RefreshCw, Target, Brain
} from 'lucide-react';

const OwnerHomePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  // Mock user data and auth functions (replace with your actual auth)
  const user = {
    name: 'John Smith',
    email: 'john.smith@quickcourt.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const handleLogout = async () => {
    // Your logout logic here
    // await logout();
    // navigate('/login');
    console.log('Logout clicked');
  };

  // Mock data
  const courtBookingData = [
    { court: 'Arena Sports Complex - Court A', venue: 'Arena Sports Complex', bookings: 245, sport: 'Badminton', revenue: 12250, rating: 4.8, utilization: 92, peakHours: '6-8 PM' },
    { court: 'Metro Sports Hub - Court 1', venue: 'Metro Sports Hub', bookings: 198, sport: 'Tennis', revenue: 9900, rating: 4.6, utilization: 78, peakHours: '7-9 AM' },
    { court: 'City Turf - Field B', venue: 'City Turf', bookings: 176, sport: 'Football', revenue: 8800, rating: 4.7, utilization: 85, peakHours: '5-7 PM' },
    { court: 'Elite Sports Center - Court 3', venue: 'Elite Sports Center', bookings: 152, sport: 'Badminton', revenue: 7600, rating: 4.5, utilization: 68, peakHours: '8-10 AM' },
    { court: 'Sports Plaza - Court 2', venue: 'Sports Plaza', bookings: 134, sport: 'Basketball', revenue: 6700, rating: 4.3, utilization: 72, peakHours: '6-8 PM' },
    { court: 'Prime Courts - Court A', venue: 'Prime Courts', bookings: 128, sport: 'Tennis', revenue: 6400, rating: 4.4, utilization: 65, peakHours: '9-11 AM' },
    { court: 'Galaxy Sports - Field 1', venue: 'Galaxy Sports', bookings: 112, sport: 'Cricket', revenue: 5600, rating: 4.2, utilization: 58, peakHours: '4-6 PM' },
    { court: 'Victory Sports - Court B', venue: 'Victory Sports', bookings: 98, sport: 'Badminton', revenue: 4900, rating: 4.1, utilization: 55, peakHours: '7-9 PM' }
  ];

  const recentBookings = [
    { id: 1, user: 'Rajesh Kumar', venue: 'Arena Sports Complex', court: 'Court A', sport: 'Badminton', date: '2024-08-11', time: '18:00-19:00', status: 'Confirmed', amount: 500 },
    { id: 2, user: 'Priya Singh', venue: 'Metro Sports Hub', court: 'Court 1', sport: 'Tennis', date: '2024-08-11', time: '19:00-20:00', status: 'Confirmed', amount: 600 },
    { id: 3, user: 'Amit Sharma', venue: 'City Turf', court: 'Field B', sport: 'Football', date: '2024-08-11', time: '17:30-18:30', status: 'Pending', amount: 800 },
    { id: 4, user: 'Neha Patel', venue: 'Elite Sports Center', court: 'Court 3', sport: 'Badminton', date: '2024-08-11', time: '20:00-21:00', status: 'Confirmed', amount: 450 },
    { id: 5, user: 'Vikram Reddy', venue: 'Sports Plaza', court: 'Court 2', sport: 'Basketball', date: '2024-08-11', time: '16:00-17:00', status: 'Confirmed', amount: 550 }
  ];

  const customerReviews = [
    { id: 1, user: 'Rahul Sharma', venue: 'Arena Sports Complex', court: 'Court A', rating: 5, comment: 'Excellent facilities and very clean courts. Staff was helpful too!', date: '2 hours ago', sport: 'Badminton', verified: true },
    { id: 2, user: 'Priya Patel', venue: 'Metro Sports Hub', court: 'Court 1', rating: 4, comment: 'Good court quality but parking could be better.', date: '5 hours ago', sport: 'Tennis', verified: true },
    { id: 3, user: 'Amit Kumar', venue: 'City Turf', court: 'Field B', rating: 5, comment: 'Amazing turf quality! Perfect for weekend matches.', date: '1 day ago', sport: 'Football', verified: false },
    { id: 4, user: 'Sneha Reddy', venue: 'Elite Sports Center', court: 'Court 3', rating: 3, comment: 'Court was okay but AC wasn\'t working properly. Need better maintenance.', date: '1 day ago', sport: 'Badminton', verified: true },
    { id: 5, user: 'Vikram Singh', venue: 'Sports Plaza', court: 'Court 2', rating: 4, comment: 'Good experience overall. Will book again for sure.', date: '2 days ago', sport: 'Basketball', verified: true },
    { id: 6, user: 'Kavya Nair', venue: 'Prime Courts', court: 'Court A', rating: 2, comment: 'Poor maintenance and booking system was confusing.', date: '2 days ago', sport: 'Tennis', verified: true },
    { id: 7, user: 'Arjun Verma', venue: 'Galaxy Sports', court: 'Field 1', rating: 5, comment: 'Outstanding cricket pitch quality! Will definitely return.', date: '3 days ago', sport: 'Cricket', verified: true },
    { id: 8, user: 'Meera Gupta', venue: 'Victory Sports', court: 'Court B', rating: 1, comment: 'Very disappointed with the service and court condition.', date: '3 days ago', sport: 'Badminton', verified: false }
  ];

  const hourlyBookings = [
    { hour: '6 AM', bookings: 15, revenue: 750 },
    { hour: '7 AM', bookings: 28, revenue: 1400 },
    { hour: '8 AM', bookings: 35, revenue: 1750 },
    { hour: '9 AM', bookings: 22, revenue: 1100 },
    { hour: '10 AM', bookings: 18, revenue: 900 },
    { hour: '11 AM', bookings: 12, revenue: 600 },
    { hour: '12 PM', bookings: 8, revenue: 400 },
    { hour: '1 PM', bookings: 6, revenue: 300 },
    { hour: '2 PM', bookings: 9, revenue: 450 },
    { hour: '3 PM', bookings: 14, revenue: 700 },
    { hour: '4 PM', bookings: 25, revenue: 1250 },
    { hour: '5 PM', bookings: 32, revenue: 1600 },
    { hour: '6 PM', bookings: 45, revenue: 2250 },
    { hour: '7 PM', bookings: 48, revenue: 2400 },
    { hour: '8 PM', bookings: 38, revenue: 1900 },
    { hour: '9 PM', bookings: 25, revenue: 1250 },
    { hour: '10 PM', bookings: 12, revenue: 600 }
  ];

  const monthlyTrends = [
    { month: 'Jan', bookings: 1245, revenue: 62250, newUsers: 156 },
    { month: 'Feb', bookings: 1389, revenue: 69450, newUsers: 178 },
    { month: 'Mar', bookings: 1523, revenue: 76150, newUsers: 203 },
    { month: 'Apr', bookings: 1678, revenue: 83900, newUsers: 234 },
    { month: 'May', bookings: 1834, revenue: 91700, newUsers: 267 },
    { month: 'Jun', bookings: 1967, revenue: 98350, newUsers: 289 },
    { month: 'Jul', bookings: 2156, revenue: 107800, newUsers: 312 },
    { month: 'Aug', bookings: 1843, revenue: 92150, newUsers: 198 }
  ];

  const venuePerformance = [
    { venue: 'Arena Sports Complex', bookings: 245, revenue: 12250, utilization: 92, satisfaction: 4.8 },
    { venue: 'Metro Sports Hub', bookings: 198, revenue: 9900, utilization: 78, satisfaction: 4.6 },
    { venue: 'City Turf', bookings: 176, revenue: 8800, utilization: 85, satisfaction: 4.7 },
    { venue: 'Elite Sports Center', bookings: 152, revenue: 7600, utilization: 68, satisfaction: 4.5 },
    { venue: 'Sports Plaza', bookings: 134, revenue: 6700, utilization: 72, satisfaction: 4.3 },
    { venue: 'Prime Courts', bookings: 128, revenue: 6400, utilization: 65, satisfaction: 4.4 }
  ];

  const sportsDistribution = [
    { sport: 'Badminton', count: 465, percentage: 35 },
    { sport: 'Tennis', count: 326, percentage: 25 },
    { sport: 'Football', count: 264, percentage: 20 },
    { sport: 'Basketball', count: 134, percentage: 10 },
    { sport: 'Cricket', count: 132, percentage: 10 }
  ];

  // Enhanced prediction data with interactive features
  const predictionMetrics = [
    { 
      id: 'bookings',
      metric: 'Bookings Next Week', 
      current: 285, 
      predicted: 312, 
      confidence: 87, 
      trend: 'up',
      factors: ['Peak season approaching', 'New court opening', 'Marketing campaign'],
      details: {
        breakdown: [
          { day: 'Mon', predicted: 42, confidence: 89 },
          { day: 'Tue', predicted: 38, confidence: 85 },
          { day: 'Wed', predicted: 45, confidence: 91 },
          { day: 'Thu', predicted: 48, confidence: 88 },
          { day: 'Fri', predicted: 52, confidence: 85 },
          { day: 'Sat', predicted: 48, confidence: 83 },
          { day: 'Sun', predicted: 39, confidence: 87 }
        ]
      }
    },
    { 
      id: 'revenue',
      metric: 'Revenue Forecast (₹)', 
      current: 14250, 
      predicted: 16800, 
      confidence: 82, 
      trend: 'up',
      factors: ['Premium court additions', 'Price optimization', 'Corporate bookings'],
      details: {
        breakdown: [
          { day: 'Mon', predicted: 2100, confidence: 84 },
          { day: 'Tue', predicted: 1950, confidence: 80 },
          { day: 'Wed', predicted: 2400, confidence: 86 },
          { day: 'Thu', predicted: 2600, confidence: 82 },
          { day: 'Fri', predicted: 2900, confidence: 79 },
          { day: 'Sat', predicted: 2750, confidence: 81 },
          { day: 'Sun', predicted: 2100, confidence: 85 }
        ]
      }
    },
    { 
      id: 'users',
      metric: 'New User Signups', 
      current: 45, 
      predicted: 38, 
      confidence: 79, 
      trend: 'down',
      factors: ['Market saturation', 'Competitor activity', 'Seasonal decline'],
      details: {
        breakdown: [
          { day: 'Mon', predicted: 6, confidence: 78 },
          { day: 'Tue', predicted: 5, confidence: 82 },
          { day: 'Wed', predicted: 7, confidence: 76 },
          { day: 'Thu', predicted: 4, confidence: 80 },
          { day: 'Fri', predicted: 8, confidence: 75 },
          { day: 'Sat', predicted: 5, confidence: 81 },
          { day: 'Sun', predicted: 3, confidence: 83 }
        ]
      }
    },
    { 
      id: 'retention',
      metric: 'Customer Retention (%)', 
      current: 78, 
      predicted: 84, 
      confidence: 91, 
      trend: 'up',
      factors: ['Loyalty program launch', 'Service improvements', 'Facility upgrades'],
      details: {
        breakdown: [
          { segment: 'New Users', predicted: 72, confidence: 88 },
          { segment: 'Regular Users', predicted: 89, confidence: 94 },
          { segment: 'Premium Users', predicted: 95, confidence: 92 },
          { segment: 'Corporate', predicted: 87, confidence: 90 }
        ]
      }
    }
  ];

  const totalBookings = courtBookingData.reduce((sum, court) => sum + court.bookings, 0);
  const totalRevenue = courtBookingData.reduce((sum, court) => sum + court.revenue, 0);
  const averageRating = (courtBookingData.reduce((sum, court) => sum + court.rating, 0) / courtBookingData.length).toFixed(1);
  const averageUtilization = Math.round(courtBookingData.reduce((sum, court) => sum + court.utilization, 0) / courtBookingData.length);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'insights', label: 'Customer Insights', icon: Users },
    { id: 'predictions', label: 'Predictions', icon: Zap }
  ];

  const performanceFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'Last Week' },
    { id: 'month', label: 'Last Month' },
    { id: 'year', label: 'Last Year' }
  ];

  const ratingFilters = [
    { id: 'all', label: 'All Ratings' },
    { id: '5', label: '5 Stars' },
    { id: '4', label: '4+ Stars' },
    { id: '3', label: '3+ Stars' },
    { id: '2', label: '2+ Stars' },
    { id: '1', label: '1+ Stars' }
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
    ));

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="trend-up" />;
      case 'down': return <TrendingDown className="trend-down" />;
      default: return <Activity className="trend-stable" />;
    }
  };

  const getFilteredReviews = () => {
    if (ratingFilter === 'all') return customerReviews;
    const minRating = parseInt(ratingFilter);
    return customerReviews.filter(review => review.rating >= minRating);
  };

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-grid">
            <div className="card">
              <div className="card-header">
                <h3>Top Performing Courts</h3>
              </div>
              <div className="card-body">
                {courtBookingData.slice(0, 6).map((court, index) => (
                  <div key={court.court} className="performance-item">
                    <div className="performance-rank">{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-title">{court.court}</div>
                      <div className="performance-subtitle">{court.venue} • {court.sport}</div>
                    </div>
                    <div className="performance-stats">
                      <div className="stat-value">{court.bookings}</div>
                      <div className="stat-label">bookings</div>
                    </div>
                    <div className="performance-stats">
                      <div className="stat-value">₹{court.revenue.toLocaleString()}</div>
                      <div className="stat-label">revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Recent Bookings</h3>
              </div>
              <div className="card-body">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <div className="booking-user">{booking.user}</div>
                      <div className="booking-venue">{booking.venue} - {booking.court}</div>
                      <div className="booking-time">{booking.date} • {booking.time}</div>
                    </div>
                    <div className="booking-status">
                      <span className={getStatusClass(booking.status)}>
                        {booking.status}
                      </span>
                      <div className="booking-amount">₹{booking.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="performance-section">
            <div className="performance-filters">
              <div className="filter-group">
                <Filter className="filter-icon" />
                <span className="filter-label">Time Period:</span>
                <div className="filter-buttons">
                  {performanceFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setPerformanceFilter(filter.id)}
                      className={`filter-button ${performanceFilter === filter.id ? 'active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="performance-grid">
              <div className="card chart-card">
                <div className="card-header">
                  <h3>Hourly Booking Trends</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={hourlyBookings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="bookings" stroke="#2563eb" fill="#dbeafe" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3>Monthly Revenue Trend</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3>Venue Performance Comparison</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={venuePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="venue" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="utilization" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3>Sports Distribution</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sportsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ sport, percentage }) => `${sport} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {sportsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="insights-section">
            <div className="insights-filters">
              <div className="filter-group">
                <Star className="filter-icon" />
                <span className="filter-label">Filter by Rating:</span>
                <div className="filter-buttons">
                  {ratingFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setRatingFilter(filter.id)}
                      className={`filter-button ${ratingFilter === filter.id ? 'active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="insights-grid">
              <div className="card reviews-card">
                <div className="card-header">
                  <h3>Customer Reviews ({getFilteredReviews().length} reviews)</h3>
                </div>
                <div className="card-body">
                  {getFilteredReviews().map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user">
                          <div className="user-name">{review.user}</div>
                          {review.verified && <span className="verified-badge">Verified</span>}
                        </div>
                        <div className="review-date">{review.date}</div>
                      </div>
                      <div className="review-rating">
                        <div className="stars">{renderStars(review.rating)}</div>
                        <span className="rating-number">({review.rating}/5)</span>
                      </div>
                      <div className="review-venue">{review.venue} - {review.court}</div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="predictions-section">
            <div className="prediction-overview">
              <Brain className="prediction-brain-icon" />
              <h2>AI-Powered Predictive Analytics</h2>
              <p>Machine learning insights and forecasting for the next 7 days</p>
            </div>
            
            <div className="predictions-grid">
              {predictionMetrics.map((pred, index) => (
                <div 
                  key={index} 
                  className={`prediction-card ${selectedPrediction === pred.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPrediction(selectedPrediction === pred.id ? null : pred.id)}
                >
                  <div className="prediction-header">
                    <div className="prediction-metric">{pred.metric}</div>
                    <div className="prediction-trend">{getTrendIcon(pred.trend)}</div>
                  </div>
                  <div className="prediction-values">
                    <div className="current-value">
                      <span className="value-label">Current</span>
                      <span className="value-number">{pred.current.toLocaleString()}</span>
                    </div>
                    <div className="predicted-value">
                      <span className="value-label">Predicted</span>
                      <span className="value-number">{pred.predicted.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-label">Confidence: {pred.confidence}%</div>
                    <div className="confidence-fill">
                      <div 
                        className="confidence-progress" 
                        style={{ width: `${pred.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="prediction-factors">
                    <div className="factors-label">Key Factors:</div>
                    <ul className="factors-list">
                      {pred.factors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedPrediction === pred.id && (
                    <div className="prediction-details">
                      <div className="details-header">
                        <Target className="details-icon" />
                        <span>Detailed Breakdown</span>
                      </div>
                      <div className="details-chart">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={pred.details.breakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={pred.id === 'retention' ? 'segment' : 'day'} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="predicted" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  <div className="click-hint">
                    {selectedPrediction === pred.id ? 'Click to collapse' : 'Click for detailed breakdown'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>QuickCourt Analytics Dashboard</h1>
              <p>Comprehensive insights and performance analytics</p>
            </div>
            <div className="user-profile">
              <div className="profile-info">
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
                <div className="profile-details">
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-email">{user.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-container">
              <Calendar className="metric-icon blue" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Total Revenue</div>
              <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
              <div className="metric-change positive">+18% from last month</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container">
              <Activity className="metric-icon orange" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Avg Utilization</div>
              <div className="metric-value">{averageUtilization}%</div>
              <div className="metric-change neutral">+2% from last month</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container">
              <Star className="metric-icon purple" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Avg Rating</div>
              <div className="metric-value">{averageRating}</div>
              <div className="metric-change positive">+0.3 from last month</div>
            </div>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <IconComponent className="tab-icon" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerHomePage;