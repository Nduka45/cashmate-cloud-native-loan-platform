import { useEffect, useState } from "react";
import { createLoan, getMyLoans } from "../services/loanService";
import "./Forms.css";

export default function LoanApplication() {
  const [form, setForm] = useState({
    amount: "",
    tenure_months: "",
    purpose: "",
  });

  const [result, setResult] = useState(null);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  const loadLoans = async () => {
    try {
      const data = await getMyLoans();
      setLoans(data.loans || []);
    } catch {
      setLoans([]);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitLoan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const data = await createLoan({
        amount: Number(form.amount),
        tenure_months: Number(form.tenure_months),
        purpose: form.purpose,
      });

      setResult(data);
      setForm({ amount: "", tenure_months: "", purpose: "" });
      loadLoans();
    } catch (err) {
      setError(err.response?.data?.error || "Loan request failed");
    }
  };

  return (
    <div className="form-page wide-page">
      <h1>Loan Application</h1>
      <p>Submit and view loan applications through the CashMate API Gateway.</p>

      <form className="cashmate-form" onSubmit={submitLoan}>
        <label>Loan Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="180000"
          required
        />

        <label>Tenure Months</label>
        <input
          name="tenure_months"
          type="number"
          value={form.tenure_months}
          onChange={handleChange}
          placeholder="24"
          required
        />

        <label>Purpose</label>
        <input
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          placeholder="Business expansion"
          required
        />

        <button type="submit">Submit Loan</button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result-box">
          <h3>Loan Submitted Successfully</h3>
          <p><strong>Loan ID:</strong> {result.loan.id}</p>
          <p><strong>Amount:</strong> {result.loan.amount}</p>
          <p><strong>Status:</strong> {result.loan.status}</p>
          <p><strong>Monthly Repayment:</strong> {result.loan.monthly_repayment}</p>
        </div>
      )}

      <div className="table-card">
        <h2>My Loans</h2>

        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Monthly Repayment</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id.slice(0, 8)}...</td>
                <td>{loan.amount}</td>
                <td>{loan.purpose}</td>
                <td>{loan.status}</td>
                <td>{loan.monthly_repayment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}