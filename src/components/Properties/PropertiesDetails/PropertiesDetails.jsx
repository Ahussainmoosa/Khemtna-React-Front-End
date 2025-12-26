import { useParams, Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { PropertiesService } from "../../../services/propertiesService";
import { UserContext } from "../../../contexts/UserContext";
import './PropertiesDetails.css';

const PropertiesDetails = () => {
  const { id } = useParams();
  const [Properties, setProperties] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await PropertiesService.getProperties(id);
        
        setProperties(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperties();
  }, [id]);

  const handleDelete = async (event) => {
    try {
      event.preventDefault();
      await PropertiesService.deleteProperties(id);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to delete Properties');
    }
  };

  if (!Properties) return <p>Loading Properties details...</p>;

  return (
    <main>
      <h1>{Properties.title}</h1>
      <p>{Properties.description}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user.role === 'admin' ||user.role ==="owner"&& (
        <>
          <Link to={`/Propertiess/${Properties._id}/edit`} className="btn">Edit {Properties.title}</Link>
          <button onClick={handleDelete} className="btn">Delete</button>
        </>
      )}

    </main>
  );
};

export default PropertiesDetails;