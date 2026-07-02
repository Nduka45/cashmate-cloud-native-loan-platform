import { useEffect, useState } from "react";
import "./Forms.css";
import { getNotifications } from "../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Notifications</h1>
      <p>Recent CashMate platform events.</p>

      {loading && <p>Loading notifications...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="table-card">
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="notification-item">
                <h3>{item.title}</h3>

                <p>{item.message}</p>

                <strong>Status: {item.status}</strong>

                <br />

                <small>
                  Type: {item.type}
                </small>

                <br />

                <small>
                  {new Date(item.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}