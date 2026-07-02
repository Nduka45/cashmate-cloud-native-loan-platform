import { useState } from "react";
import { evaluateCredit } from "../services/creditService";
import "./Forms.css";

export default function CreditCheck() {
  const [form, setForm] = useState({
    customer_id: "e147afb2-5482-4600-8b6a-efef7fb12b26",
    loan_id: "",
    monthly_income: "",
    existing_debt: "",
    employment_status: "full_time",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitCreditCheck = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const data = await evaluateCredit({
        customer_id: form.customer_id,
        loan_id: form.loan_id,
        monthly_income: Number(form.monthly_income),
        existing_debt: Number(form.existing_debt),
        employment_status: form.employment_status,
      });

      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Credit evaluation failed");
    }
  };

  return (
    <div className="form-page">
      <h1>Credit Check</h1>
      <p>Run a credit evaluation for a submitted loan.</p>

      <form className="cashmate-form" onSubmit={submitCreditCheck}>
        <label>Loan ID</label>
        <input
          name="loan_id"
          value={form.loan_id}
          onChange={handleChange}
          placeholder="Paste loan ID"
          required
        />

        <label>Monthly Income</label>
        <input
          name="monthly_income"
          type="number"
          value={form.monthly_income}
          onChange={handleChange}
          placeholder="7000"
          required
        />

        <label>Existing Debt</label>
        <input
          name="existing_debt"
          type="number"
          value={form.existing_debt}
          onChange={handleChange}
          placeholder="1000"
          required
        />

        <label>Employment Status</label>
        <select
          name="employment_status"
          value={form.employment_status}
          onChange={handleChange}
        >
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="self_employed">Self Employed</option>
          <option value="unemployed">Unemployed</option>
        </select>

        <button type="submit">Run Credit Check</button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result-box">
          <h3>Credit Evaluation Completed</h3>
          <p><strong>Credit Score:</strong> {result.creditCheck.credit_score}</p>
          <p><strong>Decision:</strong> {result.creditCheck.decision}</p>
          <p><strong>Reason:</strong> {result.creditCheck.reason}</p>
          <p><strong>Loan ID:</strong> {result.creditCheck.loan_id}</p>
        </div>
      )}
    </div>
  );
}