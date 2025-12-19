import React from 'react';

function PersonSearch({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Pesquisar por nome ou hobbies..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default PersonSearch;
