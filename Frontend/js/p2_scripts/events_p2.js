//events_p2.js(part1)=========================================================
// Global variables
let selectedTickers = ["AAPL"];
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

function handleSelection(checkbox) {
    if (selectedTickers.length >= 1) {
        const checkboxes = document.querySelectorAll('#suggestions input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        selectedTickers = [];
    }
    // If the checkbox is checked, add the ticker
    if (checkbox.checked) {
        selectedTickers.push(checkbox.value);
        updateSelectedList();
        fetchAndDisplayRecommendations(selectedTickers[0]);
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
//events_p2.js (part2)==============================================================
// Event listener for the plot button to trigger the plotStockAnalysis function
document.getElementById('plot-button').addEventListener('click', function() {
    const selectedTicker = selectedTickers[0];
    const showHistoricalPrice = document.getElementById('show-historical-price').checked;
    const showRSI = document.getElementById('show-rsi').checked;
    const showBollinger = document.getElementById('show-bollinger').checked;
    const showDrawdown = document.getElementById('show-drawdown').checked;
    plotStockAnalysis(selectedTicker, start_date, end_date, showHistoricalPrice, showRSI, showBollinger, showDrawdown);
});

// Plot data function using D3.js
function plotData(timestamps, prices, volumes, ticker) {
    d3.select("#plot_p2").selectAll("*").remove();

    // Get the dimensions of the parent div
    const container = d3.select("#plot_p2").node();
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    // Set up the dimensions and margins of the graph
    const margin = { top: 10, right: 100, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#plot_p2")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("overflow", "hidden")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleBand()
        .domain(timestamps)
        .range([0, innerWidth])
        .padding(0.1);

    // Add Y axis for prices
    const yPrice = d3.scaleLinear()
        .domain([d3.min(prices), d3.max(prices)])
        .range([innerHeight, 0]);

    // Add Y axis for volumes
    const yVolume = d3.scaleLinear()
        .domain([0, d3.max(volumes)])
        .range([innerHeight, 0]);

    // Add X axis with dynamic ticks and rotate x-ticks 90 degrees
    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).tickValues(timestamps))
        .selectAll("text")
        .style("font-size", "12px")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    // Add Y axis for prices
    svg.append("g")
        .attr("class", "axisPrice")
        .call(d3.axisLeft(yPrice))
        .selectAll("text")
        .style("font-size", "12px");

    // Add Y axis for volumes
    svg.append("g")
        .attr("transform", `translate(${innerWidth},0)`)
        .call(d3.axisRight(yVolume))
        .selectAll("text")
        .style("font-size", "12px");

    // Add the volume bars
    svg.selectAll("bar")
        .data(timestamps)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(d))
        .attr("y", (d, i) => volumes[i] !== null ? yVolume(volumes[i]) : innerHeight)
        .attr("width", x.bandwidth())
        .attr("height", (d, i) => volumes[i] !== null ? innerHeight - yVolume(volumes[i]) : 0)
        .attr("fill", "#6CB5DE");

    // Add the price line with handling for missing data
    svg.append("path")
        .datum(timestamps.map((d, i) => ({ date: d, value: prices[i] !== null ? prices[i] : NaN })))
        .attr("fill", "none")
        .attr("stroke", "#DB0A40")
        .attr("stroke-width", 1.75)
        .attr("d", d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date) + x.bandwidth() / 2)
            .y(d => yPrice(d.value))
        );

    // Add points to the price line
    svg.selectAll("dot")
        .data(timestamps.map((d, i) => ({ date: d, value: prices[i] })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date) + x.bandwidth() / 2)
        .attr("cy", d => yPrice(d.value))
        .attr("r", 3)
        .attr("fill", "#DB0A40");

    // Add points for hover functionality
    svg.selectAll("dot")
        .data(timestamps.map((d, i) => ({ date: d, value: prices[i], volume: volumes[i] })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date) + x.bandwidth() / 2)
        .attr("cy", d => yPrice(d.value))
        .attr("r", 5)
        .attr("fill", "#DB0A40")
        .attr("opacity", 0)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("opacity", 0.7);
            d3.select("#tooltip")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 5}px`)
                .style("display", "block")
                .html(`Date: ${d.date.toLocaleDateString()}<br>Price: ${d.value}</br>Volume: ${d.volume}`);
        })
        .on("mouseout", function () {
            d3.select(this).attr("opacity", 0);
            d3.select("#tooltip").style("display", "none");
        });
}

// Function to update selected-ticker-price span
async function updateSelectedTickerPrice() {
    const ticker = selectedTickers[0];
    try {
        const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}?range=${start_date}&interval=${end_date}`, {
            headers: { 'X-API-KEY': API_KEY }
        });
        if (!response.ok) { throw new Error("Network response was not ok"); }
        const data = await response.json();
        const latestPrice = data.chart.result[0].indicators.quote[0].close.pop();
        const roundedPrice = latestPrice.toFixed(2);

        // Update the inner HTML of the span
        const priceElement = document.getElementById('selected-ticker-price');
        priceElement.innerHTML = `USD ${roundedPrice}`;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Provide user feedback on error
        document.getElementById('selected-ticker-price').innerHTML = '<p class="error-message">Error Getting Quote Price.</p>';
    }
}
