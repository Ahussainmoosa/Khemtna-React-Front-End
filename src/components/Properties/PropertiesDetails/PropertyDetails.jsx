import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import MapPicker from '../../Map/Mapicker';
const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      const res = await fetch(`http://localhost:3000/properties/${id}`);
      const data = await res.json();
      setProperty(data.data || data);
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <main>
      <h1>{property.name}</h1>

      {/* Photos */}
      <div className="photos-row">
        {property.photos?.map(photo => (
          <img
            key={photo._id}
            src={`${import.meta.env.VITE_BACK_END_SERVER_URL}${photo.imageUrl}`}
            alt="property"
            style={{ width: '200px', marginRight: '10px' }}
          />
        ))}
      </div>

      <p>{property.description}</p>

      <p>
        Weekday: {property.price.weekday} BHD / night<br />
        Weekend: {property.price.weekend} BHD / night
      </p>

      {/* Map */}
      <MapPicker
        latitude={property.location.coordinates[1]}
        longitude={property.location.coordinates[0]}
        readOnly
      />

      <button onClick={() => navigate(`/booking/${property._id}`)}>
        Book this property
      </button>
    </main>
  );
};

export default PropertyDetails;
