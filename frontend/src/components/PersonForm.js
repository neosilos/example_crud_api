import { useState } from "react";
import { createPerson } from "../api";

/**
 * Form containing input for person creation.
 *
 * @param {function} onPersonCreated - callback that triggers update
 *     on person dependent components
 */
export default function PersonForm({ onPersonCreated }) {
    const [name, setName] = useState("");
    const [hobbies, setHobbies] = useState("");

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeHobbies(e) {
        setHobbies(e.target.value);
    }

    function handleCreate(e) {
        e.preventDefault();

        // reject empty fields
        if (name === "" || hobbies === "") {
            return;
        }

        const hobbiesArray = hobbies.split(",");

        const person = createPerson(name, hobbiesArray);
        console.log("person created:", person);

        setName("");
        setHobbies("");

        // trigger reload outside this component
        onPersonCreated();
    }

    return (
        <form onSubmit={handleCreate}>
            <h5>Create Person</h5>
            <input
                name="name"
                value={name}
                onChange={handleChangeName}
                className="form-control mb-2"
                placeholder="Person name"
            />
            <input
                name="hobbies"
                value={hobbies}
                onChange={handleChangeHobbies}
                className="form-control mb-2"
                placeholder="Hobbies (comma separated)"
            />
            <button className="btn btn-primary mb-4">Create</button>
        </form>
    );
}
