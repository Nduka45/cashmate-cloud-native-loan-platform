const { publishEvent } = require('../kafka/producer');
const LoanModel = require('../models/loan.model');

const EVENTS = {
  CREATED: 'loan-created',
  APPROVED: 'loan-approved',
  REJECTED: 'loan-rejected',
};

// Apply for Loan
exports.applyForLoan = async (req, res, next) => {
  try {
    const { amount, tenure_months, purpose } = req.body;

    if (!amount || !tenure_months || !purpose) {
      return res.status(400).json({
        error: 'amount, tenure_months and purpose are required',
      });
    }

    const loan = await LoanModel.create({
      customer_id: req.user.userId,
      amount,
      tenure_months,
      purpose,
    });

    await publishEvent(EVENTS.CREATED, {
      loanId: loan.id,
      customerId: loan.customer_id,
      amount: loan.amount,
      status: loan.status,
      createdAt: loan.created_at,
    });

    res.status(201).json({
      message: 'Loan application submitted',
      loan,
    });
  } catch (err) {
    next(err);
  }
};

// Get My Loans
exports.getMyLoans = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    const loans = await LoanModel.findByCustomer(req.user.userId, {
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      loans,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    next(err);
  }
};

// Get Loan By ID
exports.getLoanById = async (req, res, next) => {
  try {
    const loan = await LoanModel.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        error: 'Loan not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      String(loan.customer_id) !== String(req.user.userId)
    ) {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    res.status(200).json({
      loan,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Loans (Admin only)
exports.getAllLoans = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    const { status, limit = 20, page = 1 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const offset = (pageNum - 1) * limitNum;

    const loans = await LoanModel.findAll({
      status,
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      loans,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    next(err);
  }
};

// Review Loan (Admin only)
exports.reviewLoan = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
      });
    }

    const loan = await LoanModel.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        error: 'Loan not found',
      });
    }

    if (!['pending', 'under_review'].includes(loan.status)) {
      return res.status(400).json({
        error: `Loan cannot be reviewed in '${loan.status}' status`,
      });
    }

    const { status, interest_rate, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be approved or rejected',
      });
    }

    const updated = await LoanModel.updateStatus(req.params.id, {
      status,
      interest_rate,
      rejection_reason,
      approved_at: status === 'approved' ? new Date() : null,
    });

    await publishEvent(
      status === 'approved'
        ? EVENTS.APPROVED
        : EVENTS.REJECTED,
      {
        loanId: updated.id,
        customerId: updated.customer_id,
        status: updated.status,
        approvedAt: updated.approved_at,
        rejectionReason: updated.rejection_reason,
      }
    );

    res.status(200).json({
      message: `Loan ${status}`,
      loan: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Calculate Repayment
exports.calculateRepayment = (req, res) => {
  const { amount, interest_rate, tenure_months } = req.query;

  if (!amount || !interest_rate || !tenure_months) {
    return res.status(400).json({
      error: 'amount, interest_rate and tenure_months are required',
    });
  }

  const principal = parseFloat(amount);
  const rate = parseFloat(interest_rate);
  const tenure = parseInt(tenure_months, 10);

  if (
    isNaN(principal) ||
    isNaN(rate) ||
    isNaN(tenure) ||
    principal <= 0 ||
    rate <= 0 ||
    tenure <= 0
  ) {
    return res.status(400).json({
      error: 'Values must be greater than zero',
    });
  }

  const result = LoanModel.calculateRepayment(
    principal,
    rate,
    tenure
  );

  res.status(200).json({
    amount: principal,
    interest_rate: rate,
    tenure_months: tenure,
    ...result,
  });
};