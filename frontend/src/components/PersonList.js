// This component displays a list of the retrieved persons.
import PersonForm from "./PersonForm";
import PersonEntry from "./PersonEntry";
import EditPersonModal from "./EditPersonModal";

function PersonList({persons, onDeletePerson, onUpdatePerson, onNextPage, onPreviousPage, hasNext, hasPrevious}) {
    if(persons.length === 0){
        return <p>No persons found.</p>;
    }
    return(
        <>
        <h5>Persons</h5>
        
        <ul className="list-group mb-3">
            {persons.map((person) => (
                <PersonEntry key={person.id} person={person} onDeletePerson={onDeletePerson} onUpdatePerson={onUpdatePerson} className="list-group-item d-flex justify-content-between"/>
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