import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

const API = import.meta.env.VITE_BACK_END_SERVER_URL;

const BookingCreate = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    bookingDate: '',
    peopleCount: 1,
    phoneNumber: '',
  });

  useEffect(() => {
    fetch(`${API}/properties/${propertyId}`)
      .then(res => res.json())
      .then(data => setProperty(data.data || data));
  }, [propertyId]);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const payload = {
      propertyId,
      bookingDate: formData.bookingDate,
      peopleCount: Number(formData.peopleCount),
      phoneNumber: formData.phoneNumber,
      totalPrice: property.price.weekday,
    };

    const res = await fetch(`${API}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(
        `Confirm booking?\n\nProperty: ${property.name}\nPrice: ${property.price.weekday} BHD`
      );
      navigate('/my-bookings');
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h2>Book {property.name}</h2>

      <img
        src={`${API}${property.photos?.[0]?.imageUrl}`}
        width="200"
        alt=""
      />

      <p>Weekday Price: {property.price.weekday} BHD / night</p>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="bookingDate"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="peopleCount"
          min="1"
          value={formData.peopleCount}
          onChange={handleChange}
          required
        />

        <input
          name="phoneNumber"
          placeholder="Phone number"
          onChange={handleChange}
          required
        />

        <button>Book Now</button>
      </form>
    </div>
  );
};

export default BookingCreate;
