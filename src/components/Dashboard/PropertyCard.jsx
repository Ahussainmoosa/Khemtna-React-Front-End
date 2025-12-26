// src/components/Properties/PropertyCard.jsx
import { useNavigate } from 'react-router';
import './Properties.css';

const BACKEND_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/properties/${property._id}`);
  };

  const goToBooking = () => {
    navigate(`/booking/${property._id}`);
  };

  return (
    <div className="property-row" onClick={goToDetails}>
      <img
        src={
          property.photos?.[0]?.imageUrl
            ? `${BACKEND_URL}${property.photos[0].imageUrl}`
            : 'https://via.placeholder.com/150'
        }
        alt={property.name}
        className="property-thumb"
      />

      <div className="property-info">
        <h3>{property.name}</h3>

        <div className="price-rating-row">
          <span>
            {property.price.weekday} BHD / night
          </span>

          <span className="stars">
            {[1, 2, 3, 4, 5].map(n => (
              <span key={n}>
                {n <= (property.rating || 0) ? '★' : '☆'}
              </span>
            ))}
          </span>
        </div>

        <button
          className="book-btn"
          onClick={(e) => {
            e.stopPropagation();
            goToBooking();
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
