const pool = require('../config/db');

const create = async ({ type, title, message, status = 'unread', payload = {} }) => {
  const result = await pool.query(
    `INSERT INTO notifications (type, title, message, status, payload)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [type, title, message, status, payload]
  );

  return result.rows[0];
};

const findAll = async () => {
  const result = await pool.query(
    `SELECT * FROM notifications
     ORDER BY created_at DESC
     LIMIT 50`
  );

  return result.rows;
};

module.exports = {
  create,
  findAll,
};