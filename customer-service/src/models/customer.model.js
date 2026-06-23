const pool = require('../config/db');

const CustomerModel = {
  async create({ full_name, email, password_hash, phone }) {
    const { rows } = await pool.query(
      `INSERT INTO customers
        (full_name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone, kyc_status, role, created_at`,
      [full_name, email, password_hash, phone || null]
    );

    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email]
    );

    return rows[0];
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, full_name, email, phone, kyc_status, role, created_at, updated_at
       FROM customers
       WHERE id = $1`,
      [id]
    );

    return rows[0];
  },
};

module.exports = CustomerModel;