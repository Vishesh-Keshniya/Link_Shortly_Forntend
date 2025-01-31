import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateModal from "./Modals/CreateModal";
import Dashpart from "./Modals/Dashpart";
import Data from "./Modals/Data";
import Setting from "./Modals/Setting";  
import "./Dashboard.css";
import './Menu.css';
import './Navbar.css';
import './Phone.css';
import './Modals/Data';
import Analysis from "./Modals/Analysis";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [activeComponent, setActiveComponent] = useState(""); 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsPhoneMode(window.innerWidth <= 1080);
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedName = localStorage.getItem("userName");

    if (!token) {
      navigate("/login"); 
    } else {
      setActiveComponent("dashpart"); 
    }

    if (storedName) {
      setUserName(storedName);
    }
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12
      ? "🌄 Good morning"
      : hour < 18
      ? "☀️ Good afternoon"
      : "🌙 Good evening";
  };

  const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: "short", month: "short", day: "numeric" };
    return today.toLocaleDateString(undefined, options);
  };

  const capitalizeFirstLetter = (userName) => {
    if (!userName) return "Guest";
    return userName
      .split(" ")
      .map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const handleProfileClick = () => {
    setShowLogout((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setUserName("");
    setShowLogout(false);
    navigate("/"); 
  };

  const handleDashboardClick = () => {
    setActiveComponent("dashpart");
  };

  const handleDataClick = () => {
    setActiveComponent("data");
  };

  const handleAnalyticsClick = () => {
    setActiveComponent("analytics");
  };

  const handleSettingsClick = () => {
    setActiveComponent("settings");
  };

  return (
    <div className="dashboard-container">
      <div className="rightpart">
        <nav className="navbar">
          <div className="navbar-left">
          
            <span className="greeting">
              {`${getGreeting()}, ${capitalizeFirstLetter(userName) || "Guest"}`}
            </span>
            <div className="day">
              <span className="date">{getFormattedDate()}</span>
            </div>
          </div><img className="logo-display" src="logo.png" alt="logo"></img>
          <div className="navbar-right">
            <button
              className="create-button"
              onClick={() => setModalOpen(true)}
            >
              + Create new
            </button>
            <input
              type="text"
              placeholder="Search by remarks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="search-input"
            />
            {showLogout && (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            )}
            <div className="profile-icon" onClick={handleProfileClick}>
              {userName
                ? userName.split(" ").length > 1
                  ? userName.split(" ")[0].charAt(0).toUpperCase() +
                    userName.split(" ")[1].charAt(0).toUpperCase()
                  : userName.charAt(0).toUpperCase() +
                    userName.charAt(userName.length - 1).toUpperCase()
                : "G"}
            </div>
          </div>
        </nav>
      </div>

      <div className="phone-menu-container">
        <div className={`phone-menu-content ${isMenuOpen ? "open" : "closed"}`}>
          <ul className="phone-menu-items">
            <li
              className={`phone-menu-item ${activeComponent === "dashpart" ? "active" : ""}`}
              onClick={handleDashboardClick}
            >
              <span className="phone-menu-icon">
                <img src="dash-icon.png" alt="Dashboard Icon" />
              </span>
              <span className="phone-menu-text">Dashboard</span>
            </li>

            <li
              className={`phone-menu-item ${activeComponent === "data" ? "active" : ""}`}
              onClick={handleDataClick}
            >
              <span className="phone-menu-icon">
                <img src="link-icon.png" alt="Links Icon" />
              </span>
              <span className="phone-menu-text">Links</span>
            </li>

            <li
              className={`phone-menu-item ${activeComponent === "analytics" ? "active" : ""}`}
              onClick={handleAnalyticsClick}
            >
              <span className="phone-menu-icon">
             
              </span>
              <span className="phone-menu-text">Analytics</span>
            </li>

            <li
              className={`phone-menu-item-setting ${activeComponent === "settings" ? "active" : ""}`}
              onClick={handleSettingsClick}
            >
              <span className="phone-menu-icon-setting">⚙️</span>
              <span className="phone-menu-text-setting">Settings</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="content-dash">
        <div className={`menu-container ${isPhoneMode ? "hidden" : ""}`}>
          <div className={`menu-content ${setIsMenuOpen ? "open" : "closed"}`}>
            <div className="logomenu">
              <img src="menu-logo.png" alt="Logo" />
            </div>
            <ul className={`menu-items ${isPhoneMode ? "show" : ""}`}>
              <li
                className={`menu-item ${activeComponent === "dashpart" ? "active" : ""}`}
                onClick={handleDashboardClick}
              >
                <span className="menu-icon">
                  <img src="dash-icon.png" alt="Dashboard Icon" />
                </span>
                <span className="menu-text">Dashboard</span>
              </li>

              <li
                className={`menu-item ${activeComponent === "data" ? "active" : ""}`}
                onClick={handleDataClick}
              >
                <span className="menu-icon">
                  <img src="link-icon.png" alt="Links Icon" />
                </span>
                <span className="menu-text">Links</span>
              </li>

              <li
                className={`menu-item ${activeComponent === "analytics" ? "active" : ""}`}
                onClick={handleAnalyticsClick}
              >
                <span className="menu-icon">
              
                </span>
                <span className="menu-text">Analytics</span>
              </li>

              <li
                className={`menu-item-setting ${activeComponent === "settings" ? "active" : ""}`}
                onClick={handleSettingsClick}
              >
                <span className="menu-icon-setting">⚙️</span>
                <span className="menu-text-setting">Settings</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mid-content">
          <div>
            {activeComponent === "dashpart" && <Dashpart />}
            {activeComponent === "data" && <Data searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
            {activeComponent === "analytics" && <Analysis />} 
            {activeComponent === "settings" && <Setting />}
          </div>
        </div>
      </div>

      <CreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
