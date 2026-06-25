const { publishEvent } = require('../kafka/producer');
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

    await publishEvent('payment-recorded', {
      paymentId: payment.id,
      loanId: payment.loan_id,
      customerId: payment.customer_id,
      amount: payment.amount,
      paymentMethod: payment.payment_method,
      reference: payment.reference,
      status: payment.status,
      createdAt: payment.created_at,
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