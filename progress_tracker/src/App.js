import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { useState, useEffect, useMemo, createContext } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  const auth = getAuth();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    });

    return () => unsubscribe();  //cleanup on unmount
  }, []);

  const memoizedUser = useMemo(() => ({ user, setUser }), [user])

  if (loading) {
    return (
      <div className="App-preview">
        <div className="loading-spinner"></div>
      </div>
    );  //if checking user is still processing
  }

  return (
    <div className="App">
      <AuthContext.Provider value={memoizedUser}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={!user ? <Navigate to="/login" /> : <Home />}/>
          <Route path='/login' element={user ? <Navigate to="/" /> : <Login />}/>
          <Route path='/register'element={user ? <Navigate to="/" /> : <Register />}/>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
