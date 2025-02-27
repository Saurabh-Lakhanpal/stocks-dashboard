// verifyTicker.js

// Function to fetch ticker data
async function fetchHistoricalTickerData() {
    const url = 'http://127.0.0.1:5000/api/v1.0/ticker';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ticker data:', error);
        return [];
    }
}

// Function to verify the selected ticker
async function verifySelectedTicker(selectedTicker) {
    const historicalData = await fetchHistoricalTickerData();
    const isValid = historicalData.some(tickerData => tickerData.ticker === selectedTicker);

    return isValid;
}
