const express      = require('express');
const router       = express.Router();
const { getProfile, enable2FA, confirm2FA } = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile',      authMiddleware, getProfile);
router.post('/enable-2fa',  authMiddleware, enable2FA);
router.post('/confirm-2fa', authMiddleware, confirm2FA);

module.exports = router;
