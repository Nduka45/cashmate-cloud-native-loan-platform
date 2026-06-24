const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const CUSTOMER_SERVICE_URL =
  process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001';
const LOAN_SERVICE_URL =
  process.env.LOAN_SERVICE_URL || 'http://localhost:3000';
const CREDIT_SERVICE_URL =
  process.env.CREDIT_SERVICE_URL || 'http://localhost:3002';

app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'cashmate-api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use(
  '/api/customers',
  createProxyMiddleware({
    target: CUSTOMER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/customers${path}`,
  })
);

app.use(
  '/api/loans',
  createProxyMiddleware({
    target: LOAN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/loans${path}`,
  })
);

app.use(
  '/api/credit',
  createProxyMiddleware({
    target: CREDIT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/api/credit${path}`,
  })
);

app.use((req, res) => {
  res.status(404).json({
    error: `Gateway route ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CashMate API Gateway running on port ${PORT}`);
  console.log(`➡️ Customer Service: ${CUSTOMER_SERVICE_URL}`);
  console.log(`➡️ Loan Service: ${LOAN_SERVICE_URL}`);
  console.log(`➡️ Credit Service: ${CREDIT_SERVICE_URL}`);
});