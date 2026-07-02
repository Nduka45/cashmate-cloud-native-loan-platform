import { useState } from "react";
import { createDisbursement } from "../services/disbursementService";
import "./Forms.css";

export default function Disbursement() {
  const [form, setForm] = useState({
    loan_id: "",
    customer_id: "e147afb2-5482-4600-8b6a-efef7fb12b26",
    amount: "",
    bank_name: "",
    account_number: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitDisbursement = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const data = await createDisbursement({
        loan_id: form.loan_id,
        customer_id: form.customer_id,
        amount: Number(form.amount),
        bank_name: form.bank_name,
        account_number: form.account_number,
      });

      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Disbursement failed");
    }
  };

  return (
    <div className="form-page">
      <h1>Disbursement</h1>
      <p>Release an approved loan to a customer bank account.</p>

      <form className="cashmate-form" onSubmit={submitDisbursement}>
        <label>Loan ID</label>
        <input
          name="loan_id"
          value={form.loan_id}
          onChange={handleChange}
          placeholder="Paste loan ID"
          required
        />

        <label>Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="180000"
          required
        />

        <label>Bank Name</label>
        <input
          name="bank_name"
          value={form.bank_name}
          onChange={handleChange}
          placeholder="Mock Bank"
          required
        />

        <label>Account Number</label>
        <input
          name="account_number"
          value={form.account_number}
          onChange={handleChange}
          placeholder="1234567890"
          required
        />

        <button type="submit">Disburse Loan</button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result-box">
          <h3>Loan Disbursement Completed</h3>
          <p><strong>Disbursement ID:</strong> {result.disbursement.id}</p>
          <p><strong>Loan ID:</strong> {result.disbursement.loan_id}</p>
          <p><strong>Amount:</strong> {result.disbursement.amount}</p>
          <p><strong>Status:</strong> {result.disbursement.status}</p>
          <p><strong>Bank Reference:</strong> {result.disbursement.reference}</p>
        </div>
      )}
    </div>
  );
}