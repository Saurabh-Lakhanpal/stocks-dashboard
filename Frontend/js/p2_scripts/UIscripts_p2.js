// Refresh Button Script =======================================================
function updateButtonTimestamp() {
    let now = new Date();
    let timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('refreshButton').innerText = `Last Updated: ${timestamp}`;
}

document.getElementById('refreshButton').addEventListener('click', function() {
    updateButtonTimestamp();
    location.reload();
});

window.onload = function() {
    updateButtonTimestamp();
}

// Page navigation =============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('historical').addEventListener('click', function() {
        window.location.href = 'index_p2.html';
    });

    document.getElementById('overview').addEventListener('click', function() {
        window.location.href = 'index_p1.html';
    });

    document.getElementById('ratios').addEventListener('click', function() {
        window.location.href = 'index_p3.html';
    });
});


// Fetch stock data for different plots (RSI, Bollinger Bands, etc.)
async function fetchStockData(ticker) {
    const url = `http://127.0.0.1:5000/api/v1.0/sp500?ticker=${ticker}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const defaultTicker = "AAPL";  // Default ticker to plot
    fetchDataAndPlot(defaultTicker);

    // Plot data based on user selection
    document.getElementById("plot-button").addEventListener("click", function() {
        const selectedTicker = selectedTickers[0]; // Assuming only one ticker is selected
        fetchDataAndPlot(selectedTicker);
    });
});

// Function to fetch and plot the data
async function fetchDataAndPlot(ticker) {
    try {
        const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Extract necessary data for plotting
        const timestamps = data.chart.result[0].timestamp.map(ts => new Date(ts * 1000));
        const prices = data.chart.result[0].indicators.quote[0].close;
        const volumes = data.chart.result[0].indicators.quote[0].volume;

        // Call the plotting function to add the layers
        plotData(timestamps, prices, volumes, ticker);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
