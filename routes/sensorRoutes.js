const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  startReadings,
  stopReadings,
  getReadings,
  getIncident,
  getAlerts,
} = require('../controllers/sensorController');

router.post('/start',   startReadings);
router.post('/stop',    stopReadings);
router.get('/readings', getReadings);
router.get('/incident', getIncident);

// Protected: accessible with either JWT or PAT
router.get('/alerts', authMiddleware, getAlerts);

module.exports = router;
