let selectedTickers = ["AAPL"]; // Default ticker
let selectedTickerNames = ["Apple Inc."]; // Default ticker name
const defaultInterval = "5m";
let interval = defaultInterval;
let range = "range1"; // Default range

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
    // If a ticker is already selected, clear it first
    if (selectedTickers.length >= 1) {
        // Uncheck all checkboxes
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
        fetchDataAndPlot(selectedTickers[0], range, interval); // Update the chart with the new ticker
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
        li.textContent = ticker; // Use ticker symbol instead of company name
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
    const defaultTicker = "AAPL";
    const defaultRange = "range1";
    const defaultInterval = "5m";
    let selectedTickers = [defaultTicker];
    let selectedTickerNames = ["Apple Inc."];
    let range = defaultRange;
    let interval = defaultInterval;

    // Populate the selected ticker name on page load
    document.getElementById('selected-ticker').textContent = selectedTickerNames[0];

    // Fetch and plot data for the default ticker when the page loads
    fetchDataAndPlot(selectedTickers[0], range, interval);

    // Event listener for range selection
    document.getElementById("range-selector").addEventListener("change", function() {
        range = this.value;
        const selectedTicker = selectedTickers[0];
        const selectedInterval = interval;

        fetchDataAndPlot(selectedTicker, range, selectedInterval);
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
        });
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
        console.error("Error fetching data:", error);
    }
}

// Plot data function using D3.js
function plotData(timestamps, prices, volumes, ticker) {
    // Clear any existing plots
    d3.select("#plot").selectAll("*").remove();

    // Set up the dimensions and margins of the graph
    const margin = {top: 20, right: 50, bottom: 30, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleTime()
        .domain(d3.extent(timestamps))
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis for prices
    const yPrice = d3.scaleLinear()
        .domain([d3.min(prices), d3.max(prices)])
        .range([height, 0]);
    svg.append("g")
        .attr("class", "axisPrice")
        .call(d3.axisLeft(yPrice));

    // Add Y axis for volumes
    const yVolume = d3.scaleLinear()
        .domain([0, d3.max(volumes)])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yVolume));

    // Add the price line
    svg.append("path")
        .datum(timestamps.map((d, i) => ({date: d, value: prices[i]})))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => yPrice(d.value))
        );

    // Add the volume bars
    svg.selectAll("bar")
        .data(timestamps)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(d) - 0.5)
        .attr("y", (d, i) => yVolume(volumes[i]))
        .attr("width", 1)
        .attr("height", (d, i) => height - yVolume(volumes[i]))
        .attr("fill", "grey");
}
