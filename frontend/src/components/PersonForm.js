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
  const [mediaRaw, setMediaRaw] = useState('');
  const [varianciaRaw, setVarianciaRaw] = useState('');
  const [desvioRaw, setDesvioRaw] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (person) {
      setPersonName(person.person_name || '');
      const hobbiesArray = Array.isArray(person.hobbies)
        ? person.hobbies
        : (person.hobbies ? [person.hobbies] : []);
      setHobbies(hobbiesArray.join(', '));
      setMediaRaw(person.media_raw || '');
      setVarianciaRaw(person.variancia_raw || '');
      setDesvioRaw(person.desvio_raw || '');
    } else {
      setPersonName('');
      setHobbies('');
      setMediaRaw('');
      setVarianciaRaw('');
      setDesvioRaw('');
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
        media_raw: mediaRaw,
        variancia_raw: varianciaRaw,
        desvio_raw: desvioRaw,
      });

      setPersonName('');
      setHobbies('');
      setMediaRaw('');
      setVarianciaRaw('');
      setDesvioRaw('');
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h5>{person ? 'Editar Pessoa' : 'Criar Pessoa'}</h5>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Nome da pessoa"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Hobbies (separados por vírgula)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Média (números separados por vírgula)"
          value={mediaRaw}
          onChange={(e) => setMediaRaw(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Variância (números separados por vírgula)"
          value={varianciaRaw}
          onChange={(e) => setVarianciaRaw(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Desvio Padrão (números separados por vírgula)"
          value={desvioRaw}
          onChange={(e) => setDesvioRaw(e.target.value)}
        />
        {error && <div className="text-danger mb-2">{error}</div>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {person ? 'Atualizar' : 'Criar'}
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
