require('dotenv').config();
const express        = require('express');
const path           = require('path');
const connectDB      = require('./config/db');
const authRoutes     = require('./routes/authRoutes');
const sensorRoutes   = require('./routes/sensorRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth',   authRoutes);
app.use('/api/sensor', authMiddleware, sensorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
