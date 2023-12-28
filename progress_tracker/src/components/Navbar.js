import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Ensure this path is correct
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const {user} = useContext(AuthContext)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--background', '#1a1d23'); //Dark theme color
      localStorage.setItem('theme', 'dark');
    } else {
      root.style.setProperty('--background', 'gray'); //Light theme color
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleLogout = async () => {
      try {
          await signOut(auth);
          console.log("User signed out");
          navigate('/login'); //Redirect to login page
      } catch (error) {
          console.error("Error signing out: ", error);
      }
  };

  const changeTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    console.log('theme changed');
  };

  return (
      <div className="navbar">
          <div className="logo-title">
              <img className='logo' src='/logo192.png' alt='React Application'/>
              <h1>Progress Tracker</h1>
          </div>
          {user && <h2 className="nav-username">{user.displayName}</h2>}
          <div className="flex-elements">
          <nav className='nav-links'>
              <Link to={'/'} className='nav-link'>Home</Link>
              {!user && <Link to={'/register'} className='nav-link'>Register</Link> }
              {!user && <Link to={'/login'} className='nav-link'>Login</Link> }
              {user && <div onClick={handleLogout} className='nav-link'>Logout</div>} {/* Changed to button */}
              <Link to={'/about'} className='nav-link'>About</Link>
          </nav>
          {theme === 'dark' ? <FontAwesomeIcon className="icon-theme" icon={faSun} onClick={() => changeTheme()} /> : 
                <FontAwesomeIcon className="icon-theme" icon={faMoon} onClick={() => changeTheme()} />
          }
          </div>

      </div>
  );
}
