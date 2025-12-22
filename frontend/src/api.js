const API_URL = "http://localhost:8001";


// Function to create a new person, sending a POST request to the API.
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

// Function to get a list of people with pagination, ordering, and search capabilities.
export async function getPeople(limit = 10, offset = 0, ordering = "-created_date", search = "") {
    const response = await fetch(`${API_URL}/api/persons/?limit=${limit}&offset=${offset}&ordering=${ordering}&search=${search}`);
    if (!response.ok) {
        throw new Error("Failed to fetch persons");
    }
    return response.json();
}

// Function to delete a person by ID, sending a DELETE request to the API.
export async function deletePerson(person) {
    const response = await fetch(`${API_URL}/api/persons/${person.id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete person");
    }

    return true;
}

// Function to update a person's information by ID, sending a PUT request to the API.
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


// Functions to handle long running async tasks via the API.
export async function startLongTask() {
    const response = await fetch(`${API_URL}/api/long-task/`, { method: "POST" });

    if (!response.ok) {
        throw new Error("Failed to start long task");
    }

    return response.json();
}

// Function to get the status of a long running async task by its ID.
export async function getTaskStatus(taskId) {
    const response = await fetch(
        `${API_URL}/api/long-task/${taskId}/`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch task status");
    }

    return response.json();

}


// Functions to handle experience statistics tasks via the API.
export async function startExperienceStatisticsTask() {
    const response = await fetch(
        `${API_URL}/api/persons/experience-stats/start/`,
        { method: "POST" }
    );
    if (!response.ok) throw new Error("Failed to start task");
    return response.json();
}

// Function to get the latest experience statistics.
export async function getLatestExperienceStatistics() {
    const response = await fetch(
        `${API_URL}/api/persons/experience-stats/latest/`
    );
    if (!response.ok) throw new Error("No statistics available");
    return response.json();
}
