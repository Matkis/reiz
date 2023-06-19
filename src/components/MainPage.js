import React, { useEffect, useState } from 'react';
import './MainPageStyle.css';

const MainPage = () => {
  const [countries, setCountries] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v2/all?fields=name,region,area');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('perPage', perPage.toString());
  }, [perPage]);

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const applyFilters = (countries) => {
    let filteredCountries = countries;

    if (filter === 'smallerThanLithuania') {
      const lithuaniaArea = countries.find((country) => country.name === 'Lithuania').area;
      filteredCountries = countries.filter((country) => country.area < lithuaniaArea);
    } else if (filter === 'oceania') {
      filteredCountries = countries.filter((country) => country.region === 'Oceania');
    }

    return filteredCountries;
  };

  const sortCountries = (countries) => {
    const sortedCountries = [...countries];
    sortedCountries.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortedCountries;
  };

  const filteredCountries = applyFilters(countries);
  const sortedCountries = sortCountries(filteredCountries);
  const totalPages = Math.ceil(sortedCountries.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const displayedCountries = sortedCountries.slice(startIndex, endIndex);

  return (
    <div className="country-list-container">
      <h1>Country List</h1>
      <div className="controls-container">
        <label htmlFor="perPage">Countries per page:</label>
        <select id="perPage" value={perPage} onChange={handlePerPageChange}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <button className="sort-button" onClick={handleSortChange}>
          Sort by name
          {sortOrder === 'asc' ? <span>&uarr;</span> : <span>&darr;</span>}
        </button>
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="smallerThanLithuania">Smaller than Lithuania</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>
      <table className="country-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {displayedCountries.map((country, index) => (
            <tr key={index}>
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{country.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} disabled={page === currentPage}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
