const Sequelize = require('sequelize');
const sequelize = require('./database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Employee = require('./models/Employee')(sequelize, Sequelize.DataTypes);
db.AssetCategory = require('./models/AssetCategory')(sequelize, Sequelize.DataTypes);
db.Asset = require('./models/Asset')(sequelize, Sequelize.DataTypes);
db.AssetHistory = require('./models/AssetHistory')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
