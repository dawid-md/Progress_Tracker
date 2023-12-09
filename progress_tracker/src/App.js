import './App.css';
import { useState } from "react"
import Project from './Project';
import { getDatabase, ref, get, push, remove, update } from 'firebase/database'
import { app } from './Config/firebase';

function App() {
  const [units, setunits] = useState([60, 100])
  const [projects, setprojects] = useState([])

  async function getProjectss(){
    const db = getDatabase()
    const openingsRef = ref(db)
    try{
      const snapshot = await get(openingsRef)
      if(snapshot.exists()) {
        const data = snapshot.val()
        console.log(data);
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

  async function saveProject(){
    const db = getDatabase();
    const projectsRef = ref(db);
    //if(comment.commentID == ""){
      try {
        await push(projectsRef, {name: "react-native course", progress: "20", units: "120"});
        console.log("project saved");
      } catch (error) {
        console.log(error);
      }
    // } else {    //update comment
    //   const specificCommentRef = ref(db, `Comments/${comment.commentID}`);
    //   try {
    //     await update(specificCommentRef, { "comment": comment.comment });
    //     console.log("comment updated");
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    //loadComment();
  }

  return (
    <div className="App">
      <div className="container">
        {projects.map(item => <Project key={item.key} name={item.name} completed={item.progress} units={item.units} /> )}
        {/* <Project units={units}/> */}
        <button onClick={getProjectss}>Get Projects</button>
        <button onClick={saveProject}>Save Project</button>
      </div>
    </div>
  );
}

export default App;
