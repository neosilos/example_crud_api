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

export async function getPeople(){
    const response = await fetch(`${API_URL}/api/persons/`);
    if (!response.ok) {
        throw new Error("Failed to fetch persons");
    }
    return response.json();
}