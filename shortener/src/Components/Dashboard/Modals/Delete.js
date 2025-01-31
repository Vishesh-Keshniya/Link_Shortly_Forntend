import React from "react";
import "./DeleteModal.css";

const Delete = ({ onClose, onConfirm }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-container">
        <button
          className="delete-modal-close-button"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="delete-modal-content">
          <p className="delete-modal-text">
          Are you sure, you want to delete the account ? 
          </p>

          <div className="delete-modal-actions">
            <button
              className="delete-modal-button-no"
              onClick={onClose}
            >
              NO
            </button>

            <button
              className="delete-modal-button-yes"
              onClick={onConfirm}
            >
              YES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delete;
