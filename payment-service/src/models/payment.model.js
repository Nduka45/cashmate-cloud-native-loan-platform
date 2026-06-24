const pool = require('../config/db');

const PaymentModel = {
  async create({
    loan_id,
    customer_id,
    amount,
    payment_method,
    reference,
    status,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO payments
        (loan_id, customer_id, amount, payment_method, reference, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [loan_id, customer_id, amount, payment_method, reference, status]
    );

    return rows[0];
  },

  async findByLoanId(loan_id) {
    const { rows } = await pool.query(
      `SELECT * FROM payments
       WHERE loan_id = $1
       ORDER BY created_at DESC`,
      [loan_id]
    );

    return rows;
  },
};

module.exports = PaymentModel;