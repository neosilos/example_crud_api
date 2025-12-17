import React, { useState } from "react";
import { createPerson } from "../api";

export default function PersonForm({ onCreated }) {
  const [name, setName] = useState("");
  const [hobbies, setHobbies] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      person_name: name,
      hobbies: hobbies.split(",").map(h => h.trim()),
    };

    await createPerson(payload);
    setName("");
    setHobbies("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>Create Person</h5>

      <input
        className="form-control mb-2"
        placeholder="Person name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <input
        className="form-control mb-2"
        placeholder="Hobbies (comma separated)"
        value={hobbies}
        onChange={e => setHobbies(e.target.value)}
      />

      <button className="btn btn-primary">Create</button>
    </form>
  );
}
