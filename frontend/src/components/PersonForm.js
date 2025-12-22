// This component is a form to create and add a new person.
import {useEffect, useState} from "react";

function PersonForm({ onCreatePerson, updatingPerson, onUpdatePerson }) {
    const [person_name, setPersonName] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [loading, setLoading] = useState(false);
    const [years_of_experience, setYearsOfExperience] = useState(0);

    useEffect(() => {
        if (updatingPerson) {
            setPersonName(updatingPerson.person_name);
            setHobbies(updatingPerson.hobbies.join(", "));
            setYearsOfExperience(updatingPerson.years_of_experience);
        }
    }, [updatingPerson]);
    
    const handleSubmit = async () => {
        setLoading(true);

        try{
            await onCreatePerson({
                person_name, hobbies: hobbies.split(",").map(hobby => hobby.trim()), years_of_experience
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
        <input className ="form-control mb-2" type="number" placeholder="Years of Experience" value={years_of_experience} onChange={(e) => setYearsOfExperience(parseInt(e.target.value))}/>
        <button className="btn btn-primary mb-4" onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        </>
    );

}

export default PersonForm;