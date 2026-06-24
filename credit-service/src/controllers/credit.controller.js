const CreditModel = require('../models/credit.model');
const {
  calculateCreditScore,
  makeCreditDecision,
} = require('../services/scoring.service');

exports.evaluateCredit = async (req, res, next) => {
  try {
    const {
      customer_id,
      loan_id,
      monthly_income,
      existing_debt,
      employment_status,
    } = req.body;

    const credit_score = calculateCreditScore({
      monthly_income: Number(monthly_income),
      existing_debt: Number(existing_debt || 0),
      employment_status,
    });

    const { decision, reason } = makeCreditDecision(credit_score);

    const creditCheck = await CreditModel.create({
      customer_id,
      loan_id,
      monthly_income,
      existing_debt,
      employment_status,
      credit_score,
      decision,
      reason,
    });

    res.status(201).json({
      message: 'Credit evaluation completed',
      creditCheck,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerCreditChecks = async (req, res, next) => {
  try {
    const { customer_id } = req.params;

    const checks = await CreditModel.findByCustomer(customer_id);

    res.status(200).json({ checks });
  } catch (err) {
    next(err);
  }
};