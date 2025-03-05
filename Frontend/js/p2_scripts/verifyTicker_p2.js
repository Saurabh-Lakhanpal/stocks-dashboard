// verifyTicker.js
// Function to fetch ticker data for the specific ticker and date range
async function fetchTickerData(ticker, startDate, endDate) {
    const url = `${window.baseUrl}/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Fetched data:', data); // Added log
        return data;
    } catch (error) {
        console.error('Error fetching ticker data:', error);
        return [];
    }
}

// Function to verify the selected ticker
async function verifySelectedTicker(selectedTicker, startDate, endDate) {
    const tickerData = await fetchTickerData(selectedTicker, startDate, endDate);
    console.log('Selected ticker:', selectedTicker); // Added log
    console.log('Ticker data:', tickerData); // Added log

    const isValid = tickerData.length > 0;
    console.log('Is valid:', isValid); // Added log

    if (!isValid) {
        alert('Selected ticker not found. Please check the ticker and try again.');
    }

    return isValid;
}
