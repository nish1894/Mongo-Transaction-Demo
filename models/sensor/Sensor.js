const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastTemperature: { type: Number, default: null },
    status: { type: String, enum: ['NORMAL', 'ALERT'], default: 'NORMAL' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sensor', sensorSchema);
