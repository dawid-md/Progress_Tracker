import './App.css';
import { useState } from "react"

function App() {
  const [units, setunits] = useState(100)

  return (
    <div className="App">
      <div className="container">
        <div className="progressBar">
          {Array.from({length: units}).map((_, index) => (
            <div className="unit" key={index}>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
