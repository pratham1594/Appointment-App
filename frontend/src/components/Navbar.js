import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <button onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
      <button onClick={() => navigate('/book')}>📅 Book</button>
      <button onClick={handleLogout}>🚪 Logout</button>
    </nav>
  );
};

export default Navbar;
