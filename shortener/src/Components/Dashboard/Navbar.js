import React, { useState, useEffect } from "react";
import "./Navbar.css";
import CreateModal from "./Modals/CreateModal";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌄 Good morning";
    else if (hour < 18) return "☀️ Good afternoon";
    else if (hour > 18)  "🌆 Good evening";
    else return "🌙 Good night";
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
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" "); 
  };

  const handleProfileClick = () => {
    setShowLogout(prevState => !prevState); 
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName('');
    setShowLogout(false); 
    navigate("/"); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
         
          <span className="greeting">
            {`${getGreeting()}, ${capitalizeFirstLetter(userName) || 'Guest'}`}
          </span>
          <div className="day">
            <span className="date">{getFormattedDate()}</span>
          </div>
        </div>
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
            className="search-input"
          />
           {showLogout && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
          <div className="profile-icon" onClick={handleProfileClick}>
            {
              userName
                ? userName.split(' ').length > 1
                  ? userName.split(' ')[0].charAt(0).toUpperCase() + userName.split(' ')[1].charAt(0).toUpperCase()
                  : userName.charAt(0).toUpperCase() + userName.charAt(userName.length - 1).toUpperCase()
                : 'G'
            }
          </div>
         
        </div>
      </nav>

      <CreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
