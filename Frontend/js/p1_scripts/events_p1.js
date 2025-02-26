// events_p1.js

// Global variables
let selectedTickers = ["AAPL"]; 
let selectedTickerNames = ["Apple Inc."]; 
const defaultInterval = "5m";
let interval = defaultInterval;
let range = "1d"; 

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
        // Error on screen
        document.getElementById('suggestions').innerHTML = '<li class="error-message">No Response from Autocomplete.</li>';
    }
}

function handleSelection(checkbox) {

    if (selectedTickers.length >= 1) {

        const checkboxes = document.querySelectorAll('#suggestions input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);

        selectedTickers = [];
        selectedTickerNames = [];
    }

    // If the checkbox is checked, add the ticker
    if (checkbox.checked) {
        selectedTickers.push(checkbox.value);
        selectedTickerNames.push(checkbox.dataset.name);
        updateSelectedList();
        fetchDataAndPlot(selectedTickers[0], range, interval); 
        updateSelectedTickerPrice(); 
        fetchAndDisplayRecommendations(selectedTickers[0]); 
    }

    if (selectedTickers.length > 1) {
        checkbox.checked = false;
        alert('You can select up to 1 ticker only.');
        selectedTickers.pop();
        selectedTickerNames.pop();
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
        // Display the name of the first selected ticker
        document.getElementById('selected-ticker').textContent = selectedTickerNames[0];
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
document.addEventListener("DOMContentLoaded", function() {
    // Populate the selected ticker name on page load
    document.getElementById('selected-ticker').textContent = selectedTickerNames[0];

    // Fetch and plot data for the default ticker when the page loads
    fetchDataAndPlot(selectedTickers[0], range, interval);
    updateSelectedTickerPrice(); 
    fetchAndDisplayRecommendations(selectedTickers[0]); 

    // Event listener for range selection
    document.getElementById("range-selector").addEventListener("change", function() {
        range = this.value;
        const selectedTicker = selectedTickers[0];
        fetchDataAndPlot(selectedTicker, range, interval);
        updateSelectedTickerPrice(); 

        // Reset the layer selector to its default value
        const layerSelector = document.getElementById("layer-selector");
        layerSelector.value = "";
        clearCandlestickLayer(); 
    });

    // Event listener for interval button clicks
    const intervalButtons = document.querySelectorAll(".interval-button");
    intervalButtons.forEach(button => {
        button.addEventListener("click", function() {
            intervalButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            interval = this.textContent;
            const selectedTicker = selectedTickers[0];
            fetchDataAndPlot(selectedTicker, range, interval);
            updateSelectedTickerPrice(); 

            // Reset the layer selector to its default value
            const layerSelector = document.getElementById("layer-selector");
            layerSelector.value = "";
            clearCandlestickLayer(); 
        });
    });

    // Event listener for candlesticks layer
    document.getElementById("layer-selector").addEventListener("change", async function() {
        const selectedLayer = this.value;
        const selectedTicker = selectedTickers[0];

        if (selectedLayer === "layer3") { 
            console.log('Layer selector changed, fetching data for:', selectedTicker);
            const data = await fetchDataAndPlot(selectedTicker, range, interval); 
            console.log('Data received in event listener:', data);
            handleCandlestickData(data); 
        } else {
            clearCandlestickLayer(); 
        }
    });
});

// Function to clear the candlestick layer
function clearCandlestickLayer() {
    const svg = d3.select("#plot svg g");
    svg.selectAll(".candlestick-layer").remove();
}
