import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import LoanApplication from './pages/LoanApplication';
import CreditCheck from './pages/CreditCheck';
import Disbursement from './pages/Disbursement';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Navbar />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loans" element={<LoanApplication />} />
            <Route path="/credit" element={<CreditCheck />} />
            <Route path="/disbursement" element={<Disbursement />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}