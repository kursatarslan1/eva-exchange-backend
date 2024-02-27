const express = require('express');
const router = express.Router();
const racController = require('../controllers/rac_controller');

router.use(express.json());

router.post('/create', racController.createRac);
router.get('/getRacList', racController.getRacList);
router.delete('/deleteRac', racController.deleteRac);

module.exports = router;