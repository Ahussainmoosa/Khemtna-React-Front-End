import { useEffect, useState } from 'react';
import { PropertiesService } from '../../services/propertiesService';
const PropertiesList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await PropertiesService.getAllProperties();
        setProperties(Array.isArray(data) ? data : data.data);
      } catch (err) {
        console.error(err);
        setProperties([]);
      }
    };

    loadProperties();
  }, []);

  return (
    <ul>
      {properties.map(p => (
        <li key={p._id}>{p.name}</li>
      ))}
    </ul>
  );
};

export default PropertiesList;
