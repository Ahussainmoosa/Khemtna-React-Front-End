import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 25.276987,
  lng: 55.296249,
};

const MapPicker = ({ latitude, longitude, onChange }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  const center = latitude && longitude
    ? { lat: latitude, lng: longitude }
    : defaultCenter;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={(e) => {
        onChange({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }}
    >
      {latitude && longitude && (
        <Marker position={{ lat: latitude, lng: longitude }} />
      )}
    </GoogleMap>
  );
};

export default MapPicker;
