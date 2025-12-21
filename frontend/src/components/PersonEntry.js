// This component represents a person entry on the list.

function PersonEntry({ person, onDeletePerson, onUpdatePerson }) {
    console.log("PersonEntry render:", person);
    return (
        <li className="list-group-item d-flex justify-content-between">
            <span>
                <strong>{person.person_name}</strong>
                <br /> 
                <small>Hobbies: {person.hobbies.join(", ")}</small>
            </span>
            <span>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onUpdatePerson(person)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDeletePerson(person.id)}>Delete</button>
            </span>
        </li>
    );
}

export default PersonEntry;