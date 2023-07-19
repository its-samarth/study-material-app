import React, { useState, useEffect } from 'react';

const BookList = () => {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/responses');
        if (response.ok) {
          const data = await response.json();
          setResponses(data.responses);
        } else {
          throw new Error('Error fetching responses');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  useEffect(() => {
    const filterAndSortResponses = () => {
      let filteredResponses = [...responses];

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredResponses = filteredResponses.filter(
          (response) =>
            response.title.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      if (sortBy === 'title') {
        filteredResponses.sort((a, b) => a.title.localeCompare(b.title));
      }

      setFilteredResponses(filteredResponses);
    };

    filterAndSortResponses();
  }, [responses, searchTerm, sortBy]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return <p>Loading responses...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="book-list">
      <div className="book-filters">
        <div className="search-bar">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title"
          />
        </div>
        <div className="sort-by">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortBy} onChange={handleSortBy}>
            <option value="">Select</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      {filteredResponses.length === 0 ? (
        <p>No responses available</p>
      ) : (
        <div className="book-grid">
          {filteredResponses.map((response) => (
            <div className="book-item" key={response._id}>
              <h3 className="book-title">{response.title}</h3>
              <p className="book-author">Author: {response.author}</p>
              <p className="book-subject">Subject: {response.subject}</p>
              <a
                href={`http://localhost:8000/api/responses/${response.file}`}
                download={response.title}
                className="download"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
