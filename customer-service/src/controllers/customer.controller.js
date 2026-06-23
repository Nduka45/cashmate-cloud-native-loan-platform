const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerModel = require('../models/customer.model');

const JWT_SECRET = process.env.JWT_SECRET || 'cashmate-dev-secret';

exports.registerCustomer = async (req, res, next) => {
  try {
    const { full_name, email, password, phone } = req.body;

    const existingCustomer = await CustomerModel.findByEmail(email);
    if (existingCustomer) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const customer = await CustomerModel.create({
      full_name,
      email,
      password_hash,
      phone,
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      customer,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const customer = await CustomerModel.findByEmail(email);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        userId: customer.id,
        role: customer.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.id,
        full_name: customer.full_name,
        email: customer.email,
        phone: customer.phone,
        kyc_status: customer.kyc_status,
        role: customer.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const customer = await CustomerModel.findById(req.user.userId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};