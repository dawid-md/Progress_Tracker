import { useEffect, useState } from "react";

export default function ModalAdd({ isOpen, onConfirm, onCancel, parentID }) {
  const [newProject, setNewProject] = useState({ name: '', progress: '', units: '', url: '', parentID: parentID, priority: 0})
    
    useEffect(() => {
      setNewProject(currentProject => ({ ...currentProject, parentID }))
    }, [parentID])

    if (!isOpen) return null;

    return (
      <div className="modal">
        <div className="modal-content">
          {parentID ? <h2 className="modal-label">New sub-project</h2> : <h2 className="modal-label">New project</h2>}
          <div className="modal-fields">
            <input 
              type="text" 
              placeholder="Name" 
              value={newProject.name} 
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            />
            <input 
              type="number" 
              placeholder="Progress" 
              value={newProject.progress} 
              onChange={e => setNewProject({ ...newProject, progress: e.target.value })}
            />
            <input 
              type="number" 
              placeholder="Units" 
              value={newProject.units} 
              onChange={e => setNewProject({ ...newProject, units: e.target.value })}
            />
            <input 
              type="number" 
              placeholder="Priority 0 or 1" 
              // value={newProject.priority} 
              onChange={e => setNewProject({ ...newProject, priority: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="URL" 
              value={newProject.url} 
              onChange={e => setNewProject({ ...newProject, url: e.target.value })}
            />
            {/* <button onClick={saveProject}>Save Project</button> */}
          </div>

          <div className="modal-content-buttons">
            <div className="confirm-button" onClick={() => {
                onConfirm(newProject)
                setNewProject({ name: '', progress: '', units: '', url: '', parentID: null })
              }
              }>Save</div>
            <div className="cancel-button" onClick={onCancel}>Cancel</div>
          </div>
        </div>
      </div>
    );
  }