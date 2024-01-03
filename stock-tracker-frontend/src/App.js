import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [n, setN] = useState(1);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/stocks`);
        setStocks(response.data.slice(0, n));
      } catch (error) {
        console.error('Error fetching stocks:', error.message);
      }
    };

    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch data every second
    }, 1000);

    return () => clearInterval(interval);
  }, [n]);

  return (
    <div>
      <label>
        Enter the number of stocks (max 20):
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Math.min(20, parseInt(e.target.value)))}
          max={20}
          min={1}
        />
      </label>

      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol}>
            {stock.symbol} - ${stock.currentPrice.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
