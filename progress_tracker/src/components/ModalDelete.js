export default function ModalDelete({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2 className="modal-label">Do you want to delete this project?</h2>
          <div className="modal-content-buttons">
            <div className="confirm-button" onClick={onConfirm}>Yes</div>
            <div className="cancel-button" onClick={onCancel}>Cancel</div>
          </div>
        </div>
      </div>
    );
  }