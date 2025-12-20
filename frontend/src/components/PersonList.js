import PersonForm from "./PersonForm";
import PersonEntry from "./PersonEntry";

function PersonList({persons}){
    return(
        <>
        <h5>Persons</h5>
        
        <ul className="list-group mb-3">
            {persons.map((person) => (
                <PersonEntry key={person.id} person={person} />
            ))}
        </ul>

        <div className="d-flex justify-content-between">
            <button className="btn btn-secondary">Previous</button>
            <button className="btn btn-secondary">Next</button>
        </div>
        </>
    );
}

export default PersonList;