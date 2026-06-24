const express = require('express');
const Joi = require('joi');

const {
  createDisbursement,
  getDisbursementsByLoan,
} = require('../controllers/disbursement.controller');

const router = express.Router();

const disbursementSchema = Joi.object({
  loan_id: Joi.string().uuid().required(),
  customer_id: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  bank_name: Joi.string().min(2).max(100).required(),
  account_number: Joi.string().min(5).max(50).required(),
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

router.post('/', validate(disbursementSchema), createDisbursement);
router.get('/loans/:loan_id', getDisbursementsByLoan);

module.exports = router;