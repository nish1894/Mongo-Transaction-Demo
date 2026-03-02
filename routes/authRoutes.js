const express = require('express');
const router  = express.Router();
const { signup, login, verify2FA } = require('../controllers/authController');

router.post('/signup',     signup);
router.post('/login',      login);
router.post('/verify-2fa', verify2FA);

module.exports = router;
