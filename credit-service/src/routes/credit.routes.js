const express = require('express');
const Joi = require('joi');

const {
  evaluateCredit,
  getCustomerCreditChecks,
} = require('../controllers/credit.controller');

const router = express.Router();

const evaluateSchema = Joi.object({
  customer_id: Joi.string().uuid().required(),
  loan_id: Joi.string().uuid().optional(),
  monthly_income: Joi.number().positive().required(),
  existing_debt: Joi.number().min(0).optional(),
  employment_status: Joi.string()
    .valid('full_time', 'part_time', 'self_employed', 'unemployed')
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

router.post('/evaluate', validate(evaluateSchema), evaluateCredit);
router.get('/customers/:customer_id/checks', getCustomerCreditChecks);

module.exports = router;