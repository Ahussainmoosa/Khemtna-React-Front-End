import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router';

import { assignmentService } from '../../services/assignmentService';
import{UserContext} from '../../contexts/UserContext';
import './AssignmentDetails.css';


const AssignmentDetails = ({ deleteAssignment }) => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');

  // Fetch the assignment details
  useEffect(() => {
    
    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getAssignment(id)
        setAssignment(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };
    fetchAssignment();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!assignment) return <p>Loading...</p>;

  const handleDelete = async () => {
   
    try {
      res = await assignmentService.deleteAssignment(id)

      if(res){
        navigate('/assignments');
      }else{
        throw new Error('Failed to delete')
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete assignment');
    }
  };

  return (
    <div>
      <h2>{assignment.title}</h2>
      <p>{assignment.content}</p>
      {assignment.course && (
      <p>
        <strong>Course:</strong>{' '}
        <Link to={`/courses/${assignment.course._id}`}>
          {assignment.course.title}
        </Link>
      </p>
      )}
      
      {user?.role === 'school' && (
        <>
      
        <Link to={`/assignments/${id}/edit`} className='btn'>
        Edit
        </Link>
        <button
          onClick={handleDelete}
          className='btn'
        >
          Delete
        </button>
       </>
      )}

      <Link to='/assignments' className="btn">Back to assignments</Link>
    </div>
  );
};

export default AssignmentDetails;
