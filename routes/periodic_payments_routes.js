const express = require("express");
const router = express.Router();
const periodController = require("../controllers/periodic_payments_model");

router.use(express.json());

router.post("/create", periodController.createPeriodicPayment);
router.get("/getPeriodicPaymentList", periodController.getPeriodicPayments);
router.delete("/deletePeriodicPayment", periodController.deletePeriodicPayment);

module.exports = router;
