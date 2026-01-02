import { useState, useEffect } from "react";
import { fetchPersons } from "../api";

/**
 * List of people
 * 
 * @param {number} reloadToken - token used to trigger a list reload on change
 */
export default function PersonList({ reloadToken }) {
    const [persons, setPersons] = useState({ results: [], count: 0 });
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(8);

    useEffect(() => {
        loadPersons();
    }, [reloadToken, offset]);

    async function loadPersons() {
        setPersons(await fetchPersons(offset, limit));
    }

    function handlePrev() {
        if (offset < limit) {
            setOffset(0);
        }
        setOffset((o) => o - limit);
    }

    function handleNext() {
        setOffset((o) => o + limit);
    }

    return (
        <div>
            <h5>Persons</h5>
            <ul className="list-group mb-3">
                {persons.results.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between">
                        <span>
                            <strong>{p.person_name}</strong>
                            <br />
                            <small>{p.hobbies.join(",")}</small>
                        </span>
                        <span>
                            <button className="btn btn-sm btn-outline-secondary me-2">
                                Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                                Delete
                            </button>
                        </span>
                    </li>

                ))}
            </ul>
            <div className="d-flex justify-content-between">
                <button
                    onClick={handlePrev}
                    className="btn btn-secondary"
                    disabled={offset === 0}
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="btn btn-secondary"
                    disabled={ offset + limit >= persons.count }
                >
                    Next
                </button>
            </div>
        </div>
    );
}
