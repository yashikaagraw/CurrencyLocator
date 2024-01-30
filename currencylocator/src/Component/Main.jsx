import React, { useState, useEffect } from 'react';
import './main.css';

const Main = () => {
  const [state, setState] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchData();
  }, [state]);

  const fetchData = async () => {
    try {
      const res = await fetch('https://restcountries.com/v3.1/all');
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const filteredCountries = countries.filter((e) =>
    e.currencies
      ? Object.keys(e.currencies).some(
          (currencyCode) =>
            currencyCode.toLowerCase().includes(state.toLowerCase())
        )
      : false
  );

  return (
    <div>
      <input
        className="search-input"
        placeholder="Search by Currency INR, EUR"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />

      <h1>Country Information</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        {filteredCountries?.map((e, index) => (
          <div key={index}>
            <h2>{e.name.common}</h2>
            {e.flags && (
              <img src={e.flags.png} alt={`${e.name.common} flag`} />
            )}
            <p>Currencies: </p>
            {e.currencies ? (
              <ul>
                {Object.entries(e.currencies).map(([code, currency]) => (
                  <li key={code}>
                    {code} - {currency.name} ({currency.symbol})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No currency information available</p>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
