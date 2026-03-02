const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User      = require('../models/auth/User');

const SALT_ROUNDS = 10;

const issueToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

const signup = async (email, password) => {
  if (!email || !password) throw { status: 400, message: 'Email and password are required' };

  const existing = await User.findOne({ email });
  if (existing) throw { status: 409, message: 'User already exists' };

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({ email, passwordHash }); // role defaults to 'user'

  return { message: 'Signup successful' };
};

const login = async (email, password) => {
  if (!email || !password) throw { status: 400, message: 'Email and password are required' };

  const user = await User.findOne({ email });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  // If 2FA is enabled, do not issue JWT yet
  if (user.twoFactorEnabled) return { require2FA: true };

  return { token: issueToken(user) };
};

const verify2FA = async (email, token) => {
  const user = await User.findOne({ email });
  if (!user || !user.twoFactorSecret) throw { status: 401, message: 'Invalid request' };

  const valid = speakeasy.totp.verify({
    secret:   user.twoFactorSecret,
    encoding: 'base32',
    token,
    window:   1,
  });
  if (!valid) throw { status: 401, message: 'Invalid OTP' };

  return { token: issueToken(user) };
};

module.exports = { signup, login, verify2FA };
