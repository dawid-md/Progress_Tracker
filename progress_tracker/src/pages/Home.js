import { useState, useEffect } from "react"
import Project from '../components/Project';
import { getDatabase, ref, get, push, remove, update } from 'firebase/database'
import { app } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import ModalAdd from '../components/ModalAdd';
import ModalEdit from '../components/ModalEdit';
import ModalDelete from '../components/ModalDelete';

function Home() {
  const [projects, setprojects] = useState([])
  const [updatedProject, setUpdatedProject] = useState({ name: '', progress: '', units: '', url: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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

  function editProject(project) { //triggered by edit icon
    setUpdatedProject({ name: project.name, progress: project.completed, units: project.units, url: project.url });
    setEditingProjectId(project.id);
  }

  async function saveProject(project) {
    const db = getDatabase(app);
    let projectsRef;

    if (project.id) {
      projectsRef = ref(db, project.id);
      try {
        await update(projectsRef, project);
        console.log("Project updated");
      } catch (error) {
        console.log(error);
      }
    } else {
      projectsRef = ref(db);
      try {
        await push(projectsRef, project);
        console.log("Project saved");
      } catch (error) {
        console.log(error);
      }
    }
    setUpdatedProject({ name: '', progress: '', units: '', url: '' }); //Reset input fields after saving
    setEditingProjectId(null); //Reset editing ID
    setShowAddModal(false); //Hide input fields
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
      <div className="container">
      <FontAwesomeIcon className='add-icon' icon={faCirclePlus} onClick={() => setShowAddModal(!showAddModal)} />
        {projects.map(item => (
          <Project
            key={item.id}
            id={item.id}
            name={item.name}
            completed={item.progress}
            units={item.units}
            url={item.url}
            editProject={editProject}
            deleteProjectClick={() => confirmDeleteProject(item)}
          />
        ))}
        <ModalAdd 
          isOpen={showAddModal}
          onConfirm={saveProject}
          onCancel={() => setShowAddModal(false)}
        />
        <ModalEdit
          editingProjectId={editingProjectId}
          onConfirm={saveProject}
          onCancel={() => setEditingProjectId(null)}
          projectData={updatedProject}
        />
        <ModalDelete
          isOpen={showDeleteModal}
          onConfirm={deleteProject}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
  );
}

export default Home;
