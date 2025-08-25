import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          💰 Expense Tracker
        </Link>
        
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Welcome, {user?.username}!
              </span>
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link navbar-link-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
