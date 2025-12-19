import React, { useState, useEffect } from 'react';

function PersonForm({ person, onSubmit, onCancel }) {
  const getInitialName = () => person?.person_name || '';
  const getInitialHobbies = () => {
    if (!person?.hobbies) return '';
    const hobbiesArray = Array.isArray(person.hobbies) 
      ? person.hobbies 
      : [person.hobbies];
    return hobbiesArray.join(', ');
  };

  const [personName, setPersonName] = useState(getInitialName);
  const [hobbies, setHobbies] = useState(getInitialHobbies);
  const [error, setError] = useState('');

  useEffect(() => {
    if (person) {
      setPersonName(person.person_name || '');
      const hobbiesArray = Array.isArray(person.hobbies) 
        ? person.hobbies 
        : (person.hobbies ? [person.hobbies] : []);
      setHobbies(hobbiesArray.join(', '));
    } else {
      setPersonName('');
      setHobbies('');
    }
    setError('');
  }, [person]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!personName.trim()) {
      setError('Person name is required');
      return;
    }

    const hobbiesArray = hobbies
      .split(',')
      .map((hobby) => hobby.trim())
      .filter((hobby) => hobby.length > 0);

    try {
      await onSubmit({
        person_name: personName.trim(),
        hobbies: hobbiesArray,
      });

      setPersonName('');
      setHobbies('');
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h5>{person ? 'Edit Person' : 'Create Person'}</h5>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Person name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Hobbies (comma separated)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
        />
        {error && <div className="text-danger mb-2">{error}</div>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {person ? 'Update' : 'Create'}
          </button>
          {person && onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PersonForm;
