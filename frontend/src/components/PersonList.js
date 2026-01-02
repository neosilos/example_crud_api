import { useState, useEffect } from "react";
import { deletePerson, fetchPersons, updatePerson } from "../api";
import { useToast } from "../ToastProvider";
import ConfirmModal from "./ConfirmModal";
import EditPersonModal from "./EditPersonModal";

/**
 * List of people
 * 
 * @param {number} reloadToken - token used to trigger a list reload on change
 */
export default function PersonList({ reloadToken }) {
    const notify = useToast();
    const [persons, setPersons] = useState({ results: [], count: 0 });
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(8);
    const [editingPerson, setEditingPerson] = useState(null);
    const [deletingPerson, setDeletingPerson] = useState(null);

    useEffect(() => {
        loadPersons();
    }, [reloadToken, offset]);

    async function reload() {
        stopEditing();
        stopDeleting();
        loadPersons();
    }

    async function loadPersons() {
        setPersons(await fetchPersons(offset, limit));
    }

    function handlePrev() {
        if (offset < limit) {
            setOffset(0);
        }
        setOffset((o) => o - limit);
    }

    function handleNext() {
        setOffset((o) => o + limit);
    }

    async function handleEdit(edited) {
        // No changes, so just ignore edit
        if (editingPerson.person_name === edited.person_name &&
            editingPerson.hobbies === edited.hobbies) {
            stopEditing();
            return;
        }

        // person field validation
        if (edited.person_name === "") {
            notify("Person name must not be empty.", "danger");
            stopEditing();
            return;
        }
        if (edited.hobbies === "") {
            notify("Add at least one hobby.", "danger");
            stopEditing();
            return;
        }

        const hobbiesArray = edited.hobbies.split(",");
        await updatePerson(editingPerson.id, {
            person_name: edited.person_name,
            hobbies: hobbiesArray,
        });

        notify("Person edited.", "info");
        reload();
    }

    function startEditing(person) {
        setEditingPerson({
            ...person,
            person_name: person.person_name,
            hobbies: person.hobbies.join(","),
        });
    }

    function stopEditing() {
        setEditingPerson(null);
    }

    async function handleDelete() {
        // sanity check (this state should be unreachable)
        if (!deletingPerson) {
            console.error("Invalid state on PersonList: deleting null person");
            return;
        }

        await deletePerson(deletingPerson.id);

        notify("Person deleted.", "danger");
        reload();
    }

    function startDeleting(person) {
        setDeletingPerson(person);
    }

    function stopDeleting() {
        setDeletingPerson(null);
    }

    return (
        <div>
            {/* Modal for editing a specific person */}
            {editingPerson && (
                <EditPersonModal
                    person={editingPerson}
                    onClose={stopEditing}
                    onSave={handleEdit}
                />
            )}

            {/* Modal for confirming person deletion */}
            {deletingPerson && (
                <ConfirmModal
                    title="Delete person"
                    message={`Are you sure you want to delete ${deletingPerson.person_name}?`}
                    confirmText="Delete"
                    onConfirm={handleDelete}
                    onCancel={stopDeleting}
                />
            )}

            <h5>Persons</h5>
            <ul className="list-group mb-3">
                {persons.results.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between">
                        <span>
                            <strong>{p.person_name}</strong>
                            <br />
                            <small>{p.hobbies.join(",")}</small>
                        </span>
                        <span>
                            <button
                                onClick={ () => startEditing(p) }
                                className="btn btn-sm btn-outline-secondary me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={ () => startDeleting(p) }
                                className="btn btn-sm btn-outline-danger"
                            >
                                Delete
                            </button>
                        </span>
                    </li>

                ))}
            </ul>
            <div className="d-flex justify-content-between">
                <button
                    onClick={handlePrev}
                    className="btn btn-secondary"
                    disabled={offset === 0}
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="btn btn-secondary"
                    disabled={ offset + limit >= persons.count }
                >
                    Next
                </button>
            </div>
        </div>
    );
}
