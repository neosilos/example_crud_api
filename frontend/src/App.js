import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import { createPerson } from "./api";
function App() {    
  const [persons, setPersons] = useState([]);

  const handleCreatePerson = async (person_data) => {
    const newPerson = await createPerson(person_data);
    setPersons((prevPersons) => [...prevPersons, newPerson]);
  }

  return (
    <div className="container mt-4">
        <h3>Person CRUD Demo</h3>

        <PersonForm onCreatePerson={handleCreatePerson}/>
        <PersonList persons={persons}/>
    </div>
  )
}

export default App;
