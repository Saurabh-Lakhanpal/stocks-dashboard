let selectedTickers = ["AAPL"];
let selectedTickerNames = {};
let start_date = ["2014-01-01"];
let end_date = ["2014-06-30"];
const defaultInterval = "5m";
let interval = defaultInterval;

// Fetch suggestions and handle selection
async function fetchSuggestions() {
    const query = document.getElementById('ticker-selector').value;
    if (query.length < 1) {
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('suggestions').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://yfapi.net/v6/finance/autocomplete?region=US&lang=en&query=${query}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const suggestions = data.ResultSet.Result;
        const suggestionsList = document.getElementById('suggestions');
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'block'; 

        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = suggestion.symbol;
            checkbox.dataset.name = suggestion.name; 
            checkbox.onchange = () => handleSelection(checkbox);
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(suggestion.symbol));
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function handleSelection(checkbox) {
    if (checkbox.checked) {
        if (selectedTickers.length < 5) {
            selectedTickers.push(checkbox.value);
            selectedTickerNames[checkbox.value] = checkbox.dataset.name; // Store the company name
            updateSelectedList();
        } else {
            checkbox.checked = false;
            alert('You can select up to 5 tickers only.');
        }
    } else {
        selectedTickers = selectedTickers.filter(ticker => ticker !== checkbox.value);
        delete selectedTickerNames[checkbox.value]; // Remove the company name
        updateSelectedList();
    }
}

function updateSelectedList() {
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    selectedTickers.forEach(ticker => {
        const li = document.createElement('li');
        li.textContent = ticker; // Use ticker symbol instead of company name
        selectedList.appendChild(li);
    });

    if (selectedTickers.length > 0) {
        // Display the name of the first selected ticker
        document.getElementById('selected-ticker').textContent = selectedTickerNames[selectedTickers[0]];
    } else {
        document.getElementById('selected-ticker').textContent = '';
    }
}

function showSuggestions() {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.style.display = 'block';
}

document.addEventListener('click', function(event) {
    const suggestionsList = document.getElementById('suggestions');
    const searchBox = document.getElementById('ticker-selector');
    if (!suggestionsList.contains(event.target) && !searchBox.contains(event.target)) {
        suggestionsList.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const defaultTicker = "AAPL";
    const defaultRange = "range1";

    // Fetch and plot data for the default ticker when the page loads
    fetchDataAndPlot(selectedTickers[0], defaultRange, defaultInterval);

    document.getElementById("plot-button").addEventListener("click", function() {
        const selectedTicker = selectedTickers[0]; // Assuming only one ticker is selected
        const selectedRange = document.getElementById("range-selector").value;
        const activeIntervalButton = document.querySelector(".interval-button.active");
        const selectedInterval = activeIntervalButton ? activeIntervalButton.textContent : defaultInterval;

        fetchDataAndPlot(selectedTicker, selectedRange, selectedInterval);
    });

    // Event listeners for range and interval changes
    document.getElementById("range-selector").addEventListener("change", function() {
        const selectedTicker = selectedTickers[0];
        const selectedRange = this.value;
        fetchDataAndPlot(selectedTicker, selectedRange, interval);
    });

    const intervalButtons = document.querySelectorAll(".interval-button");
    intervalButtons.forEach(button => {
        button.addEventListener("click", function() {
            intervalButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            interval = this.textContent;
            const selectedTicker = selectedTickers[0];
            const selectedRange = document.getElementById("range-selector").value;
            fetchDataAndPlot(selectedTicker, selectedRange, interval);
        });
    });

    // Fetch and plot data function
    async function fetchDataAndPlot(ticker, range, interval) {
        try {
            const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}?interval=${interval}`, {
                headers: {
                    'X-API-KEY': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const timestamps = data.chart.result[0].timestamp.map(ts => new Date(ts * 1000));
            const prices = data.chart.result[0].indicators.quote[0].close;
            const volumes = data.chart.result[0].indicators.quote[0].volume;

            plotData(timestamps, prices, volumes, ticker);
        } catch (error) {
            console