import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Setting.css';
import Delete from './Delete'; 
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for toastify
import { toast, ToastContainer } from 'react-toastify'; 

const Setting = () => {
  const [userData, setUserData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
  });

  const [originalEmail, setOriginalEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No token found, please log in');
      navigate('/login'); 
      return;
    }

    axios
      .get('https://shortly-backend-syh2.onrender.com/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.user) {
          setUserData({ ...response.data.user, _id: response.data.user._id });
          setOriginalEmail(response.data.user.email); 
        } else {
          console.log('Error fetching user data');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data.');
      });
  }, [navigate]);

  const validateInputs = () => {
    const { email, phone } = userData;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
      toast.error('Invalid email address');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      toast.error('Invalid phone number');
      return false;
    }
    return true;
  };

  const handleSaveChanges = () => {
    if (!validateInputs()) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No token found, cannot save changes');
      return;
    }

    axios
      .put(`https://shortly-backend-syh2.onrender.com/api/user/${userData._id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success('User data updated successfully');
        
        if (userData.email !== originalEmail) {
          console.log('Email changed. Logging out...');
          localStorage.removeItem('authToken');
          setTimeout(() => {
            navigate('/'); 
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
        toast.error('Failed to update user data.');
      });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true); 
  };

  const confirmDeleteAccount = () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found, cannot delete account');
      return;
    }
    
    axios
      .delete(`https://shortly-backend-syh2.onrender.com/api/user/${userData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success('Account deleted successfully');
        localStorage.removeItem('authToken'); 
        navigate('/'); 
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account.');
      });
  };

  return (
    <div className="setting-container">
      <form className="setting-form">
        <div className="setting-field">
          <label className="setting-label">Name</label>
          <input
            className="setting-input"
            type="text"
            placeholder="Rahul Singh"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>
        <div className="setting-field">
          <label className="setting-label">Email id</label>
          <input
            className="setting-input"
            type="email"
            placeholder="rahulsingh@gmail.com"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div className="setting-field">
          <label className="setting-label">Mobile no.</label>
          <input
            className="setting-input"
            type="text"
            placeholder="1234567890"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />
        </div>
        <button type="button" className="save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </form>

      <div className="delete-button-part">
        <button type="button" className="delete-button" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <Delete
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteAccount}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Setting;
