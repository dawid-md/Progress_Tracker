import './App.css';
import { useState, useEffect } from "react"
import Project from './Project';
import { getDatabase, ref, get, push, remove, update } from 'firebase/database'
import { app } from './Config/firebase';

function App() {
  const [projects, setprojects] = useState([])
  const [newProject, setNewProject] = useState({ name: '', progress: '', units: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);

  useEffect(() => {
    getProjects();
  }, []);

  async function getProjects(){
    const db = getDatabase()
    const openingsRef = ref(db)
    try{
      const snapshot = await get(openingsRef)
      if(snapshot.exists()) {
        const data = snapshot.val()
        //console.log(data);
        const projectsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        setprojects(projectsArray)
      } else {
        console.log("No data available")
      }
    } catch (error) {
      console.log(error);
    }
  }

  function editProject(project) {
    setNewProject({ name: project.name, progress: project.completed, units: project.units });
    setEditingProjectId(project.id);
    setShowAddProject(true); 
  }

  async function saveProject() {
    const db = getDatabase(app);
    let projectsRef;

    if (editingProjectId) {
      projectsRef = ref(db, editingProjectId);
      try {
        await update(projectsRef, newProject);
        console.log("Project updated");
      } catch (error) {
        console.log(error);
      }
    } else {
      projectsRef = ref(db);
      try {
        await push(projectsRef, newProject);
        console.log("Project saved");
      } catch (error) {
        console.log(error);
      }
    }
    setNewProject({ name: '', progress: '', units: '' }); // Reset input fields after saving
    setEditingProjectId(null); // Reset editing ID
    setShowAddProject(false); // Hide input fields
    getProjects(); // Refresh list of projects
  }

  async function deleteProject(projectId) {
    const db = getDatabase(app);
    const projectRef = ref(db, projectId);
    try {
      await remove(projectRef);
      console.log("Project deleted");
      getProjects();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <div className="container">
        {projects.map(item => (
          <Project
            key={item.id}
            id={item.id}
            name={item.name}
            completed={item.progress}
            units={item.units}
            deleteProject={deleteProject}
            editProject={editProject}
          />
        ))}
        <button onClick={() => setShowAddProject(!showAddProject)}>Add New Project</button>
        {showAddProject && (
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
            <button onClick={saveProject}>Save Project</button>
          </div>
        )}
        {/* <button onClick={getProjects}>Get Projects</button> */}
      </div>
    </div>
  );
}

export default App;
