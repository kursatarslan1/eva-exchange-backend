const express = require('express');
const app = express();
const sequelize = require("./config/database_config"); 

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

sequelize.authenticate()
  .then(() => {
    console.log('Database connection is success.');
    startServer();
  })
  .catch(error => {
    console.error('Database connection is failed:', error);
  });

  const startServer = () => {
    const UserModel = require("./models/Users");
    const TradeModel = require("./models/Trades");
    const ShareModel = require("./models/Shares");
    const PortfolioModel = require("./models/Portfolio");
    const MarketModel = require("./models/Market");
  
  
    app.use("/eva/user", userRoutes);
    app.use("/eva/trade", tradeRoutes);
    app.use("/eva/share", shareRoutes);
    app.use("/eva/portfolio", portfolioRoutes);
    app.use("/eva/market", marketRoutes);
  
    const PORT = 3000;
  
    app.listen(PORT, () => {
      console.log("Application up!");
    });
  };