import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import EditPersonModal from "./components/EditPersonModal";
import LongTaskPanel from "./components/LongTaskPanel";
import { createPerson, deletePerson, getPeople, updatePerson } from "./api";

function App() {
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingPerson, setUpdatingPerson] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [count, setCount] = useState(0);
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [ordering, setOrdering] = useState("person_name");
    const [search, setSearch] = useState("");



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

    const handleEditClick = (person_data) => {
        setUpdatingPerson(person_data);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setUpdatingPerson(null);
    };

    const handleUpdatePerson = (person_data) => {
        handleEditClick(person_data);
    }

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

    const handleNextPage = () => {
        if (next) {
            setOffset(offset + limit);
        }
    }

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


        </div>
    )
}

export default App;
