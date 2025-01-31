import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("https://shortly-backend-syh2.onrender.com/login", {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);

        localStorage.setItem("authToken", response.data.token); 
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("userName", response.data.user.name);

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Unable to log in. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="wallpaper.png" alt="Background" className="login-image" />
      </div>
      <div className="login-right">
      <img className="logo-sign" src="logo.png" alt="Company Logo" />
      <div className="top-button">
          
          <button
            className="register-button"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </button>
          <button className="login-button">Login</button>
        </div>
        <div className="login-form">
          <h2 className="login-text">Login</h2>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn">
              Login
            </button>
          <div className="down">  <span > Don’t have an account? <button className="sig"  onClick={() => navigate("/signup")}>SignUp</button></span></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
