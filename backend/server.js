const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const watchlistRoutes = require('./routes/watchlist');
const listingsRoutes = require('./routes/listings');
const vendorsRoutes = require('./routes/vendors');
const ordersRoutes = require('./routes/orders');
const notificationsRoutes = require('./routes/notifications');
const messagesRoutes = require('./routes/messages');
const accountRoutes = require('./routes/account');

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/vendors', vendorsRoutes);

app.use('/api/cart', cartRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use('/api/orders', ordersRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use('/api/conversations', messagesRoutes);
app.use('/api/account', accountRoutes);