// Function to fetch stock data from Flask API
async function fetchStockData(ticker, startDate, endDate) {
    const url = `http://127.0.0.1:5000/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// // Function to plot a graph
// function plotGraph(data, plotId) {
//     const width = 500;
//     const height = 300;

//     // Create an SVG container for each plot
//     const svg = d3.select(`#${plotId}`)
//                   .append("svg")
//                   .attr("width", width)
//                   .attr("height", height);

//     // Parse the date and price data

//     const parseDate = d3.timeParse("%Y-%m-%d");
//     data.forEach(d => {
//         d.date = parseDate(d.date);
//         d.close_price = +d.close_price;
//     });

//     // Set up scales for the x and y axes
//     const x = d3.scaleTime()
//                 .domain(d3.extent(data, d => d.date))
//                 .range([0, width]);

//     const y = d3.scaleLinear()
//                 .domain([d3.min(data, d => d.close_price), d3.max(data, d => d.close_price)])
//                 .range([height, 0]);

//     // Add x and y axes
//     svg.append("g")
//        .attr("transform", `translate(0,${height})`)
//        .call(d3.axisBottom(x));

//     svg.append("g")
//        .call(d3.axisLeft(y));

//     // Add the line to the graph
//     const line = d3.line()
//                    .x(d => x(d.date))
//                    .y(d => y(d.close_price));

//     svg.append("path")
//        .data([data])
//        .attr("fill", "none")
//        .attr("stroke", "steelblue")
//        .attr("stroke-width", 1.5)
//        .attr("d", line);
// }
// Fetch and plot data function
async function fetchDataAndPlot(ticker, startDate, endDate) {
    try {
        const response = await fetch(`https://yfapi.net/v8/finance/chart/${ticker}?period1=${new Date(startDate).getTime() / 1000}&period2=${new Date(endDate).getTime() / 1000}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Check if the response has the expected data
        if (!data.chart || !data.chart.result || !data.chart.result[0]) {
            throw new Error("Invalid data format or no data available for the selected date range.");
        }

        const timestamps = data.chart.result[0].timestamp.map(ts => new Date(ts * 1000));
        const prices = data.chart.result[0].indicators.quote[0].close;
        const volumes = data.chart.result[0].indicators.quote[0].volume;

        // Call the plotting function
        plotData(timestamps, prices, volumes, ticker);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function plotData(timestamps, prices, volumes, ticker) {
    // Clear any existing plots
    d3.select("#plot").selectAll("*").remove();

    // Validate that prices and volumes are arrays and contain numbers
    if (!Array.isArray(prices) || prices.length === 0 || !prices.every(p => typeof p === 'number')) {
        console.error('Invalid price data', prices);
        return; // Exit the function early if prices are invalid
    }

    if (!Array.isArray(volumes) || volumes.length === 0 || !volumes.every(v => typeof v === 'number')) {
        console.error('Invalid volume data', volumes);
        return; // Exit the function early if volumes are invalid
    }

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
