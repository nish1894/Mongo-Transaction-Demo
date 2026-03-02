const mongoose = require('mongoose');

const patSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true },
  name:      { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  revoked:   { type: Boolean, default: false },
});

patSchema.index({ tokenHash: 1 });

module.exports = mongoose.model('PersonalAccessToken', patSchema);
