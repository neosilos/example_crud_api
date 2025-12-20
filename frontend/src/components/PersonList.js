import React from 'react';

function PersonList({ persons, onEdit, onDelete, onPrev, onNext, hasPrev, hasNext }) {
  const formatHobbies = (hobbies) => {
    if (Array.isArray(hobbies)) {
      return JSON.stringify(hobbies);
    }
    return String(hobbies);
  };

  return (
    <div>
      <h5>Persons</h5>
      {persons.length === 0 ? (
        <p className="text-muted">No persons found.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {persons.map((person) => (
              <li
                key={person.id}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  <strong>{person.person_name}</strong>
                  <br />
                  <small>Hobbies: {formatHobbies(person.hobbies)}</small>
                  {person.stats && (
                    <div className="mt-1 small">
                      {person.stats.media && (
                        <div className="text-secondary">
                          <strong>Média (Input):</strong> {person.stats.media.media?.toFixed(2)} |
                          Var: {person.stats.media.variancia?.toFixed(2)} |
                          Desv: {person.stats.media.desvio?.toFixed(2)}
                        </div>
                      )}
                      {person.stats.desvio && (
                        <div className="text-secondary">
                          <strong>Desvio (Input):</strong> {person.stats.desvio.media?.toFixed(2)} |
                          Var: {person.stats.desvio.variancia?.toFixed(2)} |
                          Desv: {person.stats.desvio.desvio?.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                </span>
                <span>
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => onEdit(person)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(person.id)}
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
              disabled={!hasPrev}
              onClick={onPrev}
            >
              Prev
            </button>
            <button
              className="btn btn-secondary"
              disabled={!hasNext}
              onClick={onNext}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PersonList;
