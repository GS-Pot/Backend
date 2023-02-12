const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const mongoose = require('mongoose');
const bodyParser = require("body-parser");
// const dotenv = require("dotenv");

const PORT = 4000;
const db = require("./utils/Dynamo");
const crop = require("./routes/crops.routes");
const payment = require("./routes/payment.routes");
const auth = require("./routes/auth.routes");
const forum = require("./routes/forum.routes");
// const schemes = require("./routes/schemes.routes");
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/crops", crop);
app.use("/", payment);
app.use("/", auth);
app.use("/", forum);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.use("/", schemes);

app.post("/", async (req, res) => {
  const params = {
    pk: "gspot",
    sk: `try#data1`,
    ...req.body,
    created: Date.now(),
  };
  await db.put(params, process.env.TABLE_NAME);
  return res.json({ message: "success" });
});

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});
