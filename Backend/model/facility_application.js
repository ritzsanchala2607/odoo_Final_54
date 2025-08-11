module.exports = (sequelize, DataTypes) => {
  const FacilityApplication = sequelize.define('FacilityApplication', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    owner_id: { type: DataTypes.UUID },
    venue_id: { type: DataTypes.UUID },
    status: { type: DataTypes.TEXT, defaultValue: 'pending' },
    submitted_at: { type: DataTypes.DATE },
    decided_by: { type: DataTypes.UUID },
    decided_at: { type: DataTypes.DATE },
    decision_notes: { type: DataTypes.TEXT }
  }, {
    tableName: 'facility_applications',
    timestamps: false
  });

  FacilityApplication.associate = (models) => {
    FacilityApplication.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    FacilityApplication.belongsTo(models.Venue, { foreignKey: 'venue_id', as: 'venue' });
    FacilityApplication.belongsTo(models.User, { foreignKey: 'decided_by', as: 'decider' });
  };

  return FacilityApplication;
};

