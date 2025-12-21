const API_URL = "http://localhost:8001";

export async function createPerson(person) {
  const response = await fetch(`${API_URL}/api/persons/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  if (!response.ok) {
    throw new Error("Failed to create person");
  }

  return response.json();
}

export async function getPeople(limit = 10, offset = 0) {
    const response = await fetch(`${API_URL}/api/persons/?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
        throw new Error("Failed to fetch persons");
    }
    return response.json();
}

export async function deletePerson(person){
    const response = await fetch(`${API_URL}/api/persons/${person.id}`, {
        method: "DELETE",
    });
    if (!response.ok){
        throw new Error("Failed to delete person");
    }
  
    return true;
}

export async function updatePerson(id, payload) {
    const response = await fetch(
        `http://localhost:8001/api/persons/${id}/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update person");
    }

    return response.json();
}
