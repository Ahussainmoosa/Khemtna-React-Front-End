import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const OwnerBookingReceipts = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      await fetch(`${API_URL}/booking/${id}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Property Booking Orders</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b._id}
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '6px',
            }}
          >
            <h3>{b.propertyId?.name || 'Property deleted'}</h3>

            <p><strong>User:</strong> {b.userId?.username}</p>
            <p><strong>People:</strong> {b.people}</p>
            <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {b.status}</p>

            {b.status === 'pending' && (
              <div>
                <button
                  onClick={() => updateStatus(b._id, 'approve')}
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(b._id, 'reject')}
                  style={{ marginLeft: '10px' }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerBookingReceipts;
