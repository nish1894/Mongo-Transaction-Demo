const sensorService = require("../services/sensorService");

// POST /api/sensor/start
const startReadings = async (req, res) => {
  const result = await sensorService.start();
  if (result.already) return res.json({ message: "Already running" });

  res.json({ message: "Started", sensors: result.sensorsCount });
};

// POST /api/sensor/stop
const stopReadings = (req, res) => {
  sensorService.stop();
  res.json({ message: "Stopped" });
};

// GET /api/sensor/readings
const getReadings = async (req, res) => {
  const data = await sensorService.getReadings();
  res.json(data);
};

// GET /api/sensor/incident?incidentId=X
const getIncident = async (req, res) => {
  const { incidentId } = req.query;
  const data = await sensorService.getIncident(incidentId);
  res.json(data);
};

module.exports = { startReadings, stopReadings, getReadings, getIncident };
