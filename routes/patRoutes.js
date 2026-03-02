const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createPAT, listPATs, revokePAT } = require('../controllers/patController');

// Block PAT-authenticated requests from generating new PATs
const requireJWT = (req, res, next) => {
  if (req.user.fromPAT) {
    return res.status(403).json({
      message: 'PAT cannot be used to create new PATs — authenticate with JWT first',
    });
  }
  next();
};

router.use(authMiddleware);

router.post(  '/',    requireJWT, createPAT);
router.get(   '/',               listPATs);
router.delete('/:id', requireJWT, revokePAT);

module.exports = router;
