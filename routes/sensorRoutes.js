const express = require("express");
const router = express.Router();
const {
  startReadings,
  stopReadings,
  getReadings,
  getIncident,
} = require("../controllers/sensorController");

router.post("/start", startReadings);
router.post("/stop", stopReadings);
router.get("/readings", getReadings);
router.get("/incident", getIncident);

module.exports = router;
