const router = require("express").Router();
// const router = Router();
const db = require("../utils/Dynamo");
const { Response } = require("../utils");
const { getLocation } = require("../utils/findCropData");
const crops = require("../data/dataset.json");
const { allowAll } = require("../middlewares/auth.middleware");

router.route("/fetchall").get((req, res) => {
  return res.json(Response(200, "success", crops));
});
router.post("/", async (req, res) => {
  const { lat, long } = req.body;
  const location = await getLocation(parseFloat(lat), parseFloat(long));
  var data = [];
  for (let i = 0; i < crops.length; i++) {
    if (crops[i]["District_Name"] === location["District_Name"]) {
      data.push(crops[i]);
    }
  }
  data.sort((a, b) => {
    return parseInt(a.Rank) - parseInt(b.Rank);
  });
  return res.json(Response(200, "success", data));
});

module.exports = router;
