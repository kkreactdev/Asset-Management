const express = require('express');
const router = express.Router();
const AssetCategoryController = require('../controllers/assetCategoryControllers');

router.get('/', AssetCategoryController.list);
router.get('/add', AssetCategoryController.addForm);
router.post('/add', AssetCategoryController.add);
router.get('/edit/:id', AssetCategoryController.editForm);
router.post('/edit/:id', AssetCategoryController.edit);
router.get('/delete/:id', AssetCategoryController.delete);

module.exports = router;
