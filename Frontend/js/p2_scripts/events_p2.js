// events_p2.js=========================================================
// Global variables
let selectedTickers = ["AAPL"];
let selectedTickerNames = ["Apple Inc."];
let start_date = "2013-02-08";
let end_date = "2018-02-07";

// Debounce function to improve performance
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

// Fetch suggestions from Autocomplete API call and handle selection
async function fetchSuggestions() {
    const query = document.getElementById('ticker-selector').value;
    if (query.length < 1) {
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('suggestions').style.display = 'none';
        return;
    }
    try {
        const response = await fetch(`https://yfapi.net/v6/finance/autocomplete?region=US&lang=en&query=${query}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        if (!response.ok) { throw new Error('Network response was not ok'); }
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
        // Error on screen
        document.getElementById('suggestions').innerHTML = '<li class="error-message">No Response from Autocomplete.</li>';
    }
}


// Updated handleSelection function to include verification of the selected ticker
async function handleSelection(checkbox) {
    if (selectedTickers.length >= 1) {
        const checkboxes = document.querySelectorAll('#suggestions input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        selectedTickers = [];
    }
    // If the checkbox is checked, add the ticker
    if (checkbox.checked) {
        selectedTickers.push(checkbox.value);
        selectedTickerNames.push(checkbox.dataset.name);
        updateSelectedList();
        fetchAndDisplayRecommendations(selectedTickers[0]);
        // Verify the selected ticker
        await verifySelectedTicker(checkbox.value, start_date, end_date);
        // Update ratios after selecting the ticker
        updateRatios();
    }
    if (selectedTickers.length > 1) {
        checkbox.checked = false;
        alert('You can select up to 1 ticker only.');
        selectedTickers.pop();
        updateSelectedList();
    }
}

function updateSelectedList() {
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    selectedTickers.forEach(ticker => {
        const li = document.createElement('li');
        li.textContent = ticker;
        selectedList.appendChild(li);
    });
    if (selectedTickers.length > 0) {
        document.getElementById('selected-ticker').textContent = selectedTickers[0];
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

// Updated event listener for the plot button to verify the selected ticker before plotting
document.getElementById('plot-button').addEventListener('click', async function() {
    const selectedTicker = selectedTickers[0];
    const isValid = await verifySelectedTicker(selectedTicker, start_date, end_date);
    if (!isValid) {
        return;
    }
    const showHistoricalPrice = document.getElementById('show-historical-price').checked;
    const showRSI = document.getElementById('show-rsi').checked;
    const showBollinger = document.getElementById('show-bollinger').checked;
    const showDrawdown = document.getElementById('show-drawdown').checked;
    plotStockAnalysis(selectedTicker, start_date, end_date, showHistoricalPrice, showRSI, showBollinger, showDrawdown);
    // Update ratios after plotting
    updateRatios();
});

// Function to update ratios based on the selected ticker
function updateRatios() {
    if (selectedTickers.length > 0) {
        fetchFinancialRatios(selectedTickers[0]);
    }
}

// Call updateRatios to fetch ratios on page load
document.addEventListener('DOMContentLoaded', function () {
    updateRatios();
});
