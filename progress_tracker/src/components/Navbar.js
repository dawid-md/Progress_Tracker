import { Link } from "react-router-dom"

export default function Navbar(){
    return(
        <div className="navbar">
        <div className="logo-title">
          <img className='logo' src='/logo192.png' alt='React Application'/>
          <h1>Progress Tracker</h1>
        </div>
        <nav className='nav-links'>
          <Link to={'/'} className='nav-link'>Home</Link>
          <Link to={'/login'} className='nav-link'>Login</Link>
          <Link to={'/login'} className='nav-link'>Logout</Link>
          <Link to={'/about'} className='nav-link'>About</Link>
        </nav>
      </div>
    )
}