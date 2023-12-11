import { useState, useEffect } from "react";

export default function ModalEdit({ editingProjectId, onConfirm, onCancel , projectData}) {
  const [newProject, setNewProject] = useState({id: editingProjectId, name: projectData.name, progress: projectData.progress, units: projectData.units });

  useEffect(() => {
    if (editingProjectId) {
      setNewProject({
        id: editingProjectId,
        name: projectData.name,
        progress: projectData.progress,
        units: projectData.units
      });
    }
  }, [editingProjectId, projectData]);

  if (!editingProjectId) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit project</h3>
        <div>
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
          {/* <button onClick={saveProject}>Save Project</button> */}
        </div>

        <div className="modal-content-buttons">
          <div className="confirm-button" onClick={() => onConfirm(newProject)}>Save</div>
          <div className="cancel-button" onClick={onCancel}>Cancel</div>
        </div>
      </div>
    </div>
  );
}