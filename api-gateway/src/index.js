const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const {
  customerServiceProxy,
  loanServiceProxy,
  creditServiceProxy,
} = require('./routes/proxy.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'cashmate-api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/customers', customerServiceProxy);
app.use('/api/loans', loanServiceProxy);
app.use('/api/credit', creditServiceProxy);

app.use((req, res) => {
  res.status(404).json({
    error: `Gateway route ${req.method} ${req.path} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CashMate API Gateway running on port ${PORT}`);
});