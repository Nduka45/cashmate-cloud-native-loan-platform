const pool = require('../config/db');

const DisbursementModel = {
  async create({
    loan_id,
    customer_id,
    amount,
    bank_name,
    account_number,
    status,
    reference,
    failure_reason,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO disbursements
        (loan_id, customer_id, amount, bank_name, account_number, status, reference, failure_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        loan_id,
        customer_id,
        amount,
        bank_name,
        account_number,
        status,
        reference,
        failure_reason,
      ]
    );

    return rows[0];
  },

  async findByLoanId(loan_id) {
    const { rows } = await pool.query(
      `SELECT * FROM disbursements
       WHERE loan_id = $1
       ORDER BY created_at DESC`,
      [loan_id]
    );

    return rows;
  },
};

module.exports = DisbursementModel;