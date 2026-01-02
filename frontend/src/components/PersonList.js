import { useState, useEffect, useMemo } from "react";
import { deletePerson, fetchPersons, updatePerson } from "../api";
import { useToast } from "../ToastProvider";
import ConfirmModal from "./ConfirmModal";
import EditPersonModal from "./EditPersonModal";

const OrderOptions = Object.freeze({
    CREATED_DATE: "created",
    MODIFIED_DATE: "modified",
    NAME: "name",
});

const OrderDirections = Object.freeze({
    ASCENDING: "ascending",
    DESCENDING: "descending",
});

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

    // Filtering and sorting related state
    const [orderBy, setOrderBy] = useState(OrderOptions.CREATED_DATE);
    const [orderDirection, setOrderDirection] = useState(OrderDirections.DESCENDING);
    const [nameFilter, setNameFilter] = useState("");
    const [createdBefore, setCreatedBefore] = useState("");
    const [createdAfter, setCreatedAfter] = useState("");

    const sortedPersons = useMemo(() => {
        return getSortedPersons();
    }, [persons.results, orderBy, orderDirection]);

    useEffect(() => {
        loadPersons();
    }, [reloadToken, offset]);

    async function reload() {
        stopEditing();
        stopDeleting();
        loadPersons();
    }

    async function loadPersons() {
        setPersons(await fetchPersons(offset, limit, nameFilter, createdBefore, createdAfter));
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

    function getSortedPersons() {
        const arr = [...persons.results];

        switch (orderBy) {
            case OrderOptions.CREATED_DATE:
                if (orderDirection === OrderDirections.ASCENDING) {
                    arr.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
                }
                else if (orderDirection === OrderDirections.DESCENDING) {
                    arr.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                }
                break;

            case OrderOptions.MODIFIED_DATE:
                if (orderDirection === OrderDirections.ASCENDING) {
                    arr.sort((a, b) => new Date(a.modified_date) - new Date(b.modified_date));
                }
                else if (orderDirection === OrderDirections.DESCENDING) {
                    arr.sort((a, b) => new Date(b.modified_date) - new Date(a.modified_date));
                }
                break;

            case OrderOptions.NAME:
                if (orderDirection === OrderDirections.ASCENDING) {
                    arr.sort((a, b) => a.person_name.localeCompare(b.person_name));
                }
                else if (orderDirection === OrderDirections.DESCENDING) {
                    arr.sort((a, b) => b.person_name.localeCompare(a.person_name));
                }
                break;

            // sanity check (this state should be unreachable)
            // anyways, default to sorting by descending creation date
            default:
                console.error("unreachable state: invalid order direction:", orderBy);
                arr.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                break;
        }

        return arr;
    }

    function toggleOrderDirection() {
        if (orderDirection === OrderDirections.ASCENDING) {
            setOrderDirection(OrderDirections.DESCENDING);
        }
        else {
            setOrderDirection(OrderDirections.ASCENDING);
        }
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

    function clearFilters() {
        setNameFilter("");
        setCreatedBefore("");
        setCreatedAfter("");
    }

    return (
        <div className="mb-4">
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

            {/* Sorting selector */}
            <div className="mb-2 d-flex align-items-center gap-2">
                <span className="fw-bold">Order by:</span>
                <select
                    className="form-select form-select-md w-auto"
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                >
                    <option value={OrderOptions.CREATED_DATE}>Creation date</option>
                    <option value={OrderOptions.MODIFIED_DATE}>Modification date</option>
                    <option value={OrderOptions.NAME}>Name</option>
                </select>

                <button
                    type="button"
                    className="btn btn-md btn-outline-secondary"
                    onClick={() => toggleOrderDirection()}
                    title="Toggle ascending / descending"
                >
                    {orderDirection === OrderDirections.ASCENDING ?
                        <i className="bi bi-arrow-up"></i> :
                        <i className="bi bi-arrow-down"></i>
                    }
                </button>
            </div>

            <div className="mb-2 d-flex align-items-center gap-2">
                {/* Name filter */}
                <div className="form-floating mb-2 flex-grow-1">
                    <input
                        type="text"
                        className="form-control"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <label>Name</label>
                </div>

                {/* Created before */}
                <div className="form-floating mb-2">
                    <input
                        type="date"
                        className="form-control"
                        value={createdBefore}
                        onChange={(e) => setCreatedBefore(e.target.value)}
                    />
                    <label>Created before</label>
                </div>

                {/* Created after */}
                <div className="form-floating mb-2">
                    <input
                        type="date"
                        className="form-control"
                        value={createdAfter}
                        onChange={(e) => setCreatedAfter(e.target.value)}
                    />
                    <label>Created after</label>
                </div>

                {/* Clear filters button */}
                <div className="form-floating mb-2">
                    <button
                        type="button"
                        className="btn btn-lg btn-outline-secondary"
                        onClick={clearFilters}
                        title="Clear Filters"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>

                {/* Reload Persons button */}
                <div className="form-floating mb-2">
                    <button
                        type="button"
                        className="btn btn-lg btn-primary"
                        onClick={reload}
                        title="Reload"
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </div>

            <ul className="list-group mb-3">
                {sortedPersons.map(p => (
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
