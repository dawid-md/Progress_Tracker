import './App.css';
import { useState, useEffect } from "react"
import Project from './Project';
import { getDatabase, ref, get, push, remove, update } from 'firebase/database'
import { app } from './Config/firebase';

function App() {
  const [units, setunits] = useState([60, 100])
  const [projects, setprojects] = useState([])
  const [newProject, setNewProject] = useState({ name: '', progress: '', units: '' });
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

  async function saveProject() {
    const db = getDatabase(app);
    const projectsRef = ref(db); 
    try {
      await push(projectsRef, newProject);
      console.log("Project saved");
      setNewProject({ name: '', progress: '', units: '' }); //Reset input fields after saving
      getProjects(); //Refresh list of projects
    } catch (error) {
      console.log(error);
    }
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
        {projects.map(item => <Project key={item.id} id={item.id} name={item.name} completed={item.progress} units={item.units} deleteProject={deleteProject} />)}
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
              type="text" 
              placeholder="Progress" 
              value={newProject.progress} 
              onChange={e => setNewProject({ ...newProject, progress: e.target.value })}
            />
            <input 
              type="text" 
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
