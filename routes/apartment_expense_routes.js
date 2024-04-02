const express = require("express");
const router = express.Router();
const apartmentExpenseController = require("../controllers/apartment_expense_controller");

router.use(express.json());

router.post(
  "/createFixedExpense",
  apartmentExpenseController.createFixedExpense
);
router.post(
  "/createOneTimeExpense",
  apartmentExpenseController.createOneTimeExpense
);
router.get("/getFixedExpenses", apartmentExpenseController.getFixedExpenses);
router.get(
  "/getOneTimeExpenses",
  apartmentExpenseController.getOneTimeExpenses
);
router.delete(
  "/deleteFixedExpense",
  apartmentExpenseController.deleteFixedExpense
);
router.put(
  "/updateFixedExpense",
  apartmentExpenseController.updateFixedExpense
);
router.put(
  "/updateOneTimeExpense",
  apartmentExpenseController.updateOneTimeexpense
);

module.exports = router;
