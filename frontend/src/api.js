const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

/**
 * Busca lista de pessoas com paginação
 * @param {number} limit - Número máximo de resultados por página
 * @param {number} offset - Número de resultados a pular
 * @returns {Promise<Object>} Objeto com results, next e previous
 */
export const getPersons = async (limit = 10, offset = 0) => {
  const response = await fetch(`${API_BASE_URL}/persons/?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch persons');
  }
  return response.json();
};

/**
 * Busca uma pessoa específica pelo ID
 * @param {number} id - ID da pessoa
 * @returns {Promise<Object>} Objeto da pessoa
 */
export const getPerson = async (id) => {
  const response = await fetch(`${API_BASE_URL}/persons/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch person');
  }
  return response.json();
};

/**
 * Cria uma nova pessoa
 * @param {Object} personData - Dados da pessoa (person_name, hobbies)
 * @returns {Promise<Object>} Objeto da pessoa criada
 */
export const createPerson = async (personData) => {
  const response = await fetch(`${API_BASE_URL}/persons/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create person');
  }
  return response.json();
};

/**
 * Atualiza uma pessoa existente
 * @param {number} id - ID da pessoa
 * @param {Object} personData - Dados da pessoa a atualizar
 * @returns {Promise<Object>} Objeto da pessoa atualizada
 */
export const updatePerson = async (id, personData) => {
  const response = await fetch(`${API_BASE_URL}/persons/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update person');
  }
  return response.json();
};

/**
 * Remove uma pessoa
 * @param {number} id - ID da pessoa
 * @returns {Promise<boolean>} true se removido com sucesso
 */
export const deletePerson = async (id) => {
  const response = await fetch(`${API_BASE_URL}/persons/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete person');
  }
  return true;
};

/**
 * Inicia uma tarefa assíncrona longa
 * @returns {Promise<Object>} Objeto com task_id e status
 */
export const startLongTask = async () => {
  const response = await fetch(`${API_BASE_URL}/long-task/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to start long task');
  }
  return response.json();
};

/**
 * Consulta o status de uma tarefa assíncrona
 * @param {string} taskId - ID da tarefa (UUID)
 * @returns {Promise<Object>} Objeto com task_id, state e result
 */
export const getLongTaskStatus = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/long-task/${taskId}/`);
  if (!response.ok) {
    throw new Error('Failed to get task status');
  }
  return response.json();
};
