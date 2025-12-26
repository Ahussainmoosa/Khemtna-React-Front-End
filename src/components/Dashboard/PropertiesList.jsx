// src/components/Properties/PropertiesList.jsx
import { useEffect, useState } from 'react';
import { PropertiesService } from '../../services/propertiesService';
import PropertyCard from './PropertyCard';
import './Properties.css';

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: '', order: 'asc' });

  useEffect(() => {
    const load = async () => {
      const data = await PropertiesService.getAllProperties();
      setProperties(Array.isArray(data) ? data : data.data);
    };
    load();
  }, []);

  const toggleSort = (field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filtered = properties
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sort.field) return 0;
      const valA = sort.field === 'price'
        ? a.price.weekday
        : a.rating || 0;
      const valB = sort.field === 'price'
        ? b.price.weekday
        : b.rating || 0;
      return sort.order === 'asc' ? valA - valB : valB - valA;
    });

  return (
    <main className="properties-page">
      <div className="top-bar">
        <span className="filter-icon">☰</span>

        <input
          className="search-input"
          placeholder="Search property name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => toggleSort('price')}>
          Price {sort.field === 'price' ? (sort.order === 'asc' ? '↑' : '↓') : ''}
        </button>

        <button onClick={() => toggleSort('rating')}>
          Rating {sort.field === 'rating' ? (sort.order === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      <div className="properties-list">
        {filtered.map(property => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </main>
  );
};

export default PropertiesList;
