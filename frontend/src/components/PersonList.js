// This component displays a list of the retrieved persons.
import PersonForm from "./PersonForm";
import PersonEntry from "./PersonEntry";
import EditPersonModal from "./EditPersonModal";

function PersonList({ persons, onDeletePerson, onUpdatePerson, onNextPage, onPreviousPage, hasNext, hasPrevious, ordering, setOrdering, search, setSearch, loading }) {
    if (persons.length === 0) {
        return <p>No persons found.</p>;
    }
    return (
        <>
            <h5>Persons</h5>

            <input className="form-control mb-3" type="text" placeholder="Search person..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className="mb-3">
                <label className="form-label">Order by</label>
                <select
                    className="form-select"
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                >
                    <option value="person_name">Name (A–Z)</option>
                    <option value="-person_name">Name (Z–A)</option>
                    <option value="created_date">Oldest first</option>
                    <option value="-created_date">Newest first</option>
                </select>
            </div>

            {loading && (
                <div className="text-muted small mb-2">
                    Updating results...
                </div>
            )}


            <ul className="list-group mb-3">
                {persons.map((person) => (
                    <PersonEntry key={person.id} person={person} onDeletePerson={onDeletePerson} onUpdatePerson={onUpdatePerson} className="list-group-item d-flex justify-content-between" />
                ))}
            </ul>

            <div className="d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={onPreviousPage} disabled={!hasPrevious}>Previous</button>
                <button className="btn btn-secondary" onClick={onNextPage} disabled={!hasNext}>Next</button>
            </div>
        </>
    );
}

export default PersonList;