// scripts_p2.js

document.addEventListener('DOMContentLoaded', function() {
       // Populate the selected ticker name on page load
       document.getElementById('selected-ticker').textContent = selectedTickerNames[0];
    // Function to fetch ticker data
    async function fetchTickerData(ticker) {
        const url = ticker ? `${window.baseUrl}/api/v1.0/ticker?ticker=${ticker}` : `${window.baseUrl}/api/v1.0/ticker`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Ticker data:', data);
            // Process and display the ticker data
        } catch (error) {
            console.error('Error fetching ticker data:', error);
            document.getElementById('selected-ticker').innerHTML = '<li class="error-message">No Response from Backend.</li>';
        }
    }

    // Function to fetch S&P 500 data
    async function fetchSP500Data(ticker, startDate, endDate) {
        const url = ticker ? `${window.baseUrl}/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}` : `${window.baseUrl}/api/v1.0/sp500?start_date=${startDate}&end_date=${endDate}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('S&P 500 data:', data);
            // Process and plot the S&P 500 data
        } catch (error) {
            console.error('Error fetching S&P 500 data:', error);
            document.getElementById('selected-ticker').innerHTML = '<li class="error-message">No Response from Backend API.</li>';
        }
    }

    // Function to fetch portfolio data
    async function fetchPortfolioData() {
        const url = `${window.baseUrl}/api/v1.0/portfolio`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Portfolio data:', data);
            // Process and display the portfolio data
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
            document.getElementById('selected-ticker').innerHTML = '<li class="error-message">No Response from Backend API.</li>';
        }
    }
    // Function to plot stock analysis with console logs for debugging
    async function plotStockAnalysis(ticker, startDate, endDate, showHistoricalPrice, showRSI, showBollinger, showDrawdown) {
        const url = `${window.baseUrl}/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('Fetched data:', data); // Log fetched data
            if (data.length === 0) {
                console.log(`No data found for ticker: ${ticker}`);
                return;
            }
            // Ensure the data is sorted by date
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            // Prepare data for plotting
            const dates = data.map(d => new Date(d.date));
            const closePrices = data.map(d => d.close_price);
            const volumes = data.map(d => d.volume);
            console.log('Dates:', dates); // Log dates
            console.log('Close Prices:', closePrices); // Log close prices
            console.log('Volumes:', volumes); // Log volumes
            // Clear previous plots
            d3.select("#plot_p2").selectAll("*").remove();
            // Plot Historical Price Trends
            if (showHistoricalPrice) {
                plotLineChart(dates, closePrices, 'Closing Price', 'Price (USD)', 'Historical Price Trends', 'blue', 'plot_p2');
            }
            // Plot RSI
            if (showRSI) {
                const rsi = calculateRSI(closePrices);
                plotLineChart(dates, rsi, 'RSI', 'RSI', 'RSI for ' + ticker, 'purple', 'plot_p2', { yMin: 0, yMax: 100, horizontalLines: [30, 70] });
            }
            // Plot Bollinger Bands
            if (showBollinger) {
                const [bollingerUpper, bollingerLower] = calculateBollingerBands(closePrices);
                plotBollingerBands(dates, closePrices, bollingerUpper, bollingerLower, 'Bollinger Bands for ' + ticker, 'plot_p2');
            }
            // Plot Drawdown
            if (showDrawdown) {
                const drawdown = calculateDrawdown(closePrices);
                plotAreaChart(dates, drawdown, 'Drawdown', 'Drawdown', 'Drawdown for ' + ticker, 'red', 'plot_p2');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('selected-ticker').innerHTML = '<li class="error-message">No Response from Backend.</li>';
        }
    }

    // Trigger the default plot on page load
    const defaultTicker = 'AAPL';
    const startDate = '2013-02-08';
    const endDate = '2018-02-07';
    const showHistoricalPrice = document.getElementById('show-historical-price').checked;
    const showRSI = document.getElementById('show-rsi').checked;
    const showBollinger = document.getElementById('show-bollinger').checked;
    const showDrawdown = document.getElementById('show-drawdown').checked;
    plotStockAnalysis(defaultTicker, startDate, endDate, showHistoricalPrice, showRSI, showBollinger, showDrawdown);

    // Example usage
    fetchTickerData(); // Fetch all tickers on page load
    fetchSP500Data('AAPL', '2014-01-01', '2015-01-01'); // Fetch S&P 500 data for AAPL within a specific date range
    fetchPortfolioData(); // Fetch portfolio data
});
