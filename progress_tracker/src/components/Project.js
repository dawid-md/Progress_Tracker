import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faEdit, faTrashAlt, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";

export default function Project({id, deleteProjectClick, editProject, addSubProject, projects}){

  const [project, setProject] = useState(null)
  const [subprojects, setSubprojects] = useState(null)

  useEffect(() => {
    const foundProject = projects.find(project => project.id === id)
    setProject(foundProject)
    const foundSubprojects = projects.filter(project => project.parentID === id)
    setSubprojects(foundSubprojects)
    // console.log(foundSubprojects);

  }, [id, projects])

  if(!project) {
    return <div>Loading project...</div>
  }

  return(
    <div className='project_data'>
      <h2 className="project_name">{project.name}</h2>
      <div className="project_control">
        <div className="progressBar">
          {Array.from({length: project.progress}).map((_, index) => (
            <div className="completed" key={index}>
            </div>
          ))}
          {Array.from({length: project.units - project.progress}).map((_, index) => (
            <div className="unit" key={index}>
            </div>
          ))}
        </div>
        <FontAwesomeIcon className="icon-edit" icon={faEdit} onClick={editProject} />
        <FontAwesomeIcon className="icon-info" icon={faUpRightFromSquare} onClick={() => window.open(`${project.url}`, '_blank')} />
        <FontAwesomeIcon className="icon-delete" icon={faTrashAlt} onClick={deleteProjectClick} />
        <FontAwesomeIcon className="icon-edit" icon={faCirclePlus} onClick={() => addSubProject(id)} />
      </div>
      {subprojects && <div className="subprojects">
        {subprojects.map(subProject => (
          <Project 
            key={subProject.id} 
            id={subProject.id} 
            projects={projects} 
            editProject={editProject}
            deleteProjectClick={deleteProjectClick}
            addSubProject={addSubProject}
          />
        ))}
      </div>}
    </div>
  )
}

{/* <Project
            key={item.id}
            id={item.id}
            editProject={() => editProject({id: item.id, name: item.name, progress: item.progress, units: item.units, url: item.url})}
            deleteProjectClick={() => confirmDeleteProject(item)}
            addSubProject={() => addSubProject(item.id)}
            projects={projects}
          /> */}