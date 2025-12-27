import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_BACK_END_SERVER_URL;

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  const load = async () => {
    const res = await fetch(`${API}/users/owner-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRequests(data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handle = async (id, action) => {
    await fetch(`${API}/users/owner-requests/${id}/${action}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  return (
    <div>
      <h2>Owner Requests</h2>

      {requests.map(u => (
        <div key={u._id}>
          <span>{u.username}</span>
          <button onClick={() => handle(u._id, 'approve')}>Approve</button>
          <button onClick={() => handle(u._id, 'reject')}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default OwnerRequests;
