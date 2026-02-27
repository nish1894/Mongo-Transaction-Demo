const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/auth/User');


//10 = 2^10 iterations 
const SALT_ROUNDS = 10;

const signup = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw { status: 409, message: 'User already exists' };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await User.create({ email, passwordHash });

  return { message: 'Signup successful' };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw { status: 400, message: 'Email and password are required' };
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 401, message: "User Doesn't Exist" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw { status: 401, message: 'Wrong Password' };
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '4h' },
  );

  return { token };
};

module.exports = { signup, login };
