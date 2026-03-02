const twoFactorService = require('../services/twoFactorService');
const adminService    = require('../services/adminService');

const getProfile = async (req, res) => {
  try {
    const user = await adminService.getProfile(req.user.userId);
    res.json({ user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const enable2FA = async (req, res) => {
  try {
    const result = await twoFactorService.enable2FA(req.user.userId, req.user.email);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const confirm2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await twoFactorService.confirm2FA(req.user.userId, token);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getProfile, enable2FA, confirm2FA };
