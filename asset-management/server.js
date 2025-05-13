const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes'); 
const assetRoutes = require('./routes/assetRoutes')
const assetCategoryRoutes = require('./routes/assetCategoryRoutes');
const stockViewRoutes = require('./routes/stockViewRoutes')
const assetHistoryRoutes = require('./routes/assetHistoryRoutes')
const db = require('./index');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/employees', employeeRoutes);
app.use('/assets', assetRoutes);
app.use('/assetCategories', assetCategoryRoutes);
app.use('/stockViewRoutes', stockViewRoutes)
app.use('/assetHistory', assetHistoryRoutes)
app.set('view engine', 'pug');
app.set('views', './views');
require('dotenv').config();
app.use(express.static('public'));
const PORT=process.env.PORT || 8000
app.get('/', stockViewRoutes);

db.sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
