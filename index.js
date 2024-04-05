const { connectToDatabase } = require("./middleware/database");
const express = require("express");
const app = express();

const managerRoutes = require("./routes/manager_routes");
const apartmentRoutes = require("./routes/apartment_routes");
const residentRoutes = require("./routes/resident_routes");
const addressRoutes = require("./routes/address_routes");
const racRoutes = require("./routes/rac_routes");
const announcementRoutes = require("./routes/announcement_routes");
const cohabitantsRoutes = require("./routes/cohabitants_routes");
const messageRoutes = require("./routes/message_routes");
const licenseRoutes = require("./routes/license_routes");
const debtRoutes = require("./routes/debt_routes");
const paymentHistoryRoutes = require("./routes/payment_history_routes");
const knowledgeAndRulesRotes = require("./routes/knowledge_and_rules_routes");
const unitRoutes = require("./routes/unit_routes");
const todoListRoutes = require("./routes/todolist_routes");
const tillRoutes = require("./routes/till_routes");
const accountRoutes = require("./routes/account_routes");
const apartmentExpenseRoutes = require("./routes/apartment_expense_routes");
const periodicPaymentsRoutes = require("./routes/periodic_payments_routes");

require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set("trust proxy", true);

app.use(express.json({ limit: "50mb" })); // JSON veri boyutu sınırı
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/steyon/manager", managerRoutes); // is auth sor!
app.use("/steyon/apartment", apartmentRoutes);
app.use("/steyon/resident", residentRoutes);
app.use("/steyon/address", addressRoutes);
app.use("/steyon/rac", racRoutes);
app.use("/steyon/announcement", announcementRoutes);
app.use("/steyon/cohabitants", cohabitantsRoutes);
app.use("/steyon/messages", messageRoutes);
app.use("/steyon/license", licenseRoutes);
app.use("/steyon/debt", debtRoutes);
app.use("/steyon/paymentHistory", paymentHistoryRoutes);
app.use("/steyon/knowledgeAndRules", knowledgeAndRulesRotes);
app.use("/steyon/unit", unitRoutes);
app.use("/steyon/todo", todoListRoutes);
app.use("/steyon/till", tillRoutes);
app.use("/steyon/account", accountRoutes);
app.use("/steyon/apartmentExpense", apartmentExpenseRoutes);
app.use("/steyon/periodicPayment", periodicPaymentsRoutes);

const PORT = 3000;

connectToDatabase();

app.listen(PORT, () => {
  console.log("Application Up!");
});
