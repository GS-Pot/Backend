const router = require("express").Router();
// const router = Router();
const db = require("../utils/Dynamo");
const { Response, verifyHash, generateToken, hash } = require("../utils");
const { getLocation } = require("../utils/findCropData");
const crops = require("../data/dataset.json");
const { allowAll } = require("../middlewares/auth.middleware");
const TABLE_NAME = process.env.TABLE_NAME;
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    // const params = {
    //     pk: "gspot",
    //     sk: `user#${email}`,
    // };
    // console.log
    const data = await db.queryBeginsWith("gspot", `user#${email}`, TABLE_NAME);
    console.log(data);
    if (!data[0]) return res.json(Response(401, "User Doesn't Exist"));
    const passwordValid = await verifyHash(password, data[0].password);
    if (!passwordValid) return res.json(Response(401, "Bad Credentials"));
    const accessToken = generateToken({
      email: data[0].email,
      name: data[0].name,
      role: data[0].role,
      sk: data[0].sk,
    });
    return res.json(Response(200, "success", { accessToken, ...data[0] }));
  } catch (err) {
    console.log(err);
    return res.json(Response(500, "Error encountered"));
  }
});

router.route("/register/farmer").post(async (req, res) => {
  try {
    console.log("Here");
    console.log(TABLE_NAME);
    const { name, email, password, phone, address } = req.body;
    // const params = {
    //   TableName: TABLE_NAME,
    //   Key: {
    //     pk: "gspot",
    //     sk: `user#${email}`,
    //   },
    // };
    // const data = await db.get(params,TABLE_NAME);
    const data = await db.queryBeginsWith("gspot", `user#${email}`, TABLE_NAME);
    if (data.Item) return res.json(Response(401, "User Already Exists"));
    const pass = await hash(password);
    const params1 = {
      pk: "gspot",
      sk: `user#${email}`,
      name,
      email,
      password: pass,
      phone,
      address,
      role: "farmer",
    };
    const a = await db.put(params1, TABLE_NAME);
    return res.json(Response(200, "success", a));
  } catch (err) {
    console.log(err);
    return res.json(Response(500, "Error encountered"));
  }
});

router.route("/register/expert").post(async (req, res) => {
  try {
    //   console.log("Here");
    console.log(TABLE_NAME);
    const { name, email, password, phone, address } = req.body;
    const data = await db.queryBeginsWith("gspot", `user#${email}`, TABLE_NAME);
    if (data.Item) return res.json(Response(401, "User Already Exists"));
    const pass = await hash(password);
    const params1 = {
      pk: "gspot",
      sk: `user#${email}`,
      name,
      email,
      password: pass,
      phone,
      address,
      role: "expert",
    };
    const a = await db.put(params1, TABLE_NAME);
    return res.json(Response(200, "success", a));
  } catch (err) {
    console.log(err);
    return res.json(Response(500, "Error encountered"));
  }
});

module.exports = router;
