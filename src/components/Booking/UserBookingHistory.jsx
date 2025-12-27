import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load bookings');

        setBookings(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id} style={{ marginBottom: '15px' }}>
              <strong>{booking.propertyId?.name}</strong>
              <p>Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
              <p>Status: {booking.status || 'Pending'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookingHistory;
