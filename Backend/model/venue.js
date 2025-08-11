module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    owner_id: { type: DataTypes.UUID },
    name: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    address: DataTypes.TEXT,
    city: DataTypes.TEXT,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    starting_price: DataTypes.DECIMAL(10, 2),
    rating_avg: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
    status: { type: DataTypes.TEXT, defaultValue: 'pending' },
    approved_by: { type: DataTypes.UUID },
    approved_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'venues',
    timestamps: false
  });

  Venue.associate = (models) => {
    Venue.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    Venue.hasMany(models.Court, { foreignKey: 'venue_id', as: 'courts' });
    Venue.hasMany(models.Booking, { foreignKey: 'venue_id', as: 'bookings' });
    Venue.hasMany(models.Review, { foreignKey: 'venue_id', as: 'reviews' });
    Venue.hasMany(models.VenuePhoto, { foreignKey: 'venue_id', as: 'photos' });
    Venue.belongsToMany(models.Amenity, { through: models.VenueAmenity, foreignKey: 'venue_id', as: 'amenities' });
  };

  return Venue;
};
