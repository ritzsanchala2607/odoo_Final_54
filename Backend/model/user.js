module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'owner', 'admin'), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    otp_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    avatar_url: DataTypes.TEXT,
    full_name: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    short_bio: DataTypes.TEXT,
    credit_balance: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    otp: DataTypes.TEXT,
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Venue, { foreignKey: 'owner_id', as: 'venues' });
    User.hasMany(models.Booking, { foreignKey: 'user_id', as: 'bookings' });
    User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
    User.hasMany(models.FacilityApplication, { foreignKey: 'owner_id', as: 'applications' });
    User.hasMany(models.AuditLog, { foreignKey: 'actor_id', as: 'audit_logs' });
  };

  return User;
};
