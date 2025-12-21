import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import { createPerson, deletePerson, getPeople } from "./api";

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


    const handleDeletePerson = async (person_id) => {
        
        if(!window.confirm("Are you sure you want to delete this person?")){
            return;
        }

        try{
            await deletePerson({id: person_id});
            setPersons((prevPersons) => prevPersons.filter((p) => p.id !== person_id));
        } catch (err){
            console.error(err);
            alert("Error deleting person");
        }
    }


    return (
        <div className="container mt-4">
            <h3>Person CRUD Demo</h3>

            <PersonForm onCreatePerson={handleCreatePerson} />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <PersonList persons={persons} onDeletePerson={handleDeletePerson} />
            )}
        </div>
    )
}

export default App;
