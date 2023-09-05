import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'

import Auth from './hoc/auth'
    


function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  
  return (
    <Router>
      <div>
        <ul style={{
          display: 'flex', justifyContent: 'left', 
          width: '100%',
        }}>
          <li style={{ listStyle: 'none', marginRight: '7px' }}>
            <Link to="/">Home</Link>
          </li>
          <li style={{ listStyle: 'none', marginRight: '7px'  }}>
            <Link to="/login">Login</Link>
          </li>
          <li style={{ listStyle: 'none', marginRight: '7px'  }}>
            <Link to="/register">Register</Link>
          </li>
        </ul>

        <hr />

        <Routes>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage />}/>
          <Route path="/register" element={<AuthRegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


