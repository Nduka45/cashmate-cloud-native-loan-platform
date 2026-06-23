CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS credit_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL,
  loan_id UUID,
  monthly_income NUMERIC(12,2) NOT NULL,
  existing_debt NUMERIC(12,2) DEFAULT 0,
  employment_status VARCHAR(50) NOT NULL,
  credit_score INTEGER NOT NULL,
  decision VARCHAR(30) NOT NULL
    CHECK (decision IN ('approved', 'rejected')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_checks_customer_id ON credit_checks(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_checks_loan_id ON credit_checks(loan_id);