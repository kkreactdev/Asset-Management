const express = require('express');
const router = express.Router();
const AssetController = require('../controllers/assetControllers');

router.get('/', AssetController.list);
router.get('/add', AssetController.addForm);
router.post('/add', AssetController.add);
router.get('/edit/:id', AssetController.editForm);
router.post('/edit/:id', AssetController.edit);
router.get('/delete/:id', AssetController.delete);
router.get('/issue', AssetController.issue);
router.post('/issue', AssetController.issueSave);
router.get('/return', AssetController.return);
router.post('/return', AssetController.returnSave);
router.get('/scrap', AssetController.scrap);
router.post('/scrap', AssetController.scrapSave);

module.exports = router;
