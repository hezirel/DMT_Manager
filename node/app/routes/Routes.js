const express = require('express');
const router = express.Router();

const getDriversController = require('../controllers/Controllers').getDriversController;
const postDriverController = require('../controllers/Controllers').postDriverController;

router.get('/', getDriversController);
router.post('/', postDriverController);

module.exports = router;
