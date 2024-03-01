const express = require('express');
const router = express.Router();
const cohabitantController = require('../controllers/cohabitants_controller');

router.use(express.json());

router.post('/create', cohabitantController.createCohabitants);
router.get('/getCohabitants', cohabitantController.findCohabitants);
router.put('/deleteCohabitants', cohabitantController.deleteCohabitants);
router.put('/updateCohabitants', cohabitantController.updateCohabitants);

module.exports = router;