// src/components/Properties/Properties.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const Properties = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactNumber: '',
    weekdayPrice: '',
    weekendPrice: '',
    latitude: '',
    longitude: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const payload = {
        name: formData.name,
        description: formData.description,
        contactNumber: formData.contactNumber,
        price: {
          weekday: Number(formData.weekdayPrice),
          weekend: Number(formData.weekendPrice),
        },
        location: {
          type: 'Point',
          coordinates: [
            Number(formData.longitude),
            Number(formData.latitude),
          ],
        },
      };

      const res = await fetch('http://localhost:3000/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create property');
      }

      setMessage('Property created successfully!');
      navigate('/properties');
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Create Property</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Property name" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />

        <input name="weekdayPrice" type="number" placeholder="Weekday Price" onChange={handleChange} required />
        <input name="weekendPrice" type="number" placeholder="Weekend Price" onChange={handleChange} required />

        <input name="latitude" placeholder="Latitude" onChange={handleChange} required />
        <input name="longitude" placeholder="Longitude" onChange={handleChange} required />

        <button type="submit">Create Property</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Properties;
