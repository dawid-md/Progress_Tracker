import { useState, useEffect, useContext, useCallback } from "react"
import { AuthContext } from "../App"
import Project from '../components/Project'
import { getDatabase, ref, get, push, remove, update, query, orderByChild, equalTo } from 'firebase/database'
import { app } from '../config/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faSort, faAnglesDown, faAnglesUp, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'
import ModalAdd from '../components/ModalAdd'
import ModalEdit from '../components/ModalEdit'
import ModalDelete from '../components/ModalDelete'

function Home() {
  const {user} = useContext(AuthContext)
  const [projects, setProjects] = useState([])
  const [updatedProject, setUpdatedProject] = useState({ name: '', progress: '', units: '', url: '', hasCalculatedProgress: false })
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [sorting, setSorting] = useState(null)
  const [expandAll, setExpandAll] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [expandedProjects, setExpandedProjects] = useState({})

  useEffect(() => {
    user && getProjects()
    console.log("rendered")
  }, [user]);

  async function getProjects() {
    const db = getDatabase();
    const projectsRef = query(ref(db), orderByChild('userID'), equalTo(user.uid))
    try {
      const snapshot = await get(projectsRef)
      if (snapshot.exists()) {
        const data = snapshot.val()
        let userProjectsArray = Object.keys(data).map(key => {  //Convert the data into an array of projects
          return{
            id: key,
            ...data[key]
          }
        }).filter(item => item !== null) //removing nulls from the array

        userProjectsArray = calculateProgress(userProjectsArray)

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

  const calculateProgress = (userProjectsArray) => {
    const calculatedProjects = {}
    userProjectsArray.forEach(item => {
      item.calculatedProgress = {progress: {}, counter: 0}
      item.finalProgress = item.progress / item.units
      calculatedProjects[item.id] = item
    })
    calculate(calculatedProjects)
    return userProjectsArray
  }

  const calculate = (calculatedProjects, parentID = null) => {
    if(parentID){
      let parID = calculatedProjects[parentID].parentID
      if(calculatedProjects[parID].calculatedProgress.progress[parentID] != undefined){
        calculatedProjects[parID].calculatedProgress.progress[parentID] = calculatedProjects[parentID].finalProgress / calculatedProjects[parentID].calculatedProgress.counter
        calculatedProjects[parID].finalProgress = 0
        Object.keys(calculatedProjects[parID].calculatedProgress.progress).forEach(val => {
          calculatedProjects[parID].finalProgress += calculatedProjects[parID].calculatedProgress.progress[val]
        })
        if(calculatedProjects[parID].parentID){
          calculate(calculatedProjects, parID)
        }
      }
    } else {
      Object.keys(calculatedProjects).forEach(item => {
          let parID = calculatedProjects[item].parentID
          if(parID){
              calculatedProjects[parID].calculatedProgress.progress[item] = calculatedProjects[item].finalProgress
              calculatedProjects[parID].finalProgress = 0
              Object.keys(calculatedProjects[parID].calculatedProgress.progress).forEach(val => {
                calculatedProjects[parID].finalProgress += calculatedProjects[parID].calculatedProgress.progress[val]
              })
              calculatedProjects[parID].calculatedProgress.counter += 1
              if(calculatedProjects[parID].parentID){
                calculate(calculatedProjects, parID)
              }
          }
          parID = null
      })
    }
  }

  const editProject = useCallback((project) => { //triggered by edit icon
    setUpdatedProject({ name: project.name, progress: project.progress, units: project.units, url: project.url, hasCalculatedProgress: project.hasCalculatedProgress })
    setEditingProjectId(project.id)
  }, [])

  function addSubProject(projectID) {
    setShowAddModal(true)
    setEditingProjectId(projectID)
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
        {expandAll ? <FontAwesomeIcon className='add-icon' icon={faAnglesUp} onClick={() => setExpandAll(currState => !currState)} /> : 
          <FontAwesomeIcon className='add-icon' icon={faAnglesDown} onClick={() => setExpandAll(currState => !currState)} />}
        <FontAwesomeIcon className='add-icon' icon={completed ? faToggleOn : faToggleOff} onClick={() => setCompleted(!completed)} />
      </div>
        {projects.map(item => (
          item.parentID === undefined && <Project //first render can only contains items without parentID (parentID is for subprojects to use)
            key={item.id}
            id={item.id}
            editProject={editProject}
            confirmDeleteProject={confirmDeleteProject}
            addSubProject={addSubProject}
            projects={projects}
            expandAll={expandAll}
            completed={completed}
            expandedProjects={expandedProjects}
            setExpandedProjects={setExpandedProjects}
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

export default Home