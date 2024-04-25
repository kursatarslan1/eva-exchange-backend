const { connectToDatabase } = require("./middleware/database");
const express = require('express');
const app = express();

// Evcil Dostum

const productRoutes = require("./routes/product_routes");
const userRoutes = require("./routes/users_routes");

require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.set("trust proxy", true);

app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use("/fatih/product", productRoutes);
app.use("/fatih/user", userRoutes);

const PORT = 3000;

connectToDatabase();

app.listen(PORT, () => {
  console.log("Application Up!");
});
