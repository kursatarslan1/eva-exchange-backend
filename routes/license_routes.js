const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/license_controller');

router.use(express.json());

router.post('/create', licenseController.create);
router.get('/getLicense', licenseController.getLicenseByApartmentId);
router.put('/assign', licenseController.assignLicense);
router.get('/getLicensePackages', licenseController.getLicensePackages);

module.exports = router;