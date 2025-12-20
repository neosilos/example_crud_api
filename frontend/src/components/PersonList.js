import React, { useState } from 'react';
import StatsCharts from './StatsCharts';

function PersonList({ persons, onEdit, onDelete, onRefreshPerson, onPrev, onNext, hasPrev, hasNext }) {
  const [activeChartId, setActiveChartId] = useState(null);

  const toggleChart = (id) => {
    if (activeChartId !== id) {
      const person = persons.find(p => p.id === id);
      if (person && !person.stats && onRefreshPerson) {
        onRefreshPerson(id);
      }
      setActiveChartId(id);
    } else {
      setActiveChartId(null);
    }
  };

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
                className="list-group-item"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <span>
                    <strong>{person.person_name}</strong>
                    <br />
                    <small>Hobbies: {formatHobbies(person.hobbies)}</small>
                    {person.stats && (
                      <div className="mt-1 small">
                        <div className="text-secondary">
                          <strong>Média:</strong> {typeof person.stats.media === 'number' ? person.stats.media.toFixed(2) : (person.stats.media?.media?.toFixed(2) || 'N/A')} |
                          <strong> Variância:</strong> {typeof person.stats.variancia === 'number' ? person.stats.variancia.toFixed(2) : 'N/A'} |
                          <strong> Desvio Padrão:</strong> {typeof person.stats.desvio === 'number' ? person.stats.desvio.toFixed(2) : (person.stats.desvio?.desvio?.toFixed(2) || 'N/A')}
                        </div>
                      </div>
                    )}
                  </span>
                  <span>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => toggleChart(person.id)}
                    >
                      {activeChartId === person.id ? 'Hide Charts' : 'Show Charts'}
                    </button>
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
                </div>
                {activeChartId === person.id && person.stats && (
                  <StatsCharts person={person} />
                )}
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
