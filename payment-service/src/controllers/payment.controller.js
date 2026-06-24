const PaymentModel = require('../models/payment.model');

exports.createPayment = async (req, res, next) => {
  try {
    const { loan_id, customer_id, amount, payment_method } = req.body;

    const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const payment = await PaymentModel.create({
      loan_id,
      customer_id,
      amount,
      payment_method,
      reference,
      status: 'completed',
    });

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentsByLoan = async (req, res, next) => {
  try {
    const { loan_id } = req.params;

    const payments = await PaymentModel.findByLoanId(loan_id);

    res.status(200).json({ payments });
  } catch (err) {
    next(err);
  }
};