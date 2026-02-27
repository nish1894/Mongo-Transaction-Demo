const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    sensorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },
    message:  { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', incidentSchema);
