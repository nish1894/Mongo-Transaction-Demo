const crypto = require('crypto');
const PersonalAccessToken = require('../models/PersonalAccessToken');
const User = require('../models/auth/User');

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// Create a new PAT — returns both the PAT doc and the ONE-TIME raw token
const createPAT = async (userId, name = '') => {
  const rawToken  = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);

  const pat = await PersonalAccessToken.create({ userId, tokenHash, name });
  return { pat, rawToken };
};

// List all PATs for a user — tokenHash is never returned
const listPATs = async (userId) => {
  return PersonalAccessToken
    .find({ userId })
    .select('-tokenHash')
    .sort({ createdAt: -1 })
    .lean();
};

// Soft-delete: set revoked = true
const revokePAT = async (patId, userId) => {
  return PersonalAccessToken.findOneAndUpdate(
    { _id: patId, userId },
    { revoked: true },
    { new: true },
  );
};

// Validate an incoming raw token — returns the User doc or null
const findUserByToken = async (rawToken) => {
  const tokenHash = hashToken(rawToken);
  const pat = await PersonalAccessToken.findOne({ tokenHash });

  if (!pat)                                          return null;
  if (pat.revoked)                                   return null;
  if (pat.expiresAt && pat.expiresAt < new Date())   return null;

  return User.findById(pat.userId).lean();
};

module.exports = { createPAT, listPATs, revokePAT, findUserByToken };
