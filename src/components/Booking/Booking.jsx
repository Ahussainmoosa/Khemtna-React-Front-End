// src/components/Booking/Booking.jsx
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const Booking = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/properties/${propertyId}`);
        const data = await res.json();
        setProperty(data.data || data);
      } catch {
        setError('Failed to load property');
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleBooking = async () => {
    if (!date || !people || !phone) {
      setError('Please fill all required fields');
      return;
    }

    const confirm = window.confirm(
      `Confirm booking?\n\nProperty: ${property.name}\nDate: ${date}\nPeople: ${people}\nPrice: ${property.price.weekday} BHD / night`
    );

    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${BACKEND_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          date,
          people,
          phone,
          paymentMethod,
          totalPrice: property.price.weekday,
        }),
      });

      if (!res.ok) throw new Error();

      navigate('/bookings/my');
    } catch {
      setError('Booking failed');
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Top section */}
      <div style={{ display: 'flex', gap: 20 }}>
        <img
          src={
            property.photos?.[0]?.imageUrl
              ? `${BACKEND_URL}${property.photos[0].imageUrl}`
              : 'https://via.placeholder.com/300'
          }
          alt={property.name}
          style={{ width: 250, height: 180, objectFit: 'cover' }}
        />

        <div>
          <h2>{property.name}</h2>
          <p>{property.price.weekday} BHD / night</p>
        </div>
      </div>

      {/* Booking form */}
      <h3 style={{ marginTop: 20 }}>{property.name}</h3>

      <label>Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <label>Number of people</label>
      <input
        type="number"
        min="1"
        value={people}
        onChange={e => setPeople(Number(e.target.value))}
      />

      <label>Phone number</label>
      <input value={phone} onChange={e => setPhone(e.target.value)} />

      {/* Booking summary */}
      <p style={{ marginTop: 15 }}>
        Booking of <strong>{property.name}</strong> for{' '}
        <strong>{date || 'selected date'}</strong> for{' '}
        <strong>{people}</strong> person(s)
      </p>

      {/* Payment */}
      <h4>Payment Method</h4>
      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
      </select>

      {/* Submit */}
      <button style={{ marginTop: 20 }} onClick={handleBooking}>
        Book Now
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Booking;
