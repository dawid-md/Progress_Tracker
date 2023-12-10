export default function ModalDelete({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <p>Are you sure you want to delete this project?</p>
          <button onClick={onConfirm}>Yes, Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }