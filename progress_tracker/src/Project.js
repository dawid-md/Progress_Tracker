export default function Project({key, name, completed, units}){
    return(
        <div key="key" className='project_data'>
        <h2 className="project_name">{name}</h2>
        <div className="progressBar">
          {Array.from({length: completed}).map((_, index) => (
              <div className="completed" key={index}>
              </div>
          ))}
          {Array.from({length: units}).map((_, index) => (
            <div className="unit" key={index}>
            </div>
          ))}
        </div>
      </div>
    )
}