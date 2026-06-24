const { createProxyMiddleware } = require('http-proxy-middleware');

const customerServiceProxy = createProxyMiddleware({
  target: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: (path) => `/api/customers${path}`,
});

const loanServiceProxy = createProxyMiddleware({
  target: process.env.LOAN_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: (path) => `/api/loans${path}`,
});

const creditServiceProxy = createProxyMiddleware({
  target: process.env.CREDIT_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: (path) => `/api/credit${path}`,
});

module.exports = {
  customerServiceProxy,
  loanServiceProxy,
  creditServiceProxy,
};