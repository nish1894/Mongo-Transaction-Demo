const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const PersonalAccessToken = require('../models/PersonalAccessToken');
const User                = require('../models/auth/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // ── 1.  JWT first  ───────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;           // { userId, email, role, iat, exp }
    return next();
  } catch {
    // Not a valid JWT — fall through to PAT check
  }

  // ── 2. Try PAT  ──────────────────────────────────────────
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const pat       = await PersonalAccessToken.findOne({ tokenHash });

    if (!pat || pat.revoked) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (pat.expiresAt && pat.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Token expired' });
    }

    const user = await User.findById(pat.userId).lean();
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      userId:  user._id,
      email:   user.email,
      role:    user.role,
      fromPAT: true,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
