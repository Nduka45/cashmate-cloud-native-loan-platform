const express = require('express');
const Joi = require('joi');

const {
  createPayment,
  getPaymentsByLoan,
} = require('../controllers/payment.controller');

const router = express.Router();

const paymentSchema = Joi.object({
  loan_id: Joi.string().uuid().required(),
  customer_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  payment_method: Joi.string()
    .valid('card', 'bank_transfer', 'cash')
    .required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
};

router.post('/', validate(paymentSchema), createPayment);
router.get('/loans/:loan_id', getPaymentsByLoan);

module.exports = router;