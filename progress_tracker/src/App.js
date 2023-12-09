import './App.css';
import { useState } from "react"

function App() {
  const [units, setunits] = useState([60, 100])

  return (
    <div className="App">
      <div className="container">
        <div className="progressBar">
          {Array.from({length: units[0]}).map((_, index) => (
              <div className="completed" key={index}>
              </div>
          ))}
          {Array.from({length: units[1]-units[0]}).map((_, index) => (
            <div className="unit" key={index}>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
