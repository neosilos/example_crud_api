import { useState } from "react";
import { createPerson } from "../api";
import { useToast } from "../ToastProvider";

/**
 * Form containing input for person creation.
 *
 * @param {function} onPersonCreated - callback that triggers update
 *     on person dependent components
 */
export default function PersonForm({ onPersonCreated }) {
    const notify = useToast();
    const [name, setName] = useState("");
    const [hobbies, setHobbies] = useState("");
    const [rating, setRating] = useState("");

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeHobbies(e) {
        setHobbies(e.target.value);
    }

    function handleChangeRating(e) {
        setRating(e.target.value);
    }

    function handleCreate(e) {
        e.preventDefault();

        const ratingNumber = parseInt(rating, 10);

        // reject empty fields
        if (name === "") {
            notify("Person name must not be empty.", "danger");
            return;
        }
        else if (hobbies === "") {
            notify("Add at least one hobby.", "danger");
            return;
        }
        else if (!ratingNumber) {
            notify("Invalid rating value.", "danger");
            return;
        }

        const hobbiesArray = hobbies.split(",");

        const person = createPerson(name, hobbiesArray, ratingNumber);
        console.log("person created:", person);

        setName("");
        setHobbies("");
        setRating("");

        notify("Person created.", "success");
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
            <div className="d-flex">
                <input
                    name="hobbies"
                    value={hobbies}
                    onChange={handleChangeHobbies}
                    className="form-control mb-2 me-2"
                    placeholder="Hobbies (comma separated)"
                />
                <input
                    name="rating"
                    type="number"
                    default={800}
                    min={1}
                    value={rating}
                    onChange={handleChangeRating}
                    className="form-control mb-2"
                    placeholder="Rating"
                />
            </div>
            <button className="btn btn-primary mb-4">Create</button>
        </form>
    );
}
