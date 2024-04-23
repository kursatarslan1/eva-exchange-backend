const { connectToDatabase } = require("./middleware/database");
const express = require("express");
const app = express();

// Evcil Dostum

const productRoutes = require("./routes/product_routes");

require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set("trust proxy", true);

app.use(express.json({ limit: "50mb" })); // JSON veri boyutu sınırı
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use("/evcildostum/product", productRoutes);

const PORT = 3000;

connectToDatabase();

app.listen(PORT, () => {
  console.log("Application Up!");
});
