const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
// import db from "../utils/Dynamo";
// const DB = require('../utils/Dynamo');
const db = require("../utils/Dynamo");
require("dotenv").config();
const razorpay_instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const TABLE_NAME = process.env.TABLE_NAME;
router.post("/payment/createOrder", async (req, res) => {
  try {
    // const TableName = process.env.TABLE_NAME;
    // const { event_id, event_category } = req.body;
    // if (!event_id || !event_category)
    //   return res.status(422).json({ message: "Missing Event Details!" });
    // const event = await DB.get(
    //   "aaruush",
    //   `event#${event_category}#${event_id}`,
    //   process.env.TABLE_NAME
    // );
    const { userId } = req.body;
    const { amount } = req.body;
    const user = await db.queryBeginsWith(
      "gspot",
      `user#${userId}`,
      TABLE_NAME
    );
    const order_id = "order_" + crypto.randomBytes(8).toString("hex");
    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: order_id,
    };
    razorpay_instance.orders.create(options, function (err, order) {
      if (err) return res.status(400).json(err);
      return res.status(201).json({ ...order, user: user.email });
    });
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/payment/verify", async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(402).json({ message: "Payment Required!" });
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expected_signature === razorpay_signature) {
      // db.put()
      const params = {
        pk: "gspot",
        sk: `payment#${razorpay_order_id}`,
        razorpay_order_id,
        amount: options.amount,
        withdrawn: false,
        created: Date.now(),
      };
      await db.put(params, process.env.TABLE_NAME);
      return res.status(200).json({
        statusCode: 200,
        message: "Payment Successfull!",
        status: "Paid",
        razorpay_order_id,
        razorpay_payment_id,
      });
    }
    return res
      .status(402)
      .json({ statusCode: 422, message: "Payment Failed!", status: "Unpaid" });
  } catch (err) {
    return res.status(400).json(err);
  }
});
module.exports = router;
