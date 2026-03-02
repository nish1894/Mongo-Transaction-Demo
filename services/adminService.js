const User = require('../models/auth/User');

const getAllUsers = async () =>
  User.find({}, { passwordHash: 0, twoFactorSecret: 0 }).lean();

const getProfile = async (userId) => {
  const user = await User.findById(userId, { passwordHash: 0, twoFactorSecret: 0 }).lean();
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

const promoteToAdmin = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role: 'admin' },
    { new: true, projection: { passwordHash: 0, twoFactorSecret: 0 } },
  ).lean();

  if (!user) throw { status: 404, message: 'User not found' };
  return { message: 'User promoted to admin', user };
};

module.exports = { getAllUsers, getProfile, promoteToAdmin };
