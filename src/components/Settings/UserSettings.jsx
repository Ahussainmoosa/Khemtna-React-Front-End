import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
const API = import.meta.env.VITE_BACK_END_SERVER_URL;

const UserSettings = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');

  const requestOwner = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API}/users/request-owner`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', borderRight: '1px solid #ddd', padding: '20px' }}>
        <h3>Settings</h3>

        {user.role === 'user' && (
          <button onClick={requestOwner}>
            Request to become owner
          </button>
        )}

        {user.ownerRequestStatus === 'pending' && (
          <p style={{ color: 'orange' }}>Request pending approval</p>
        )}

        {user.ownerRequestStatus === 'rejected' && (
          <p style={{ color: 'red' }}>Request rejected</p>
        )}
      </aside>

      {/* Content */}
      <main style={{ padding: '20px' }}>
        <h2>User Settings</h2>
        {message && <p>{message}</p>}
      </main>
    </div>
  );
};

export default UserSettings;
