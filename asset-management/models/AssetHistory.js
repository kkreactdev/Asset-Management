module.exports = (sequelize, DataTypes) => {
    const AssetHistory = sequelize.define('AssetHistory', {
      assetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    });
  
    AssetHistory.associate = models => {
      AssetHistory.belongsTo(models.Asset, { foreignKey: 'assetId' });
    };
  
    return AssetHistory;
  };
  