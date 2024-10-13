import React from 'react';
import './login.css'; // Ensure this file manages Login-specific styles
import logo from "../images/logo_1.png"; // Adjust the path to where your logo is stored

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/auth';
  };

  return (
    <div className="login-container">
    <img src={logo} alt="Logo" className="logo" />
      <header className="login-header">
        <h1>Log in to Continue</h1>
        <p>Access all your assignments, submissions, and data in one secure place.</p>
      </header>
      <div className="login-content">
        <p>
          Our DDBMS app integrates seamlessly with Google Classroom to give you a hassle-free experience. Stay organized with real-time notifications and secure data management.
        </p>
        <button className="login-button" onClick={handleLogin}>Login  with Your  Google Classroom Account</button>


      </div>
    </div>
  );
};

export default Login;
