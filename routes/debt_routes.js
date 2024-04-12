const express = require("express");
const router = express.Router();
const debtController = require("../controllers/debt_controller");

router.use(express.json());

router.post("/create", debtController.create);
router.get("/getDebt", debtController.getDebtList);
router.put("/payDebt", debtController.updateDebt);
router.post("/createMassDebt", debtController.massDebitCreate);
router.get(
  "/getTotalExpectedRevenueByYearAndMonth",
  debtController.totalExpectedRevenue
);
router.get("/getTotalRevenueByYearAndMonth", debtController.totalRevenue);
router.get("/getDebtUserList", debtController.getDebtUserList);
router.get("/getNotPayedDebts", debtController.getNotPayedDebts);
router.get("/getPayedDebts", debtController.getPayedDebts);
router.get("/getUnitDebtList", debtController.getUnitDebtList);

module.exports = router;
