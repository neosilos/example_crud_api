import React from 'react';

function PersonFilter({ sortBy, sortOrder, onSortChange, onSortOrderToggle }) {
  const handleSortByChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="mb-3 d-flex align-items-center gap-2">
      <label htmlFor="sort-by" className="form-label mb-0">
        Ordenar por:
      </label>
      <select
        id="sort-by"
        className="form-select"
        style={{ width: 'auto' }}
        value={sortBy}
        onChange={handleSortByChange}
      >
        <option value="name">Nome</option>
        <option value="hobbies">Hobbies</option>
      </select>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onSortOrderToggle}
        title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}

export default PersonFilter;
