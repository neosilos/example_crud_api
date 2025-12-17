import React, { useEffect, useState } from "react";
import { fetchPersons, updatePerson, deletePerson } from "../api";

export default function PersonList() {
  const [data, setData] = useState({ results: [], count: 0 });
  const [offset, setOffset] = useState(0);
  const limit = 10;

  async function load() {
    setData(await fetchPersons(limit, offset));
  }

  useEffect(() => {
    load();
  }, [offset]);

  async function handleUpdate(person) {
    const name = prompt("New name:", person.person_name);
    if (!name) return;

    await updatePerson(person.id, { person_name: name });
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this person?")) return;
    await deletePerson(id);
    load();
  }

  return (
    <>
      <h5>Persons</h5>

      <ul className="list-group mb-3">
        {data.results.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between">
            <span>
              <strong>{p.person_name}</strong>
              <br />
              <small>{JSON.stringify(p.hobbies)}</small>
            </span>
            <span>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => handleUpdate(p)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={offset === 0}
          onClick={() => setOffset(offset - limit)}
        >
          Prev
        </button>
        <button
          className="btn btn-secondary"
          disabled={offset + limit >= data.count}
          onClick={() => setOffset(offset + limit)}
        >
          Next
        </button>
      </div>
    </>
  );
}
