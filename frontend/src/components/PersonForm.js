import {useState} from "react";

function PersonForm() {
    const [name, setName] = useState("");
    const [hobbies, setHobbies] = useState("");

    const handleSubmit = (e) => {
        alert('Later this will submit: ' + name + ' with hobbies: ' + hobbies);
    };

    return(
        <>
        <input className ="form-control mb-2" placeholder="Person" value={name} onChange={(e) => setName(e.target.value)}/>
        <input className ="form-control mb-2" placeholder="Hobbies (comma separated)" value={hobbies} onChange={(e) => setHobbies(e.target.value)}/>
        <button className="btn btn-primary" onClick={handleSubmit}>Add Person</button>
        </>
    );

}

export default PersonForm;