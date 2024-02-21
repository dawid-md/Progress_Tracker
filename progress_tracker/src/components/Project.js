import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faEdit, faTrashAlt, faUpRightFromSquare, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

export default function Project({id, confirmDeleteProject, editProject, addSubProject, projects}){

  const [project, setProject] = useState(null)
  const [subprojects, setSubprojects] = useState(null)
  const [isVisible, setIsVisible] = useState(project?.parentID)

  useEffect(() => {
    const foundProject = projects.find(project => project.id === id)
    setProject(foundProject)
    const foundSubprojects = projects.filter(project => project.parentID === id)
    setSubprojects(foundSubprojects)
  }, [id, projects, isVisible])

  if(!project) {
    return <div>Loading project...</div>
  }

  const toggleSubprojectsVisibility = () => {
    setIsVisible(!isVisible)
  }

  return(
    <>
    <FontAwesomeIcon className="icon-toggle" icon={isVisible ? faChevronUp : faChevronDown} onClick={toggleSubprojectsVisibility} />
    <div className={`project_data ${project.parentID ? 'hidden' : ''}`}> 
      <h2 className="project_name">{project.name}</h2>
      <div className="project_control">
        <div className="progressBar">
          {Array.from({length: project.progress}).map((_, index) => (
            <div className={`completed ${project.parentID ? 'completedSub' : ''}`} key={index}></div>
          ))}
          {Array.from({length: project.units - project.progress}).map((_, index) => (
            <div className="unit" key={index}></div>
          ))}
        </div>
        <FontAwesomeIcon className="icon-edit" icon={faEdit} onClick={() => editProject({id: project.id, name: project.name, progress: project.progress, units: project.units, url: project.url})} />
        <FontAwesomeIcon className="icon-info" icon={faUpRightFromSquare} onClick={() => window.open(`${project.url}`, '_blank')} />
        <FontAwesomeIcon className="icon-delete" icon={faTrashAlt} onClick={() => confirmDeleteProject(project)} />
        <FontAwesomeIcon className="icon-edit" icon={faCirclePlus} onClick={() => addSubProject(project.id)} />
      </div>
      {subprojects && <div className="subprojects">
        {subprojects.map(subProject => (
          <Project 
            key={subProject.id} 
            id={subProject.id} 
            projects={projects} 
            editProject={editProject}
            confirmDeleteProject={confirmDeleteProject}
            addSubProject={addSubProject}
          />
        ))}
      </div>}
    </div>
    </>
  )
}