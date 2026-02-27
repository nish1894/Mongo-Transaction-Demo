const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.signup(email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = { signup, login };
