const pool = require('../config/db');

const CreditModel = {
  async create({
    customer_id,
    loan_id,
    monthly_income,
    existing_debt,
    employment_status,
    credit_score,
    decision,
    reason,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO credit_checks
        (customer_id, loan_id, monthly_income, existing_debt, employment_status, credit_score, decision, reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        customer_id,
        loan_id || null,
        monthly_income,
        existing_debt || 0,
        employment_status,
        credit_score,
        decision,
        reason,
      ]
    );

    return rows[0];
  },

  async findByCustomer(customer_id) {
    const { rows } = await pool.query(
      `SELECT * FROM credit_checks
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customer_id]
    );

    return rows;
  },
};

module.exports = CreditModel;