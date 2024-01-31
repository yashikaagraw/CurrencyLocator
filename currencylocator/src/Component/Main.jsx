import React, { useState, useEffect } from "react";
import "./main.css";
import { FaSearch } from "react-icons/fa";

const Main = () => {
  const [state, setState] = useState("");
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, [state]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  //Filter

  const filteredCountries = countries.filter((country) =>
    country.currencies
      ? Object.keys(country.currencies).some((currencyCode) =>
          currencyCode.toLowerCase().includes(state.toLowerCase())
        )
      : false
  );

  // Calculate the index range for the current page
  const indexOfLastCountry = currentPage * itemsPerPage;
  const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  // Change page
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredCountries.length / itemsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="mainContainer">
      <div className="serchbar">
        <FaSearch size={40} />
        <input
          className="search-input"
          placeholder="Search by Currency INR, EUR"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>
      <h1>Country Information</h1>
      {loading ? (
        <div className="country-grid">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="country-grid">
          {currentCountries?.map((e, index) => (
            <div key={index} className="country-card">
              {e.flags && (
                <img
                  src={e.flags.png}
                  alt={`${e.name.common} flag`}
                  className="flag-img"
                />
              )}
              <h2>{e.name.common}</h2>
              <p>Currencies: </p>
              {e.currencies ? (
                <>
                  {Object.entries(e.currencies).map(([code, currency]) => (
                    <div key={code}>
                      {code} - {currency.name} ({currency.symbol})
                    </div>
                  ))}
                </>
              ) : (
                <p>No currency information available</p>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-button"
        >
          Previous
        </button>
        <span className="current-page">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredCountries.length / itemsPerPage)
          }
          className="page-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Main;
