import React, { useState } from "react";
import "./Menu.css";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="menu-container">
     
   

      <div className={`menu-content ${isMenuOpen ? "open" : "closed"}`}>
        <ul className="menu-items">
          <li className="menu-item">
            <span className="menu-icon"><img src="dash-icon.png" alt="Dashboard Icon" /></span>
            <span className="menu-text">Dashboard</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon"><img src="link-icon.png" alt="Links Icon" /></span>
            <span className="menu-text">Links</span>
          </li>
          <li className="menu-item">
            <span className="menu-icon"><img src="Anal-icon.png" alt="Analytics Icon" /></span>
            <span className="menu-text">Analytics</span>
          </li>
          <li className="menu-item-setting">
            <span className="menu-icon-setting">⚙️</span>
            <span className="menu-text-setting">Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
