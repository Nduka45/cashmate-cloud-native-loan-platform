import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <h1>Dashboard</h1>
      <p>Welcome to your CashMate cloud-native loan platform.</p>

      <div className="cards">

        <div className="card">
          <h3>Total Loans</h3>
          <h2>15</h2>
          <span>Applications submitted</span>
        </div>

        <div className="card">
          <h3>Approved</h3>
          <h2>11</h2>
          <span>Credit approved</span>
        </div>

        <div className="card">
          <h3>Disbursed</h3>
          <h2>9</h2>
          <span>Loans released</span>
        </div>

        <div className="card">
          <h3>Total Paid</h3>
          <h2>$52,300</h2>
          <span>Repayments received</span>
        </div>

      </div>

      <div className="bottom-grid">

        <div className="activity">

          <h2>Recent Activity</h2>

          <ul>

            <li>Loan #1045 submitted</li>

            <li>Credit check approved</li>

            <li>Disbursement completed</li>

            <li>Payment received</li>

          </ul>

        </div>

        <div className="status">

          <h2>System Status</h2>

          <div className="status-item">
            API Gateway
            <span className="online">● Online</span>
          </div>

          <div className="status-item">
            PostgreSQL
            <span className="online">● Healthy</span>
          </div>

          <div className="status-item">
            Kafka
            <span className="online">● Connected</span>
          </div>

          <div className="status-item">
            Kubernetes
            <span className="online">● Running</span>
          </div>

        </div>

      </div>

    </div>
  );
}