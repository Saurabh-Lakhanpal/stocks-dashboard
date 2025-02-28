// plot_p1.js

// Fetch from Finance chart api and plot data function
async function fetchDataAndPlot(ticker, range, interval) {
    console.log(`Fetching data for range: ${range}, interval: ${interval}`);

    try {
        const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}?range=${range}&interval=${interval}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log('Data received in fetchDataAndPlot:', data);

        const timestamps = data.chart.result[0].timestamp.map(ts => new Date(ts * 1000));
        const prices = data.chart.result[0].indicators.quote[0].close;
        const volumes = data.chart.result[0].indicators.quote[0].volume;

        console.log('Timestamps:', timestamps);
        console.log('Prices:', prices);
        console.log('Volumes:', volumes);

        plotData(timestamps, prices, volumes, ticker);

        // Re-plot the chart when the window is resized for responsiveness
        window.addEventListener('resize', () => plotData(timestamps, prices, volumes, ticker));

        return data; 
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('plot').innerHTML = '<p class="error-message">Error fetching Plot data.</p>';
        return null;
    }
}


// Plot data function using D3.js
function plotData(timestamps, prices, volumes, ticker) {
    d3.select("#plot").selectAll("*").remove();

    // Get the dimensions of the parent div
    const container = d3.select("#plot").node();
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    // Set up the dimensions and margins of the graph
    const margin = { top: 10, right: 100, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#plot")
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
        .style("color", "#ffffff")
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
        const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}?range=${range}&interval=${interval}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

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
