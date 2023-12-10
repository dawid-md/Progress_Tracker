import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function Project({id, name, completed, units, deleteProject, editProject}){
    return(
        <div className='project_data'>
        <h2 className="project_name">{name}</h2>
        <div className="project_control">
          <div className="progressBar">
            {Array.from({length: completed}).map((_, index) => (
                <div className="completed" key={index}>
                </div>
            ))}
            {Array.from({length: units-completed}).map((_, index) => (
              <div className="unit" key={index}>
              </div>
            ))}
          </div>
          <FontAwesomeIcon className="icon-edit" icon={faEdit} onClick={() => editProject({id, name, completed, units})} />
          <FontAwesomeIcon className="icon-delete" icon={faTrashAlt} onClick={() => deleteProject(id)} />
        </div>
      </div>
    )
}