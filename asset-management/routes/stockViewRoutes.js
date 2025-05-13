const express = require('express');
const router = express.Router();
const stockViewController = require('../controllers/stockViewControllers');

router.get('/', stockViewController.stockView);

module.exports = router;
