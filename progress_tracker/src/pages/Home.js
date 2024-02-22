import { useState, useEffect, useContext, useCallback } from "react"
import { AuthContext } from "../App";
import Project from '../components/Project';
import { getDatabase, ref, get, push, remove, update, query, orderByChild, equalTo } from 'firebase/database'
import { app } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faSort } from '@fortawesome/free-solid-svg-icons';
import ModalAdd from '../components/ModalAdd';
import ModalEdit from '../components/ModalEdit';
import ModalDelete from '../components/ModalDelete';

function Home() {
  const {user} = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [updatedProject, setUpdatedProject] = useState({ name: '', progress: '', units: '', url: '' })
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [sorting, setSorting] = useState(null)

  useEffect(() => {
    user && getProjects();
    console.log("rendered");
  }, [user]);

  async function getProjects() {
    const db = getDatabase();
    const projectsRef = query(ref(db), orderByChild('userID'), equalTo(user.uid))
    try {
      const snapshot = await get(projectsRef)
      if (snapshot.exists()) {
        const data = snapshot.val()
        //Convert the data into an array of projects
        const userProjectsArray = Object.keys(data).map(key => {
              return{
                id: key,
                ...data[key]
              }
        }).filter(item => item !== null) //removing nulls from the array
        //console.log(userProjectsArray);
        if(sorting){
          sortProjects(userProjectsArray)
        } else{
          setProjects(userProjectsArray)
        }
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error(error)
    }
  }

  const editProject = useCallback((project) => { //triggered by edit icon
    setUpdatedProject({ name: project.name, progress: project.progress, units: project.units, url: project.url })
    setEditingProjectId(project.id)
  }, [])

  function addSubProject(projectID) {
    setShowAddModal(true)
    setEditingProjectId(projectID)
  }

  async function saveProject(project) {
    console.log(project);
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
      project.userID = user.uid
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

  const sortProjects = (projectsToSort) => {
    const sortedProjects = [...projectsToSort].sort((a, b) => {
      if(!sorting || sorting === "descending"){
        setSorting("ascending")
        return (a.progress / a.units) - (b.progress / b.units);
      }
      setSorting("descending")
      return (b.progress / b.units) - (a.progress / a.units);
    });
    setProjects(sortedProjects);
  }
  
  return (
      <div className="container">
      <div className="icons">
        <FontAwesomeIcon className='add-icon' icon={faCirclePlus} onClick={() => setShowAddModal(!showAddModal)} />
        <FontAwesomeIcon className='add-icon' icon={faSort} onClick={() => sortProjects(projects)} />
      </div>
        {projects.map(item => (
          item.parentID === undefined && <Project //first render can only contains items without parentID (parentID is for subprojects)
            key={item.id}
            id={item.id}
            editProject={editProject}
            confirmDeleteProject={confirmDeleteProject}
            addSubProject={addSubProject}
            projects={projects}
          />
        ))}
        <ModalAdd 
          isOpen={showAddModal}
          onConfirm={saveProject}
          onCancel={() => {
            setShowAddModal(false)
            setEditingProjectId(null)
          }}
          parentID={editingProjectId}
        />
        {!showAddModal && <ModalEdit
          editingProjectId={editingProjectId}
          onConfirm={saveProject}
          onCancel={() => setEditingProjectId(null)}
          projectData={updatedProject}
        />}
        <ModalDelete
          isOpen={showDeleteModal}
          onConfirm={deleteProject}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
  );
}

export default Home;
