const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeControllers');

router.get('/', employeeController.list);
router.get('/add', employeeController.addForm);
router.post('/add', employeeController.add);
router.get('/edit/:id', employeeController.editForm);
router.post('/edit/:id', employeeController.edit);

module.exports = router;
