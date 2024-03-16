import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Ensure this path is correct
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faRegular, faCircle } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const {user} = useContext(AuthContext)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--background', '#1a1d23'); //Dark theme color
      root.style.setProperty('--gradient--start', 'rgba(0,0,0,1)')
      root.style.setProperty('--gradient--end', 'rgba(26,29,35,1)')
      root.style.setProperty('--project--data--background', '#1a1d23');  //#e0e0e0#F6F7F9
      root.style.setProperty('--projects--font--color', '#fff');
      root.style.setProperty('--icons--color', '#F6F7F9');
      localStorage.setItem('theme', 'dark');
    } else {
      root.style.setProperty('--background', '#F0F1F3'); //Light theme color
      root.style.setProperty('--gradient--start', 'black')
      root.style.setProperty('--gradient--end', '#F0F1F3')
      root.style.setProperty('--project--data--background', '#e0e0e0');
      root.style.setProperty('--projects--font--color', '#0B0D10');
      root.style.setProperty('--icons--color', 'gray');
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
  };

  return (
      <div className="navbar">
          <div className="logo-title">
              <img className='logo' src='/logo192.png' alt='React Application'/>
              <h2>Progress Tracker</h2>
          </div>
          {user && <h3 className="nav-username">{user.displayName}</h3>}
          <div className="flex-elements">
            <nav className='nav-links'>
                <Link to={'/'} className='nav-link'>Home</Link>
                {!user && <Link to={'/register'} className='nav-link'>Register</Link> }
                {!user && <Link to={'/login'} className='nav-link'>Login</Link> }
                {user && <div onClick={handleLogout} className='nav-link'>Logout</div>} {/* Changed to button */}
                {user && <div className='nav-link'>Profile</div>} {/* Changed to button */}
                <Link to={'/about'} className='nav-link'>About</Link>
            </nav>
          {theme === 'dark' ? <FontAwesomeIcon className="icon-theme" icon={faCircle} onClick={() => changeTheme()} /> : 
                <FontAwesomeIcon className="icon-theme" icon={faMoon} onClick={() => changeTheme()} />
          }
          </div>

      </div>
  );
}
