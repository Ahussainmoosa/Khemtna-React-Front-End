// src/components/NavBar/NavBar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
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
        {/*puplic*/}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/*guest*/}
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

        {/* user */}
        {user && user.role === 'user' && (
          <>
            <li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
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

        {user?.role === 'admin' && (
          <Link to="/admin/owner-requests">Owner Requests</Link>
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
              <li>
              <Link to="/settings">Settings</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
