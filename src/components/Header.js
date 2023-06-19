import React from 'react';
import './HeaderStyle.css';

const Header = () => {
  const handleHeaderClick = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <header className="header" onClick={handleHeaderClick}>
      <h1>Country List</h1>
    </header>
  );
};

export default Header;