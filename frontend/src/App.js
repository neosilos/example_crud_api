import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import { createPerson, getPeople } from "./api";
function App() {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadPeople() {
            setLoading(true);
            try {
                const data = await getPeople();
                setPersons(data.results);
            } catch (err) {
                alert("Error fetching people data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadPeople();
    }, []);

    const handleCreatePerson = async (person_data) => {
        const newPerson = await createPerson(person_data);
        setPersons((prevPersons) => [...prevPersons, newPerson]);
    }

    return (
        <div className="container mt-4">
            <h3>Person CRUD Demo</h3>

            <PersonForm onCreatePerson={handleCreatePerson} />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <PersonList persons={persons} />
            )}
        </div>
    )
}

export default App;
