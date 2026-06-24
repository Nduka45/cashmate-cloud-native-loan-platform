const Joi = require('joi');

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

const schemas = {
  registerCustomer: Joi.object({
    full_name: Joi.string().min(3).max(150).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    phone: Joi.string().max(30).optional(),
  }),

  loginCustomer: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { validate, schemas };