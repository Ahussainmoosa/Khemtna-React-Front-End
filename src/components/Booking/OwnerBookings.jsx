// src/components/Booking/OwnerBookings.jsx
import { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${BACKEND_URL}/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch bookings');

        const data = await res.json();
        setBookings(data.data || []);
      } catch (err) {
        console.error(err);
        setError('Could not load bookings');
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${BACKEND_URL}/booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status } : b
        )
      );
    } catch {
      alert('Failed to update booking status');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>Booking Requests</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>No booking requests</p>
      ) : (
        bookings.map(booking => (
          <div
            key={booking._id}
            style={{
              border: '1px solid #ccc',
              padding: 15,
              marginBottom: 15,
            }}
          >
            <h3>{booking.propertyId?.name}</h3>

            {booking.propertyId?.photos?.[0] && (
              <img
                src={`${BACKEND_URL}${booking.propertyId.photos[0].imageUrl}`}
                alt="property"
                style={{ width: 200, height: 130, objectFit: 'cover' }}
              />
            )}

            <p>
              <strong>User:</strong> {booking.userId?.username}
            </p>

            <p>
              <strong>Date:</strong>{' '}
              {new Date(booking.startDate).toLocaleDateString()}
            </p>

            <p>
              <strong>Guests:</strong> {booking.guests}
            </p>

            <p>
              <strong>Phone:</strong> {booking.phone}
            </p>

            <p>
              <strong>Total:</strong> {booking.totalPrice} BHD
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span style={{ textTransform: 'capitalize' }}>
                {booking.status}
              </span>
            </p>

            {booking.status === 'pending' && (
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() =>
                    updateStatus(booking._id, 'approved')
                  }
                  style={{ marginRight: 10 }}
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(booking._id, 'rejected')
                  }
                  style={{ background: 'red', color: 'white' }}
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

export default OwnerBookings;
