const calculateCreditScore = ({
  monthly_income,
  existing_debt = 0,
  employment_status,
}) => {
  let score = 500;

  if (monthly_income >= 10000) score += 180;
  else if (monthly_income >= 7000) score += 140;
  else if (monthly_income >= 4000) score += 100;
  else if (monthly_income >= 2500) score += 60;
  else score += 20;

  const debtRatio = existing_debt / monthly_income;

  if (debtRatio <= 0.2) score += 120;
  else if (debtRatio <= 0.4) score += 70;
  else if (debtRatio <= 0.6) score += 20;
  else score -= 100;

  if (employment_status === 'full_time') score += 100;
  if (employment_status === 'part_time') score += 50;
  if (employment_status === 'self_employed') score += 40;
  if (employment_status === 'unemployed') score -= 150;

  if (score > 850) score = 850;
  if (score < 300) score = 300;

  return Math.round(score);
};

const makeCreditDecision = (score) => {
  if (score >= 650) {
    return {
      decision: 'approved',
      reason: 'Customer meets credit eligibility requirements',
    };
  }

  return {
    decision: 'rejected',
    reason: 'Customer does not meet minimum credit score requirement',
  };
};

module.exports = {
  calculateCreditScore,
  makeCreditDecision,
};