const express = require('express');
const router = express.Router();
const AssetHistoryController = require('../controllers/assetHistoryControllers');

router.get('/', AssetHistoryController.selectAsset);
router.post('/view', AssetHistoryController.viewHistory)

module.exports = router;
