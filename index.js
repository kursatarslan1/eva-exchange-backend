const { connectToDatabase } = require("./middleware/database");
const express = require('express');
const app = express();

const userRoutes = require("./routes/users_routes");
const tradeRoutes = require("./routes/trade_routes.js");
const shareRoutes = require("./routes/share_routes.js");
const portfolioRoutes = require("./routes/portfolio_routes.js");
const marketRoutes = require("./routes/market_routes.js");

require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.set("trust proxy", true);

app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use("/eva/user", userRoutes);
app.use("/eva/trade", tradeRoutes);
app.use("/eva/share", shareRoutes);
app.use("/eva/portfolio", portfolioRoutes);
app.use("/eva/market", marketRoutes);


const PORT = 3000;

connectToDatabase();

app.listen(PORT, () => {
  console.log("Application Up!");
});
