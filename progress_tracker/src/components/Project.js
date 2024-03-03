import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faEdit, faTrashAlt, faUpRightFromSquare, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

export default function Project({id, confirmDeleteProject, editProject, addSubProject, projects, expandAll}){

  const [project, setProject] = useState(null)
  const [subprojects, setSubprojects] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const foundProject = projects.find(project => project.id === id)
    setProject(foundProject)
    const foundSubprojects = projects.filter(project => project.parentID === id)
    setSubprojects(foundSubprojects)
    setIsVisible(expandAll)
  }, [id, projects, expandAll])

  if(!project) {
    return <div>Loading project...</div>
  }

  const toggleSubprojectsVisibility = () => {
    setIsVisible(!isVisible)
  }

  return(
    <div className={"project_data"}> 
      <h2 className="project_name">{project.name}</h2>
      <div className="project_control">
        {project.calculatedProgress.counter > 0 ?
          <div className="progressBar">
            {Array.from({length: project.finalProgress/project.calculatedProgress.counter * 100}).map((_, index) => (
              <div className={`completed ${project.parentID ? 'completedSub' : ''}`} key={index}></div>
            ))}
            {Array.from({length: (1 - project.finalProgress/project.calculatedProgress.counter) * 100}).map((_, index) => (
              <div className="unit" key={index}></div>
             ))} 
          </div> 
          : 
          <div className="progressBar">
            {Array.from({length: project.progress}).map((_, index) => (
              <div className={`completed ${project.parentID ? 'completedSub' : ''}`} key={index}></div>
            ))}
            {Array.from({length: project.units - project.progress}).map((_, index) => (
              <div className="unit" key={index}></div>
            ))}
          </div>
        }
        <FontAwesomeIcon className="icon-edit" icon={faEdit} onClick={() => editProject({id: project.id, name: project.name, progress: project.progress, units: project.units, url: project.url})} />
        <FontAwesomeIcon className="icon-info" icon={faUpRightFromSquare} onClick={() => window.open(`${project.url}`, '_blank')} />
        <FontAwesomeIcon className="icon-delete" icon={faTrashAlt} onClick={() => confirmDeleteProject(project)} />
        <FontAwesomeIcon className="icon-edit" icon={faCirclePlus} onClick={() => addSubProject(project.id)} />
      </div>
      <FontAwesomeIcon className={`icon-toggle ${subprojects.find(project => project.parentID === id) ? '' : 'hidden'}`} icon={isVisible ? faChevronUp : faChevronDown} onClick={toggleSubprojectsVisibility} />
      {subprojects && <div className={`subprojects ${isVisible ? '' : 'hidden'}`}>
        {subprojects.map(subProject => (
          <Project 
            key={subProject.id} 
            id={subProject.id} 
            projects={projects} 
            editProject={editProject}
            confirmDeleteProject={confirmDeleteProject}
            addSubProject={addSubProject}
            expandAll={expandAll}
          />
        ))}
      </div>}
    </div>
  )
}