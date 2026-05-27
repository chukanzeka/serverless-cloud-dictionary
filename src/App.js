import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const apiUrl = 'https://wfx07f6ujb.execute-api.us-east-1.amazonaws.com/dev';

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);

    const url = `${apiUrl}/get-definition?term=${encodeURIComponent(searchTerm)}`;

    axios
      .get(url)
      .then(response => {
        setResult(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('No definition found. Try another term.');
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setSearchTerm('');
    setResult(null);
    setError(null);
    setSearched(false);
  };

  return (
    <div className="app">
      <div className="background-grid" />

      <main className="container">
        <header className="header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="#1a6ef5"/>
              <path d="M10 26c0-3.3 2.7-6 6-6h1.5c.3-2.5 2.4-4.5 5-4.5 2.3 0 4.2 1.5 4.8 3.5H28c2.2 0 4 1.8 4 4s-1.8 4-4 4H16c-3.3 0-6-2.7-6-6z" fill="white" opacity="0.9"/>
              <path d="M8 27.5c0-2.5 2-4.5 4.5-4.5h.8c.2-1.8 1.8-3.2 3.7-3.2 1.7 0 3.1 1.1 3.6 2.7h.9c1.7 0 3 1.3 3 3s-1.3 3-3 3H12.5C9.97 29 8 28 8 27.5z" fill="white" opacity="0.4"/>
            </svg>
            <span className="logo-text">CloudDict</span>
          </div>
          <p className="tagline">Instant definitions for every cloud term</p>
        </header>

        <div className="search-section">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search a cloud term — e.g. AWS Lambda, S3, IAM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={handleClear} aria-label="Clear search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
          <button className="search-btn" onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
            {loading ? <span className="spinner" /> : 'Search'}
          </button>
        </div>

        <div className="results-area">
          {loading && (
            <div className="loading-card">
              <div className="loading-pulse" />
              <div className="loading-pulse short" />
            </div>
          )}

          {!loading && result && (
            <div className="result-card">
              <div className="result-header">
                <div className="term-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  Definition
                </div>
              </div>
              <h2 className="result-term">{result.term}</h2>
              <p className="result-definition">{result.definition}</p>
            </div>
          )}

          {!loading && error && (
            <div className="error-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              <p>{error}</p>
            </div>
          )}

          {!loading && !searched && (
            <div className="suggestions">
              <p className="suggestions-label">Try searching for</p>
              <div className="suggestion-chips">
                {['AWS Lambda', 'S3', 'IAM', 'VPC', 'CloudWatch', 'EC2', 'DynamoDB', 'AWS KMS'].map(term => (
                  <button
                    key={term}
                    className="chip"
                    onClick={() => { setSearchTerm(term); }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Cloud Dictionary &copy; {new Date().getFullYear()} &mdash; Powered by AWS</p>
      </footer>
    </div>
  );
};

export default App;
