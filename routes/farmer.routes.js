const router = require("express").Router();
// const router = Router();
const db = require("../utils/Dynamo");
const { Response } = require("../utils");
const { getLocation } = require("../utils/findCropData");
const crops = require("../data/dataset.json");
const { allowAll } = require("../middlewares/auth.middleware");

router.route("/").post(async (req, res) => {});

module.exports = router;
