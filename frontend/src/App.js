import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import PersonFilter from './components/PersonFilter';
import PersonSearch from './components/PersonSearch';
import LongTaskPanel from './components/LongTaskPanel';
import {
  getPersons,
  createPerson,
  updatePerson,
  deletePerson,
} from './api';

const PAGE_SIZE = 10;

function App() {
  const [persons, setPersons] = useState([]);
  const [editingPerson, setEditingPerson] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPersons = async () => {
    setLoading(true);
    try {
      const response = await getPersons(PAGE_SIZE, offset);
      setPersons(response.results || []);
      setHasNext(!!response.next);
      setHasPrev(!!response.previous);
    } catch (error) {
      console.error('Error fetching persons:', error);
      alert('Failed to fetch persons: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, [offset]);

  const handleSubmitPerson = async (personData) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, personData);
      } else {
        await createPerson(personData);
      }
      setEditingPerson(null);
      fetchPersons();
    } catch (error) {
      console.error('Error saving person:', error);
      throw error;
    }
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
  };

  const handleDeletePerson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) {
      return;
    }

    try {
      await deletePerson(id);
      fetchPersons();
    } catch (error) {
      console.error('Error deleting person:', error);
      alert('Failed to delete person: ' + error.message);
    }
  };

  const handleRefreshPerson = async (id) => {
    try {
      const personData = await import('./api').then(module => module.getPerson(id));

      setPersons(prevPersons =>
        prevPersons.map(p => p.id === id ? personData : p)
      );
    } catch (error) {
      console.error('Error refreshing person:', error);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      setOffset(Math.max(0, offset - PAGE_SIZE));
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setOffset(offset + PAGE_SIZE);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const filteredAndSortedPersons = useMemo(() => {
    let filtered = persons;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = persons.filter((person) => {
        const nameMatch = person.person_name?.toLowerCase().includes(searchLower);

        const hobbiesArray = Array.isArray(person.hobbies)
          ? person.hobbies
          : (person.hobbies ? [person.hobbies] : []);
        const hobbiesString = hobbiesArray.join(' ').toLowerCase();
        const hobbiesMatch = hobbiesString.includes(searchLower);

        return nameMatch || hobbiesMatch;
      });
    }

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === 'name') {
        aValue = a.person_name || '';
        bValue = b.person_name || '';
      } else if (sortBy === 'hobbies') {
        const aHobbies = Array.isArray(a.hobbies) ? a.hobbies : (a.hobbies ? [a.hobbies] : []);
        const bHobbies = Array.isArray(b.hobbies) ? b.hobbies : (b.hobbies ? [b.hobbies] : []);
        aValue = aHobbies.join(' ').toLowerCase();
        bValue = bHobbies.join(' ').toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [persons, searchTerm, sortBy, sortOrder]);

  return (
    <div className="container mt-4">
      <h3>Person CRUD Demo</h3>

      <div className="mb-4">
        <PersonForm
          key={editingPerson?.id || 'new'}
          person={editingPerson}
          onSubmit={handleSubmitPerson}
          onCancel={editingPerson ? handleCancelEdit : null}
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="mb-4">
          <PersonSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
          <PersonFilter
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onSortOrderToggle={handleSortOrderToggle}
          />
          <PersonList
            persons={filteredAndSortedPersons}
            onEdit={handleEditPerson}
            onDelete={handleDeletePerson}
            onRefreshPerson={handleRefreshPerson}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        </div>
      )}

      <div className="mt-4">
        <LongTaskPanel />
      </div>
    </div>
  );
}

export default App;
