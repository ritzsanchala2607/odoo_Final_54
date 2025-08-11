module.exports = (sequelize, DataTypes) => {
  const VenuePhoto = sequelize.define('VenuePhoto', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    venue_id: { type: DataTypes.UUID, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    caption: DataTypes.TEXT,
    is_cover: { type: DataTypes.BOOLEAN, defaultValue: false },
    sort_idx: DataTypes.INTEGER
  }, {
    tableName: 'venue_photo',
    timestamps: true
  });

  VenuePhoto.associate = (models) => {
    VenuePhoto.belongsTo(models.Venue, { foreignKey: 'venue_id', as: 'venue' });
  };

  return VenuePhoto;
};
