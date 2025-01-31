import React, { useState } from "react";
import "./Phone.css";

const Phone = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
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
                <img src="Anal-icon.png" alt="Analytics Icon" />
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
  );
};

export default Phone;
