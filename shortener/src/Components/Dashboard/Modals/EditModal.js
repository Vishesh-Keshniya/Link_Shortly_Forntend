import React, { useState, useEffect } from "react";
import "./EditModal.css";
import axios from "axios";

const EditModal = ({ isOpen, onClose, link, onUpdate }) => {
  const [url, setUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isExpirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    if (link) {
      setUrl(link.destinationUrl);
      setRemarks(link.remarks);
      setExpirationEnabled(!!link.expiryDate);
      setExpirationDate(link.expiryDate || "");
    }
  }, [link]);

  if (!isOpen) return null;

  const handleClear = () => {
    setUrl("");
    setRemarks("");
    setExpirationEnabled(false);
    setExpirationDate("");
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("User is not authenticated");
        return;
      }
  
      if (!url || !remarks) {
        alert("URL and Remarks are required");
        return;
      }
  
      const dataToSend = {
        url,
        remarks,
        expirationDate: isExpirationEnabled ? expirationDate : null,
      };
  
      console.log('Sending data:', dataToSend); 
      console.log('Link ID:', link._id); 
  
      const response = await axios.put(
        `https://shortly-backend-syh2.onrender.com/api/update-link/${link._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Link updated:', response.data.link);
  
      onClose();
  
      onUpdate(response.data.link);
    } catch (error) {
      console.error('Error updating link:', error);
  
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-container">
        <div className="edit-modal-header">
          <h3>Edit Link</h3>
          <button className="edit-close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="edit-modal-body">
          <label>
            Destination Url <span className="edit-required">*</span>
          </label>
          <input
            type="url"
            placeholder="https://web.whatsapp.com/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <label>
            Remarks <span className="edit-required">*</span>
          </label>
          <textarea
            placeholder="Add remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          ></textarea>

          <div className="edit-expiration-container">
            <label>Link Expiration</label>
            <div className="edit-expiration-toggle">
              <label className="edit-toggle-switch">
                <input
                  type="checkbox"
                  checked={isExpirationEnabled}
                  onChange={(e) => setExpirationEnabled(e.target.checked)}
                />
                <span className="edit-slider"></span>
              </label>
            </div>
          </div>

          {isExpirationEnabled && (
            <input
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          )}
        </div>
        <div className="edit-modal-footer">
          <button className="edit-clear-button" onClick={handleClear}>
            Clear
          </button>
          <button className="edit-create-button" onClick={handleSubmit}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
