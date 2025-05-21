import { useEffect, useState } from "react";

const MultiSearchBar = ({ onSearch, onSelectResult, onClear }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length >= 3) {
      const fetchResults = async () => {
        const res = await onSearch(trimmed);
        setResults(res);
        setShowResults(true);
      };
      fetchResults();
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, onSearch]);

  const handleSelect = (result) => {
    setQuery(result);
    setShowResults(false);
    onSelectResult(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim().length >= 3) {
      e.preventDefault();
      setShowResults(false);
      onSelectResult(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    onClear();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary text-lg focus:outline-none"
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
      {showResults && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSearchBar;
