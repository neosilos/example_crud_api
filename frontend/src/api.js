const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

export async function fetchPersons(limit = 10, offset = 0) {
  const res = await fetch(
    `${API_BASE_URL}/persons/?limit=${limit}&offset=${offset}`
  );
  return res.json();
}

export async function createPerson(data) {
  const res = await fetch(`${API_BASE_URL}/persons/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePerson(id, data) {
  const res = await fetch(`${API_BASE_URL}/persons/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePerson(id) {
  return fetch(`${API_BASE_URL}/persons/${id}/`, {
    method: "DELETE",
  });
}

export async function startLongTask() {
  const res = await fetch(`${API_BASE_URL}/long-task/`, {
    method: "POST",
  });
  return res.json();
}

export async function pollTask(taskId) {
  const res = await fetch(
    `${API_BASE_URL}/long-task/${taskId}/`
  );
  return res.json();
}
