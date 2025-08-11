import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Activity,
  Building,
  DollarSign,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const cityWiseData = [
    { name: "Mumbai", value: 35, bookings: 1250, revenue: 87500 },
    { name: "Delhi", value: 25, bookings: 890, revenue: 62300 },
    { name: "Bangalore", value: 20, bookings: 720, revenue: 50400 },
    { name: "Chennai", value: 12, bookings: 430, revenue: 30100 },
    { name: "Pune", value: 8, bookings: 290, revenue: 20300 },
  ];

  const gameWiseEarnings = [
    { name: "Badminton", value: 40, earnings: 142000, courts: 45 },
    { name: "Tennis", value: 25, earnings: 89250, courts: 28 },
    { name: "Football Turf", value: 20, earnings: 71400, courts: 15 },
    { name: "Basketball", value: 10, earnings: 35700, courts: 12 },
    { name: "Cricket Net", value: 5, earnings: 17850, courts: 8 },
  ];

  const suspiciousActivities = [
    {
      id: 1,
      type: "Multiple bookings",
      user: "user_12345",
      venue: "Sports Hub Mumbai",
      time: "2 hours ago",
      severity: "high",
    },
    {
      id: 2,
      type: "Payment anomaly",
      user: "user_67890",
      venue: "Court Master Delhi",
      time: "4 hours ago",
      severity: "medium",
    },
    {
      id: 3,
      type: "Unusual login pattern",
      user: "user_54321",
      venue: "N/A",
      time: "6 hours ago",
      severity: "low",
    },
    {
      id: 4,
      type: "Fake reviews detected",
      user: "user_98765",
      venue: "Elite Sports Bangalore",
      time: "1 day ago",
      severity: "high",
    },
    {
      id: 5,
      type: "Account verification issue",
      user: "user_11111",
      venue: "N/A",
      time: "2 days ago",
      severity: "medium",
    },
  ];

  const weeklyTrends = [
    { day: "Mon", bookings: 120, revenue: 8400 },
    { day: "Tue", bookings: 135, revenue: 9450 },
    { day: "Wed", bookings: 165, revenue: 11550 },
    { day: "Thu", bookings: 180, revenue: 12600 },
    { day: "Fri", bookings: 220, revenue: 15400 },
    { day: "Sat", bookings: 280, revenue: 19600 },
    { day: "Sun", bookings: 250, revenue: 17500 },
  ];

  const statsCards = [
    {
      title: "Active Users",
      value: "12,486",
      change: "+12%",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Venues",
      value: "340",
      change: "+8%",
      icon: Building,
      color: "teal",
    },
    {
      title: "Active Courts",
      value: "1,247",
      change: "+15%",
      icon: MapPin,
      color: "purple",
    },
    {
      title: "Today's Revenue",
      value: "₹45,280",
      change: "+23%",
      icon: DollarSign,
      color: "orange",
    },
  ];

  const COLORS = ["#14B8A6", "#8B5CF6", "#F59E0B", "#EF4444", "#3B82F6"];

  const handleTimeRangeChange = (range) => {
    setIsLoading(true);
    setSelectedTimeRange(range);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="brand-logo">Q</div>
            <div>
              <h1>QuickCourt Admin</h1>
              <p>Manage your sports facility booking platform</p>
            </div>
          </div>
          <div className="time-range-selector">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                className={`time-btn ${
                  selectedTimeRange === range ? "active" : ""
                }`}
                onClick={() => handleTimeRangeChange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
                <span
                  className={`stat-change ${
                    stat.change.startsWith("+") ? "positive" : "negative"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* City-wise Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>City-wise Distribution</h3>
              <div className="chart-info">
                <Activity size={16} />
                <span>Booking Ratio</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={cityWiseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cityWiseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.bookings} bookings)`,
                      "Share",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {cityWiseData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>
                    {item.name}: ₹{item.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Game-wise Earnings */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Game-wise Earnings</h3>
              <div className="chart-info">
                <TrendingUp size={16} />
                <span>Revenue Share</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={gameWiseEarnings}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {gameWiseEarnings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `₹${props.payload.earnings.toLocaleString()} (${
                        props.payload.courts
                      } courts)`,
                      "Earnings",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {gameWiseEarnings.slice(0, 4).map((item, index) => (
                <div key={item.name} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>
                    {item.name}: ₹{item.earnings.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Weekly Booking Trends</h3>
            <div className="chart-info">
              <Calendar size={16} />
              <span>Last 7 Days</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  name="Bookings"
                  dot={{ fill: "#14B8A6", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Revenue (₹)"
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suspicious Activities */}
        <div className="activity-section">
          <div className="section-header">
            <h3>
              <AlertTriangle size={20} />
              Recent Suspicious Activities
            </h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {suspiciousActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-indicator">
                  <div
                    className="severity-dot"
                    style={{
                      backgroundColor: getSeverityColor(activity.severity),
                    }}
                  ></div>
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <span className="activity-type">{activity.type}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-details">
                    <span>User: {activity.user}</span>
                    {activity.venue !== "N/A" && (
                      <>
                        <span className="separator">•</span>
                        <span>Venue: {activity.venue}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="activity-actions">
                  <button className="action-btn investigate">
                    Investigate
                  </button>
                  <button className="action-btn dismiss">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
