let selectedTickers = [];
let selectedTickerNames = {};

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
        delete selectedTickerNames[checkbox.value]; 
    }// Remove the company name
        updateSelectedList();
}

// Changes the list to new selected ticker
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

// Handle "Plot" button click
document.getElementById("plot-button").addEventListener("click", function() {
    // Fetch and plot data for all selected tickers, but only plot once
    fetchDataAndPlot();
});

// Function to fetch data and plot for all selected tickers at once
async function fetchDataAndPlot() {
    try {
        // Clear the previous plots before adding new ones
        d3.select("#plot_p2").selectAll("*").remove();

        let svgIndex = 0;  // Initialize the index for SVG placement
        const margin = {top: 20, right: 50, bottom: 30, left: 50};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create a single SVG container for all tickers
        const svgContainer = d3.select("#plot_p2")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", (selectedTickers.length * (height + margin.top + margin.bottom)))
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Loop over each ticker and plot them sequentially within the single SVG
        for (let ticker of selectedTickers) {
            const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}`, {
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

            const yPosition = svgIndex * (height + margin.top + margin.bottom); // Set Y-position for the current ticker's chart

            // Plot the data for this ticker
            plotData(timestamps, prices, volumes, ticker, svgContainer, width, height, yPosition);

            svgIndex++; // Increment index to position the next chart
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to plot data with multiple layers (price, RSI, Bollinger Bands, and Drawdown)
function plotData(timestamps, prices, volumes, ticker, svgContainer, width, height, yPosition) {
    // Add a group for each ticker to separate them visually
    const svg = svgContainer.append("g")
        .attr("transform", `translate(0, ${yPosition})`); // Adjust position for each ticker

    // Add X axis (timestamps)
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

    // Plot the price line (Historical Price)
    svg.append("path")
        .datum(timestamps.map((d, i) => ({date: d, value: prices[i]})))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => yPrice(d.value))
        );

    // Plot the volume bars (on the right axis)
    const yVolume = d3.scaleLinear()
        .domain([0, d3.max(volumes)])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yVolume));

    svg.selectAll("bar")
        .data(timestamps)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(d) - 0.5)
        .attr("y", (d, i) => yVolume(volumes[i]))
        .attr("width", 1)
        .attr("height", (d, i) => height - yVolume(volumes[i]))
        .attr("fill", "grey");

    // Add additional layers here: RSI, Bollinger Bands, and Drawdown
    plotRSI(timestamps, ticker, x, yPrice, svg);
    // plotBollingerBands(timestamps, ticker, x, yPrice, svg);
    // plotDrawdown(timestamps, ticker, x, yPrice, svg);
}

// Plot RSI
function plotRSI(timestamps, ticker, x, yPrice, svg) {
    const rsiData = calculateRSI(timestamps, ticker); // Placeholder function
    svg.append("path")
        .datum(rsiData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => yPrice(d.value))
        );
}

// Plot Bollinger Bands
function plotBollingerBands(timestamps, ticker, x, yPrice, svg) {
    const bollingerData = calculateBollingerBands(timestamps, ticker); // Placeholder function
    svg.append("path")
        .datum(bollingerData.upper)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => yPrice(d.value))
        );
}

//Plot Drawdown
function plotDrawdown(timestamps, ticker, x, yPrice, svg) {
    const drawdownData = calculateDrawdown(timestamps, ticker); // Placeholder function
    svg.append("path")
        .datum(drawdownData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => yPrice(d.value))
        );
}

// Placeholder functions for RSI, Bollinger Bands, and Drawdown calculations
function calculateRSI(timestamps, ticker) {
    return timestamps.map((date, index) => ({ date, value: Math.random() * 100 })); // Random data for illustration
}

function calculateBollingerBands(timestamps, ticker) {
    return {
        upper: timestamps.map((date, index) => ({ date, value: Math.random() * 100 })),
        lower: timestamps.map((date, index) => ({ date, value: Math.random() * 50 }))
    };
}

function calculateDrawdown(timestamps, ticker) {
    return timestamps.map((date, index) => ({ date, value: Math.random() * 30 }));
}
