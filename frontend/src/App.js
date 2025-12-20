import { useEffect, useState } from "react";
import { testConnection } from "./api";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";

function App() {    
  const [persons, setPersons] = useState([
    { id: 1, name: "Alice", hobbies: ["reading", "cycling"] },
    { id: 2, name: "Alice2", hobbies: ["reading2", "cycling2"] },
  ]);

  return (
    <div className="container mt-4">
        <h3>Person CRUD Demo</h3>

        <PersonForm/>
        <PersonList persons={persons}/>
    </div>
  )
}

export default App;
