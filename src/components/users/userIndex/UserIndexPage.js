import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserIndexPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem('authToken'); // Remove the token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      <h1>User Index Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserIndexPage;
