// This component is a form to create and add a new person.
import {useState} from "react";

function PersonForm({ onCreatePerson }) {
    const [person_name, setPersonName] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        try{
            await onCreatePerson({
                person_name, hobbies: hobbies.split(",").map(hobby => hobby.trim())
            })
            setPersonName("");
            setHobbies("");
        } catch (err) {
            alert("Error creating new person");
            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    return(
        <>
        <input className ="form-control mb-2" placeholder="Person" value={person_name} onChange={(e) => setPersonName(e.target.value)}/>
        <input className ="form-control mb-2" placeholder="Hobbies (comma separated)" value={hobbies} onChange={(e) => setHobbies(e.target.value)}/>
        <button className="btn btn-primary mb-4" onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        </>
    );

}

export default PersonForm;