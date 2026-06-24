const DisbursementModel = require('../models/disbursement.model');
const { sendMoney } = require('../services/mockBank.service');

exports.createDisbursement = async (req, res, next) => {
  try {
    const {
      loan_id,
      customer_id,
      amount,
      bank_name,
      account_number,
    } = req.body;

    const bankResult = await sendMoney({
      amount: Number(amount),
      bank_name,
      account_number,
    });

    const status = bankResult.success ? 'completed' : 'failed';

    const disbursement = await DisbursementModel.create({
      loan_id,
      customer_id,
      amount,
      bank_name,
      account_number,
      status,
      reference: bankResult.reference,
      failure_reason: bankResult.failure_reason,
    });

    res.status(201).json({
      message: bankResult.success
        ? 'Loan disbursement completed'
        : 'Loan disbursement failed',
      disbursement,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDisbursementsByLoan = async (req, res, next) => {
  try {
    const { loan_id } = req.params;

    const disbursements = await DisbursementModel.findByLoanId(loan_id);

    res.status(200).json({ disbursements });
  } catch (err) {
    next(err);
  }
};