import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import EditPersonModal from "./components/EditPersonModal";
import LongTaskPanel from "./components/LongTaskPanel";
import ExperienceStatsPanel from "./components/ExperienceStatsPanel";
import { createPerson, deletePerson, getPeople, updatePerson } from "./api";

function App() {
    const [persons, setPersons] = useState([]); // List of persons
    const [loading, setLoading] = useState(false);  // Loading state
    const [updatingPerson, setUpdatingPerson] = useState(null); // Person being updated
    const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
    const [next, setNext] = useState(null);  // Next page
    const [previous, setPrevious] = useState(null);  // Previous page 
    const [count, setCount] = useState(0);  // Total count of persons
    const [limit] = useState(10);  // Items per page
    const [offset, setOffset] = useState(0); // Current offset for pagination
    const [ordering, setOrdering] = useState("-created_date"); // Ordering criteria
    const [search, setSearch] = useState(""); // Search query


    // Function to load people from the API with current pagination, ordering, and search
    const loadPeople = async () => {
        setLoading(true);
        try {
            const data = await getPeople(limit, offset, ordering, search);
            setPersons(data.results);
            setNext(data.next);
            setPrevious(data.previous);
            setCount(data.count);
        } catch (err) {
            alert("Error fetching people data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Creates a timeout to avoid excessive API calls 
    useEffect(() => {
        const timeout = setTimeout(() => {
            loadPeople();
        }, 400);

        return () => clearTimeout(timeout);
    }, [limit, offset, ordering, search]);
    const handleCreatePerson = async (person_data) => {
        const newPerson = await createPerson(person_data);
        setPersons((prevPersons) => [...prevPersons, newPerson]);
    }

    
    // Deletes a person by ID
    const handleDeletePerson = async (person_id) => {

        if (!window.confirm("Are you sure you want to delete this person?")) {
            return;
        }

        try {
            await deletePerson({ id: person_id });
            setPersons((prevPersons) => prevPersons.filter((p) => p.id !== person_id));
        } catch (err) {
            console.error(err);
            alert("Error deleting person");
        }
    }

    // Opens the edit modal with the selected person's data
    const handleEditClick = (person_data) => {
        setUpdatingPerson(person_data);
        setShowEditModal(true);
    };

    // Closes the edit modal
    const handleCloseModal = () => {
        setShowEditModal(false);
        setUpdatingPerson(null);
    };

    // Updates a person's data
    const handleUpdatePerson = (person_data) => {
        handleEditClick(person_data);
    }

    // Saves the updated person data
    const handleSavePerson = async (id, payload) => {
        try {
            const updated = await updatePerson(id, payload);

            setPersons(prev =>
                prev.map(p => (p.id === id ? updated : p))
            );
        } catch (err) {
            console.error(err);
            alert("Error updating person");
            throw err;
        }
    };

    // Handles pagination - next page
    const handleNextPage = () => {
        if (next) {
            setOffset(offset + limit);
        }
    }

    // Handles pagination - previous page
    const handlePreviousPage = () => {
        if (previous) {
            setOffset(Math.max(0, offset - limit));
        }
    }

    return (
        <div className="container mt-4">
            <h3>Person CRUD Demo</h3>

            <PersonForm onCreatePerson={handleCreatePerson} />
            
            <PersonList persons={persons} onDeletePerson={handleDeletePerson} onUpdatePerson={handleUpdatePerson}
                onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} hasNext={!!next} hasPrevious={!!previous}
                ordering={ordering} setOrdering={setOrdering} search={search} setSearch={setSearch}
                loading={loading} setLoading={setLoading}
            />

            <EditPersonModal
                show={showEditModal}

                person_data={updatingPerson}
                onClose={handleCloseModal}
                onSave={handleSavePerson}
            />
            <LongTaskPanel />
            
            <ExperienceStatsPanel />

        </div>
    )
}

export default App;
