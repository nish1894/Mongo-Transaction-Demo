const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    sensorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor',   required: true },
    incidentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
    temperature: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
