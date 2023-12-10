import { useState } from "react";

export default function ModalAdd({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
    const [newProject, setNewProject] = useState({ name: '', progress: '', units: '' });
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>Do you want to delete this project?</h3>
          <div className="modal-content-buttons">
            <div className="confirm-button" onClick={onConfirm}>Yes</div>
            <div className="cancel-button" onClick={onCancel}>No</div>
          </div>
        </div>
      </div>
    );
  }