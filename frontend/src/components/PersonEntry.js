// This component represents a person entry on the list.

function PersonEntry({ person }) {
    return (
        <li className="list-group-item d-flex justify-content-between">
            <span>
                <strong>{person.person_name}</strong>
                <br />
                <small>Hobbies: {person.hobbies.join(", ")}</small>
            </span>
            <span>
                <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                <button className="btn btn-sm btn-outline-danger">Delete</button>
            </span>
        </li>
    );
}

export default PersonEntry;