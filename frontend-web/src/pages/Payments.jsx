import { useState } from "react";
import { createPayment } from "../services/paymentService";
import "./Forms.css";

export default function Payments() {
  const [form, setForm] = useState({
    loan_id: "",
    customer_id: "e147afb2-5482-4600-8b6a-efef7fb12b26",
    amount: "",
    payment_method: "bank_transfer",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const data = await createPayment({
        loan_id: form.loan_id,
        customer_id: form.customer_id,
        amount: Number(form.amount),
        payment_method: form.payment_method,
      });

      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed");
    }
  };

  return (
    <div className="form-page">
      <h1>Payments</h1>
      <p>Record a loan repayment through the CashMate payment service.</p>

      <form className="cashmate-form" onSubmit={submitPayment}>
        <label>Loan ID</label>
        <input
          name="loan_id"
          value={form.loan_id}
          onChange={handleChange}
          placeholder="Paste loan ID"
          required
        />

        <label>Payment Amount</label>
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="50000"
          required
        />

        <label>Payment Method</label>
        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
          <option value="mobile_money">Mobile Money</option>
        </select>

        <button type="submit">Record Payment</button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="result-box">
          <h3>Payment Recorded Successfully</h3>
          <p><strong>Payment ID:</strong> {result.payment.id}</p>
          <p><strong>Loan ID:</strong> {result.payment.loan_id}</p>
          <p><strong>Amount:</strong> {result.payment.amount}</p>
          <p><strong>Status:</strong> {result.payment.status}</p>
          <p><strong>Reference:</strong> {result.payment.reference}</p>
        </div>
      )}
    </div>
  );
}