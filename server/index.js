require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const path    = require('path');

const connectDB         = require('./config/db');
const syncEventStatus   = require('./utils/syncEventStatus');

const app = express();
connectDB().then(async () => {
  // Sync event statuses on startup
  await syncEventStatus();
  console.log('✅ Event statuses synced');
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/events',       require('./routes/events'));
app.use('/api/attendance',   require('./routes/attendance'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/feedback',     require('./routes/feedback'));
app.use('/api/analytics',    require('./routes/analytics'));
app.use('/api/users',        require('./routes/users'));

app.get('/api/health', (_, res) => res.json({ status: 'OK', app: 'UniVerse GEU' }));

// Sync every hour automatically
setInterval(async () => {
  await syncEventStatus();
  console.log('🔄 Event statuses auto-synced');
}, 60 * 60 * 1000);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server → http://localhost:${PORT}`));
