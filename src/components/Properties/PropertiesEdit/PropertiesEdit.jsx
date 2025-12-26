import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import './PropertiesEdit.css';

const Properties_API_BASE_URL = 'http://localhost:3000/Properties';
const USER_API_BASE_URL = 'http://localhost:3000/users';

function PropertiesEdit() {
  const { PropertiesId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [PropertiesData, setPropertiesData] = useState({
    title: '',
    description: '',
    enrolledStudents: []
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      try {
        const PropertiesRes = await fetch(`${Properties_API_BASE_URL}/${PropertiesId}/edit`, { headers });
        if (!PropertiesRes.ok) {
          const errorBody = await PropertiesRes.json().catch(() => ({}));
          throw new Error(errorBody.err || 'Failed to load Properties details.');
        }

        const Properties = await PropertiesRes.json();
        Properties.enrolledStudents = Properties.enrolledStudents || [];
        setPropertiesData(Properties);

        const studentsRes = await fetch(`${USER_API_BASE_URL}?role=student`, { headers });
        if (!studentsRes.ok) {
          throw new Error('Failed to load student list.');
        }

        const students = await studentsRes.json();
        setAvailableStudents(students);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message || 'An unexpected error occurred while loading.');
        setLoading(false);
      }
    };

    fetchData();
  }, [PropertiesId, token]);

  useEffect(() => {
    if (isDeleted) {
      setIsSubmitting(false);
      setTimeout(() => {
        navigate('/Properties');
      }, 10);
      setIsDeleted(false);
    }
  }, [isDeleted, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setPropertiesData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleStudentSelect = e => {
    setSelectedStudentId(e.target.value);
  };

  const handleAddStudent = () => {
    if (!selectedStudentId || PropertiesData.enrolledStudents.includes(selectedStudentId)) {
      return;
    }
    setPropertiesData(prevData => ({
      ...prevData,
      enrolledStudents: [...prevData.enrolledStudents, selectedStudentId]
    }));
    setSelectedStudentId('');
  };

  const handleRemoveStudent = studentIdToRemove => {
    setPropertiesData(prevData => ({
      ...prevData,
      enrolledStudents: prevData.enrolledStudents.filter(id => id !== studentIdToRemove)
    }));
  };

  const handleDeleteProperties = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${Properties_API_BASE_URL}/${PropertiesId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.err || 'Failed to delete Properties');
      }

      setShowDeleteConfirm(false);
      setIsDeleted(true);
    } catch (err) {
      console.error('Delete Error:', err);
      setError(err.message);
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const url = `${Properties_API_BASE_URL}/${PropertiesId}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(PropertiesData)
      });

      if (res.status === 404) {
        throw new Error('propertie not found during update.');
      }

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const errorMessage = errorBody.err || 'Failed to update Properties.';
        throw new Error(errorMessage);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(`/Properties/${PropertiesId}`);
      }, 1500);
    } catch (err) {
      console.error('Update Error:', err);
      setError(err.message || 'An unexpected error occurred during update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading Properties details...</div>;
  }

  if (error && !PropertiesData.title) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Edit Properties: {PropertiesData.title}</h2>

      {submitSuccess && <div>Properties updated successfully! Redirecting...</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Properties Title</label>
          <input
            type="text"
            name="title"
            value={PropertiesData.title || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
            <h2>Edit Properties: {PropertiesData.title}</h2>
            
            {submitSuccess && (
                <div>Properties updated successfully! Redirecting...</div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Properties Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={PropertiesData.title || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={PropertiesData.description || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button type="submit" className="btn" disabled={isSubmitting || loading}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>

        <div>
          <h3>Enrollment Management</h3>

          <label htmlFor="student-select">Select Student to Enroll:</label>
          <select id="student-select" value={selectedStudentId} onChange={handleStudentSelect}>
            <option value="" disabled>
              -- Choose a Student --
            </option>
            {availableStudents
              .filter(student => !PropertiesData.enrolledStudents.includes(student._id.toString()))
              .map(student => (
                <option key={student._id} value={student._id}>
                  {student.username}
                </option>
              ))}
          </select>

          <button type="button" onClick={handleAddStudent} disabled={!selectedStudentId}>
            Add Student
          </button>
        </div>

        <div>
          <h4>Current Enrollment List:</h4>

          {PropertiesData.enrolledStudents.length === 0 ? (
            <p>No students enrolled yet. Add students above and click 'Save Changes'.</p>
          ) : (
            <ul>
              {PropertiesData.enrolledStudents.map(enrolledId => {
                const student = availableStudents.find(
                  s => s._id.toString() === enrolledId.toString()
                );

                return student ? (
                  <li
                    key={enrolledId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}
                  >
                    <span>{student.username}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(enrolledId)}
                      style={{
                        marginLeft: '10px',
                        padding: '2px 8px',
                        cursor: 'pointer',
                        backgroundColor: '#f44'
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ) : (
                  <li key={enrolledId}>Unknown Student (ID: {enrolledId})</li>
                );
              })}
            </ul>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={isSubmitting || loading} style={{ marginRight: '10px' }}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting || loading}
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            Delete Properties
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div
          style={{
            border: '2px solid red',
            padding: '20px',
            marginTop: '20px',
            backgroundColor: '#fff',
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          <h4>⚠️ Confirm Deletion</h4>
          <p>
            Are you absolutely sure you want to delete <strong>{PropertiesData.title}</strong>? This
            action cannot be undone.
          </p>

          <div style={{ marginTop: '15px' }}>
            <button
              onClick={handleDeleteProperties}
              disabled={isSubmitting}
              style={{
                backgroundColor: 'red',
                color: 'white',
                marginRight: '10px',
                padding: '8px 15px'
              }}
            >
              Yes, Delete Permanently
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isSubmitting}
              style={{ padding: '8px 15px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
}

export default PropertiesEdit;
