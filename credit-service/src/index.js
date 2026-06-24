const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const creditRoutes = require('./routes/credit.routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'cashmate-credit-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/credit', creditRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CashMate Credit Service running on port ${PORT}`);
});

module.exports = app;