import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); 

    try {
      const response = await axios.post("https://shortly-backend-syh2.onrender.com/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.status === 201) {
        toast.success("User registered successfully");
        localStorage.setItem("userId", response.data.user.id);
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to register"); 
    }
  };

  return (
    <div className="sign-login-container">
      <div className="sign-login-left">
        <img src="wallpaper.png" alt="Background" className="sign-login-image" />
      </div>
      <div className="sign-login-right">
        <img src="logo.png" className="logo-sign" alt="company"></img>
        <div className="sign-top-button">
          <button className="sign-register-button">SignUp</button>
          <button className="sign-login-button" onClick={() => navigate("/")}>Login</button>
        </div>
        <div className="sign-login-form">
          <h2 className="sign-login-text">Join us Today!</h2>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="sign-form-group">
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="sign-form-group">
              <input
                type="email"
                id="email"
                placeholder="Email id"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="sign-form-group">
              <input
                type="tel"
                id="phone"
                placeholder="Mobile No"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="sign-form-group">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="sign-form-group">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="sign-login-btn">
              Register
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <button type="button" className="log" onClick={() => navigate("/")}>Login</button>
          </p>
        </div>
      </div>

      <ToastContainer /> 
    </div>
  );
};

export default SignUp;
