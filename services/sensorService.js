const mongoose = require("mongoose");
const Sensor   = require("../models/sensor/Sensor");
const Alert    = require("../models/sensor/Alert");
const Incident = require("../models/sensor/Incident");

// ─── In-memory state ──────────────────────────────────────────────────────────
let pendingTimeouts = [];
let isRunning = false;

const SENSOR_NAMES = ["Freezer-A", "Freezer-B", "Cold-Room-1"];
const TEMP_THRESHOLD = 15;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Random temperature between 0 and 20°C (one decimal)
const randomTemp = () => Math.round(Math.random() * 200) / 10;

// Random delay between 2000ms and 7000ms
const randomDelay = () => Math.floor(Math.random() * 5000) + 2000;

// Create sensors on first start if they don't exist yet
const seedSensors = async () => {
  for (const name of SENSOR_NAMES) {
    const exists = await Sensor.findOne({ name });
    if (!exists) await Sensor.create({ name });
  }
};

// ─── Core: process one reading for a sensor ───────────────────────────────────
const processReading = async (sensor) => {
  const temperature = randomTemp();

  if (temperature > TEMP_THRESHOLD) {
    // ── TRANSACTION: all three writes succeed or all roll back ──────────────
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Update the sensor document
      await Sensor.findByIdAndUpdate(
        sensor._id,
        { lastTemperature: temperature, status: "ALERT" },
        { session },
      );

      // 2. Create the Incident first so we have its _id
      const [incident] = await Incident.create(
        [{ sensorId: sensor._id, message: `High temp ${temperature}°C on ${sensor.name}` }],
        { session },
      );

      // 3. Create the Alert linked to the Incident
      await Alert.create(
        [{ sensorId: sensor._id, incidentId: incident._id, temperature }],
        { session },
      );

      await session.commitTransaction();
      console.log(`[ALERT]  ${sensor.name}: ${temperature}°C — transaction committed`);
    } catch (err) {
      await session.abortTransaction();
      console.error(`[ABORT]  ${sensor.name}: transaction rolled back —`, err.message);
    } finally {
      session.endSession();
    }
  } else {
    // Normal reading — no transaction needed
    await Sensor.findByIdAndUpdate(sensor._id, {
      lastTemperature: temperature,
      status: "NORMAL",
    });
    console.log(`[NORMAL] ${sensor.name}: ${temperature}°C`);
  }
};

// ─── Recursive scheduler: random delay between each reading ──────────────────
const scheduleReading = (sensor) => {
  const id = setTimeout(async () => {
    if (!isRunning) return;
    await processReading(sensor);
    scheduleReading(sensor);
  }, randomDelay());

  pendingTimeouts.push(id);
};

// ─── Public API ───────────────────────────────────────────────────────────────
const start = async () => {
  if (isRunning) return { already: true };

  await seedSensors();
  const sensors = await Sensor.find();

  isRunning = true;
  sensors.forEach((sensor) => scheduleReading(sensor));

  console.log("Simulation started");
  return { sensorsCount: sensors.length };
};

const stop = () => {
  isRunning = false;
  pendingTimeouts.forEach((id) => clearTimeout(id));
  pendingTimeouts = [];

  console.log("Simulation stopped");
};

const getReadings = async () => {
  const sensors = await Sensor.find().lean();
  const alerts = await Alert.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("sensorId", "name")
    .populate("incidentId")
    .lean();

  return { sensors, alerts };
};

const getIncident = async (incidentId) => {
  const incident = await Incident.findById(incidentId)
    .populate("sensorId", "name")
    .lean();

  return { incident };
};

module.exports = { start, stop, getReadings, getIncident };
