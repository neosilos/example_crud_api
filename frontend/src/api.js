const API_URL = process.env.REACT_APP_API_BASE_URL;
if (!API_URL) {
    console.warn("Failed to load API URL from environment variables");
}

/**
 * @typedef {Object} Person
 * @property {number} id
 * @property {string} person_name
 * @property {string[]} hobbies
 * @property {Date} created_date
 * @property {Date} modified_date
 **/

/**
 * Get people with pagination
 *
 * @param {number} offset - Pagination offset
 * @param {number} limit - Pagination entry limit
 * @returns {Promise<Object>}
 */
export async function fetchPersons(offset, limit) {
    try {
        const res = await fetch(`${API_URL}/persons/?offset=${offset}&limit=${limit}`);
        const json = await res.json();
        return json;
    }
    catch (e) {
        failRequest();
        return undefined;
    }
}

/**
 * Create new person 
 *
 * @param {string} name 
 * @param {string[]} hobbies 
 * @returns {Promise<Person>}
 */
export async function createPerson(name, hobbies) {
    const person = {
        person_name: name,
        hobbies,
    };

    try {
        const res = await fetch(`${API_URL}/persons/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(person),
        });

        return await res.json();
    }
    catch(e) {
        failRequest();
        return undefined;
    }
}

/**
 * Update person properties by id
 *
 * @param {number} id
 * @param {Object} patch - Contains the fields that should be changed 
 * @returns {Promise<Person>}
 */
export async function updatePerson(id, patch) {
    try {
        const res = await fetch(`${API_URL}/persons/${id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        });

        return await res.json();
    }
    catch (e) {
        failRequest();
        return undefined;
    }
}

/**
 * Delete Person by id 
 *
 * @param {number} id
 */
export async function deletePerson(id) {
    try {
        await fetch(`${API_URL}/persons/${id}/`, { method: "DELETE" });
    }
    catch (e) {
        failRequest();
    }
}

/**
 * @typedef {Object} Task
 * @property {string} task_id
 * @property {string} state
 **/

/**
 * Start long async task
 *
 * @returns {Promise<Task>}
 */
export async function startAsyncTask() {
    try {
        const res = await fetch(`${API_URL}/long-task/`, { method: "POST" });
        return await res.json();
    }
    catch (e) {
        failRequest();
    }
}

/**
 * Poll for task status by task uuid
 *
 * @param {string} taskId
 * @returns {Promise<Task>}
 */
export async function pollAsyncTask(taskId) {
    try {
        const res = await fetch(`${API_URL}/long-task/${taskId}/`);
        return await res.json();
    }
    catch (e) {
        failRequest();
    }
}

function failRequest() {
    console.error("request failed due to error:", e);
}
