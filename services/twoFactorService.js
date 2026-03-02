const speakeasy = require('speakeasy');
const QRCode    = require('qrcode');
const User      = require('../models/auth/User');

// ── Verify OTP (token)───────────────────────────────────
const verifyToken = (secret, token) =>
  speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });


const enable2FA = async (userId, email) => {
  const secret = speakeasy.generateSecret({
    name:   `ColdStorage:${email}`,
    issuer: 'ColdStorage',
    length: 20,
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  // Save secret in db
  await User.findByIdAndUpdate(userId, { twoFactorSecret: secret.base32 });

  return { qrCode };
};

const confirm2FA = async (userId, token) => {
  const user = await User.findById(userId);
  if (!user || !user.twoFactorSecret) {
    throw { status: 400, message: '2FA setup not initiated' };
  }

  const valid = verifyToken(user.twoFactorSecret, token);
  if (!valid) throw { status: 401, message: 'Invalid OTP' };

  await User.findByIdAndUpdate(userId, { twoFactorEnabled: true });
  return { message: '2FA enabled successfully' };
};



module.exports = { verifyToken, enable2FA, confirm2FA };
