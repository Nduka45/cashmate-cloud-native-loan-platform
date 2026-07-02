import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">C</div>
        <div>
          <h2>CashMate</h2>
          <p>Loan Platform</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/loans">Loan Application</NavLink>
        <NavLink to="/credit">Credit Check</NavLink>
        <NavLink to="/disbursement">Disbursement</NavLink>
        <NavLink to="/payments">Payments</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
      </nav>
    </aside>
  );
}