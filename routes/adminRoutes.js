const express       = require('express');
const router        = express.Router();
const { getUsers, promoteUser } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/users',            authMiddleware, roleMiddleware('admin'), getUsers);
router.put('/promote/:userId',  authMiddleware, roleMiddleware('admin'), promoteUser);

module.exports = router;
