module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    assetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Available',
    },
    condition: {
      type: DataTypes.STRING,
      defaultValue: 'New',
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AssetCategories',
        key: 'id',
      },
    },
    returnReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isScrapped: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    scrapDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    scrapReason: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Asset.associate = (models) => {
    Asset.belongsTo(models.AssetCategory, { foreignKey: 'categoryId' });
    Asset.belongsTo(models.Employee, { foreignKey: 'assignedTo' });
  };

  return Asset;
};
