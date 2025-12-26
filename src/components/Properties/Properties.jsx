// src/components/Properties/Properties.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import MapPicker from '../Map/Mapicker';

const Properties = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [photos, setPhotos] = useState([]);

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

  const handleMapChange = ({ lat, lng }) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
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

      // 1️⃣ Create property
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

      const result = await res.json();
      const propertyId = result.data._id;

      // 2️⃣ Upload photos (ONLY if selected)
      if (photos.length > 0) {
        const photoForm = new FormData();
        for (let i = 0; i < photos.length; i++) {
          photoForm.append('photos', photos[i]);
        }

        await fetch(`http://localhost:3000/properties/${propertyId}/photos`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: photoForm,
        });
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
        <input
          name="name"
          placeholder="Property name"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <input
          name="contactNumber"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />

        <input
          name="weekdayPrice"
          type="number"
          placeholder="Weekday Price"
          onChange={handleChange}
          required
        />

        <input
          name="weekendPrice"
          type="number"
          placeholder="Weekend Price"
          onChange={handleChange}
          required
        />

        {/* Map picker ABOVE lat/lng inputs */}
        <MapPicker
          latitude={formData.latitude ? Number(formData.latitude) : null}
          longitude={formData.longitude ? Number(formData.longitude) : null}
          onChange={handleMapChange}
        />

        <input
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />

        <input
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPhotos(e.target.files)}
        />

        <button type="submit">Create Property</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Properties;
