const { createProxyMiddleware } = require('http-proxy-middleware');

const customerServiceProxy = createProxyMiddleware({
  target: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
});

const loanServiceProxy = createProxyMiddleware({
  target: process.env.LOAN_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
});

const creditServiceProxy = createProxyMiddleware({
  target: process.env.CREDIT_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
});

module.exports = {
  customerServiceProxy,
  loanServiceProxy,
  creditServiceProxy,
};