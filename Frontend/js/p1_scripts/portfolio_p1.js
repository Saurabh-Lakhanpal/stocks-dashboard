//portfolio_p1.js

// Fetch from backend route for portfolio
async function getPortfolioData() {
    const url = `${window.baseUrl}/api/v1.0/portfolio`;
    try {
        console.log('Fetching portfolio data from:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching portfolio data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Separate the response into shares and tickers lists
        const shares = data.map(stock => stock.shares);
        const tickers = data.map(stock => stock.ticker);
        
        console.log('Portfolio data retrieved successfully:', { shares, tickers });
        return { shares, tickers };
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // UI error to show
        document.getElementById('ticker-name-2').innerHTML = '<p class="error-message">Error Getting Portfolio Data.</p>';
        return { shares: [], tickers: [] };
    }
}

async function getStockData(tickers) {
    const tickersString = tickers.join('%2C');
    const url = `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${tickersString}`;
    try {
        console.log('Fetching stock data for tickers:', tickersString);
        const response = await fetch(url, {
            headers: {
                'x-api-key': API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching stock data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Separate the response into longName, price, and change lists
        const longName = data.quoteResponse.result.map(stock => stock.longName);
        const price = data.quoteResponse.result.map(stock => stock.ask);
        const change = data.quoteResponse.result.map(stock => stock.regularMarketChangePercent.toFixed(2));
        
        console.log('Stock data retrieved successfully:', { longName, price, change });
        return { longName, price, change };
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return { longName: [], price: [], change: [] };
    }
}

async function updatePortfolio() {
    try {
        console.log('Updating portfolio...');
        const { shares, tickers } = await getPortfolioData();
        const { longName, price, change } = await getStockData(tickers);

        for (let i = 0; i < tickers.length; i++) {
            const value = (price[i] * shares[i]).toFixed(2);
            console.log(`Updating ticker ${tickers[i]}:`, {
                longName: longName[i],
                value: value,
                change: change[i]
            });
            
            document.getElementById(`ticker-name-${i + 1}`).textContent = longName[i];
            document.getElementById(`ticker-value-${i + 1}`).textContent = value;
            document.getElementById(`ticker-change-${i + 1}`).textContent = `${change[i]}%`;
        }
        
        console.log('Portfolio updated successfully.');
    } catch (error) {
        console.error('Error updating portfolio:', error);
    }
}

// Initial update
updatePortfolio();
