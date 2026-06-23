const express = require('express');

const {
  registerCustomer,
  loginCustomer,
  getProfile,
} = require('../controllers/customer.controller');

const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

const router = express.Router();

router.post('/register', validate(schemas.registerCustomer), registerCustomer);
router.post('/login', validate(schemas.loginCustomer), loginCustomer);
router.get('/profile', authenticate, getProfile);

module.exports = router;