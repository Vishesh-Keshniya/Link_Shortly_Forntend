import React, { useState } from "react";
import axios from "axios";
import "./CreateModal.css";

const CreateModal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isExpirationEnabled, setExpirationEnabled] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");

  if (!isOpen) return null;

  const handleClear = () => {
    setUrl("");
    setRemarks("");
    setExpirationEnabled(false);
    setExpirationDate("");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('User is not authenticated');
        return;
    }

    try {
        const response = await axios.post(
            'https://shortly-backend-syh2.onrender.com/create-link',
            {
                url,
                remarks,
                isExpirationEnabled,
                expirationDate,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const { shortUrl } = response.data.link;
        console.log('Short URL:', `https://shortly-backend-syh2.onrender.com/resolve/${shortUrl}`);
        
        onClose();
    } catch (error) {
        console.error('Error creating link:', error);
    }
};


  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>New Link</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <label>
            Destination Url <span className="required">*</span>
          </label>
          <input
            type="url"
            placeholder="https://web.whatsapp.com/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <label>
            Remarks <span className="required">*</span>
          </label>
          <textarea
            placeholder="Add remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          ></textarea>

          <div className="expiration-container">
            <label>Link Expiration</label>
            <div className="expiration-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isExpirationEnabled}
                  onChange={(e) => setExpirationEnabled(e.target.checked)}
                />
                <span className="slider"></span>
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
        <div className="modal-footer">
          <button className="clear-button" onClick={handleClear}>
            Clear
          </button>
          <button className="create-button" onClick={handleSubmit}>
            Create new
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
