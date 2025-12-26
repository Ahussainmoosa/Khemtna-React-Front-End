// src/components/NavBar/NavBar.jsx
import { useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav>
      <ul>
        {/* Always visible */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Guest */}
        {!user && (
          <>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link to="/sign-up">Sign Up</Link>
            </li>
          </>
        )}

        {/* User */}
        {user && user.role === 'user' && (
          <>
            <li>
              <Link to="/bookings/my">My Bookings</Link>
            </li>
          </>
        )}

        {/* Owner / Admin */}
        {user && (user.role === 'owner' || user.role === 'admin') && (
          <>
            <li>
              <Link to="/properties/new">Add Property</Link>
            </li>
            <li>
              <Link to="/bookings/owner">Booking Requests</Link>
            </li>
          </>
        )}

        {/* Signed in */}
        {user && (
          <>
            <li>Welcome, {user.username}</li>
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
