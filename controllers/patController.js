const patService = require('../services/patService');

// POST /api/pat
const createPAT = async (req, res) => {
  try {
    const { name } = req.body;
    const { pat, rawToken } = await patService.createPAT(req.user.userId, name);

    res.status(201).json({
      message:   'PAT created. Store this token — it will NOT be shown again.',
      token:     rawToken,
      id:        pat._id,
      name:      pat.name,
      createdAt: pat.createdAt,
    });
  } catch {
    res.status(500).json({ message: 'Failed to create PAT' });
  }
};

// GET /api/pat
const listPATs = async (req, res) => {
  try {
    const pats = await patService.listPATs(req.user.userId);
    res.json({ pats });
  } catch {
    res.status(500).json({ message: 'Failed to list PATs' });
  }
};

// DELETE /api/pat/:id
const revokePAT = async (req, res) => {
  try {
    const pat = await patService.revokePAT(req.params.id, req.user.userId);
    if (!pat) return res.status(404).json({ message: 'PAT not found' });
    res.json({ message: 'PAT revoked' });
  } catch {
    res.status(500).json({ message: 'Failed to revoke PAT' });
  }
};

module.exports = { createPAT, listPATs, revokePAT };
