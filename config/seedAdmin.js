const bcrypt = require('bcrypt');
const User   = require('../models/auth/User');

const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const exists = await User.findOne({ email: ADMIN_EMAIL });
  if (exists) return;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({ email: ADMIN_EMAIL, passwordHash, role: 'admin' });
  console.log(`[SEED] Admin created: ${ADMIN_EMAIL}`);
};

module.exports = seedAdmin;
