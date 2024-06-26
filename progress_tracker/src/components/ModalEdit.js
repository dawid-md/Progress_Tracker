import { useState, useEffect } from "react";

export default function ModalEdit({ editingProjectId, onConfirm, onCancel , projectData}) {
  const [newProject, setNewProject] = useState({id: editingProjectId, name: projectData.name, progress: projectData.progress,
     units: projectData.units, priority: projectData.priority, url: projectData.url, hasCalculatedProgress: projectData.hasCalculatedProgress });

  useEffect(() => {
    if (editingProjectId) {
      setNewProject({
        id: editingProjectId,
        name: projectData.name,
        progress: projectData.progress,
        units: projectData.units,
        priority: projectData.priority,
        url: projectData.url,
        hasCalculatedProgress: projectData.hasCalculatedProgress
      });
    }
  }, [editingProjectId, projectData]);

  if (!editingProjectId) return null; //why this line is here exactly? need to check (probably to avoid warning that input changes state etc)

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-label">Edit project</h2>
        <div className="modal-fields">
          <p className="label">Name</p>
          <input 
            type="text" 
            placeholder="Name" 
            value={newProject.name || ''} 
            onChange={e => setNewProject({ ...newProject, name: e.target.value })}
          />
          {!newProject.hasCalculatedProgress ? 
          <>
            <p className="label">Progress</p>
            <input 
              type="number" 
              placeholder="Progress" 
              value={newProject.progress || ''} 
              onChange={e => setNewProject({ ...newProject, progress: e.target.value })}
            />
            <p className="label">Units</p>
            <input 
              type="number" 
              placeholder="Units" 
              value={newProject.units || ''} 
              onChange={e => setNewProject({ ...newProject, units: e.target.value })}
            />
          </> : null }
          <p className="label">Priority</p>
          <input 
              type="number" 
              placeholder="0 or 1" 
              value={newProject.priority || ''} 
              onChange={e => setNewProject({ ...newProject, priority: e.target.value })}
          />
          <p className="label">URL</p>
          <input 
            type="text" 
            placeholder="URL" 
            value={newProject.url || ''} 
            onChange={e => setNewProject({ ...newProject, url: e.target.value })}
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