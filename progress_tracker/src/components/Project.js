import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faEdit, faTrashAlt, faUpRightFromSquare, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

export default function Project({id, confirmDeleteProject, editProject, addSubProject, projects, expandAll, setExpandAll, setExpanding, completed, expandedProjects, setExpandedProjects}){

  const [project, setProject] = useState(null)
  const [subprojects, setSubprojects] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const foundProject = projects.find(project => project.id === id)
    setProject(foundProject)
    const foundSubprojects = projects.filter(subproject => subproject.parentID === id)
    setSubprojects(foundSubprojects)
    if(foundSubprojects.length > 0 && expandAll){
      setExpandedProjects(expandedProjects => {
        const newExpandedProjects = {...expandedProjects}
        // if (!isVisible) {
          newExpandedProjects[id] = 'expanded'
        // } else {
          // delete newExpandedProjects[id]
          // if(Object.entries(newExpandedProjects).length === 0 && newExpandedProjects.constructor === Object) setExpandAll(false)
        // }
        return newExpandedProjects
      })
    }
    setIsVisible(expandAll)
  }, [id, projects, expandAll])

  if(!project) {
    return <div>Loading project...</div>
  }

  const toggleSubprojectsVisibility = () => {
    setExpandedProjects(expandedProjects => {
      const newExpandedProjects = {...expandedProjects}
      if (!isVisible) {
        newExpandedProjects[id] = 'expanded'
      } else {
        delete newExpandedProjects[id]
        if(Object.entries(newExpandedProjects).length === 0 && newExpandedProjects.constructor === Object) setExpandAll(false)
      }
      return newExpandedProjects
    })
    setIsVisible(!isVisible)
  }

  return(
    <div className={`project_data ${(!completed && !project.parentID && project.calculatedProgress.counter === 0 && project.finalProgress === 1) || (project.calculatedProgress.counter > 0 && project.finalProgress/project.calculatedProgress.counter >= 1) ? 'project-completed' : ''}`}> 
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
        <FontAwesomeIcon className="icon-edit" icon={faEdit} onClick={() => editProject({id: project.id, name: project.name, progress: project.progress, units: project.units, url: project.url, hasCalculatedProgress: subprojects.length > 0})} />
        <FontAwesomeIcon className="icon-info" icon={faUpRightFromSquare} onClick={() => window.open(`${project.url}`, '_blank')} />
        <FontAwesomeIcon className="icon-delete" icon={faTrashAlt} onClick={() => confirmDeleteProject(project)} />
        <FontAwesomeIcon className="icon-edit" icon={faCirclePlus} onClick={() => addSubProject(project.id)} />
      </div>
      <FontAwesomeIcon className={`icon-toggle ${subprojects.find(subproject => subproject.parentID === id) ? '' : 'hidden'}`} icon={(isVisible || expandedProjects[id]) ? faChevronUp : faChevronDown} onClick={toggleSubprojectsVisibility} />
      
      {subprojects && <div className={`subprojects ${(isVisible || expandedProjects[id]) ? '' : 'hidden'}`}>
        {subprojects.map(subProject => (
          <Project 
            key={subProject.id} 
            id={subProject.id} 
            projects={projects} 
            editProject={editProject}
            confirmDeleteProject={confirmDeleteProject}
            addSubProject={addSubProject}
            expandAll={expandAll}
            setExpandAll={setExpandAll}
            setExpanding={setExpanding}
            completed={completed}
            expandedProjects={expandedProjects}
            setExpandedProjects={setExpandedProjects}
          />
        ))}
      </div>}
    </div>
  )
}