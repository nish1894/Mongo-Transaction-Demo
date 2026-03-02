require('dotenv').config();
const express        = require('express');
const path           = require('path');
const connectDB      = require('./config/db');
const seedAdmin      = require('./config/seedAdmin');
const authRoutes     = require('./routes/authRoutes');
const sensorRoutes   = require('./routes/sensorRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const patRoutes      = require('./routes/patRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth',     authRoutes);
app.use('/api/sensor',   sensorRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pat',      patRoutes);

const init = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

init();
