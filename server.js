const express = require('express');
const axios = require('axios');
const fs = require('fs/promises');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

const stocksFile = 'stocks.json';
let stocksData = [];

const getRandomInterval = () => Math.floor(Math.random() * (5 - 1 + 1) + 1) * 1000;

const fetchStocks = async () => {
    try {
        const response = await axios.get('https://api.polygon.io/v3/reference/tickers', {
            params: {
                apiKey: 'azx7Yjtp1QoaJAkZ1r4cQJJwHA_gXRfY',
                type: 'CS',
                market: 'stocks',
                active: true,
                sort: 'ticker',
                order: 'asc',
                limit: 20,
            },
        });

        const stocks = response.data.results.map((tickerInfo) => ({
            symbol: tickerInfo.ticker,
            openPrice: 0,
            refreshInterval: getRandomInterval(),
            currentPrice: 0,
        }));

        await fs.writeFile(stocksFile, JSON.stringify(stocks));
        stocksData = stocks;
    } catch (error) {
        console.error('Error fetching stocks:', error.message);
    }
};

const updateStockPrices = () => {
    stocksData.forEach((stock) => {
        setInterval(() => {
            const randomChange = (Math.random() - 0.5) * 5;
            stock.currentPrice += randomChange;
            stock.currentPrice = Math.max(0, stock.currentPrice);
        }, stock.refreshInterval);
    });
};

app.get('/api/stocks', (req, res) => {
    res.json(stocksData);
});

app.get('/api/stock/:symbol', (req, res) => {
    const { symbol } = req.params;
    const stock = stocksData.find((s) => s.symbol === symbol);

    if (stock) {
        res.json({ symbol: stock.symbol, currentPrice: stock.currentPrice.toFixed(2) });
    } else {
        res.status(404).json({ error: 'Stock not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    fetchStocks();
    updateStockPrices();
});
