const adminService = require('../services/adminService');

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ users });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const promoteUser = async (req, res) => {
  try {
    const result = await adminService.promoteToAdmin(req.params.userId);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { getUsers, promoteUser };
