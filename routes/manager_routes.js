const express = require("express");
const router = express.Router();

const managerController = require("../controllers/manager_controller");

router.use(express.json());

router.post("/login", managerController.login);
router.post("/register", managerController.register);
router.put("/deactive", managerController.deactive);
router.get("/getInformationByEmail", managerController.getInformationByEmail);
router.put("/updateManagerInfo", managerController.updateManager);
router.post("/tokenisvalid", managerController.tokenIsValid);
router.get("/getInformationByToken", managerController.getInformationByToken);
router.put("/changePassword", managerController.changePassword);

module.exports = router;
