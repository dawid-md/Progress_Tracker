import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Ensure this path is correct
import { useContext } from "react";
import { AuthContext } from "../App";

export default function Navbar() {
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          await signOut(auth);
          console.log("User signed out");
          navigate('/login'); //Redirect to login page
      } catch (error) {
          console.error("Error signing out: ", error);
      }
  };

  return (
      <div className="navbar">
          <div className="logo-title">
              <img className='logo' src='/logo192.png' alt='React Application'/>
              <h1>Progress Tracker</h1>
          </div>
          {user && <h2>{user.displayName}</h2>}
          <nav className='nav-links'>
              <Link to={'/'} className='nav-link'>Home</Link>
              {!user && <Link to={'/register'} className='nav-link'>Register</Link> }
              {!user && <Link to={'/login'} className='nav-link'>Login</Link> }
              <div onClick={handleLogout} className='nav-link'>Logout</div> {/* Changed to button */}
              <Link to={'/about'} className='nav-link'>About</Link>
          </nav>
      </div>
  );
}
