import './App.css';
import { useState, useEffect } from "react"
import Project from './Project';
import { getDatabase, ref, get, push, remove, update } from 'firebase/database'
import { app } from './Config/firebase';
import ModalDelete from './ModalDelete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [projects, setprojects] = useState([])
  const [newProject, setNewProject] = useState({ name: '', progress: '', units: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

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
    setNewProject({ name: '', progress: '', units: '' }); //Reset input fields after saving
    setEditingProjectId(null); //Reset editing ID
    setShowAddProject(false); //Hide input fields
    getProjects(); //Refresh list of projects
  }

  function confirmDeleteProject(project) {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  }

  async function deleteProject() {
    const db = getDatabase(app);
    const projectRef = ref(db, projectToDelete.id);
    try {
      await remove(projectRef);
      console.log("Project deleted");
      getProjects();
    } catch (error) {
      console.log(error);
    }
    setShowDeleteModal(false); // Hide the modal after deletion
    setProjectToDelete(null); // Reset the project to delete
  }

  return (
    <div className="App">
      <div className="navbar">
        <img className='img-logo' src='/logo192.png'></img>
        <h1>Progress Tracker</h1>
      </div>
      <div className="container">
      <FontAwesomeIcon className='add-icon' icon={faCirclePlus} onClick={() => setShowAddProject(!showAddProject)} />
        {projects.map(item => (
          <Project
            key={item.id}
            id={item.id}
            name={item.name}
            completed={item.progress}
            units={item.units}
            editProject={editProject}
            deleteProjectClick={() => confirmDeleteProject(item)}
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
        <ModalDelete
          isOpen={showDeleteModal}
          onConfirm={deleteProject}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );
}

export default App;
