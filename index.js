const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const cors = require("cors");
const authRoute = require("./routes/auth");
const productsRoute = require("./routes/products");
const cartsRoute = require("./routes/carts");
const path = require("path");
const multer = require("multer");

dotenv.config();
app.use(express.json());
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to database"))
  .catch((err) => console.log(err));

app.use(cors());
app.use("/public", express.static("public"));
app.use("/cartimgs", express.static("cartimgs"));
app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen("5000", () => {
  console.log("Backend is running");
});

app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error("Something went wrong"));
  });
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
