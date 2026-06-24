const sendMoney = async ({ amount, bank_name, account_number }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!amount || amount <= 0) {
    return {
      success: false,
      reference: null,
      failure_reason: 'Invalid disbursement amount',
    };
  }

  if (!bank_name || !account_number) {
    return {
      success: false,
      reference: null,
      failure_reason: 'Missing bank account details',
    };
  }

  return {
    success: true,
    reference: `BANK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    failure_reason: null,
  };
};

module.exports = { sendMoney };