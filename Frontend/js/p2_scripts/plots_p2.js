// plots_p2.js (part 1) =====================================
// Function to plot stock analysis
async function plotStockAnalysis(ticker, startDate, endDate, showHistoricalPrice, showRSI, showBollinger, showDrawdown) {
    const url = `${window.baseUrl}/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
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
    }
}

// Function to plot line chart using D3.js
function plotLineChart(dates, values, label, ylabel, title, color, elementId, options = {}, volumes = null) {
    d3.select(`#${elementId}`).selectAll("*").remove();

    const container = d3.select(`#${elementId}`).node();
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    const margin = { top: 20, right: 50, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("overflow", "hidden")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, innerWidth]);

    const y = d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([innerHeight, 0]);

    const xBand = d3.scaleBand()
        .domain(dates)
        .range([0, innerWidth])
        .padding(0.1);

    const yVolume = volumes ? d3.scaleLinear()
        .domain([0, d3.max(volumes)])
        .range([innerHeight, 0]) : null;

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%U-%b-%y")).ticks(d3.timeWeek.every(1));

    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .attr("dy", "5px"); 

    svg.append("g")
        .call(d3.axisLeft(y));

    if (volumes) {
        svg.append("g")
            .attr("transform", `translate(${innerWidth},0)`)
            .call(d3.axisRight(yVolume));

        svg.selectAll(".bar")
            .data(dates)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xBand(d))
            .attr("y", (d, i) => yVolume(volumes[i]))
            .attr("width", xBand.bandwidth())
            .attr("height", (d, i) => innerHeight - yVolume(volumes[i]))
            .attr("fill", "gray");
    }

    svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: values[index] })))
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    svg.selectAll("dot")
        .data(dates.map((date, index) => ({ date, value: values[index] })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", color);

    svg.selectAll("dot")
        .data(dates.map((date, index) => ({ date, value: values[index], volume: volumes ? volumes[index] : null })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("fill", color)
        .attr("opacity", 0)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("opacity", 0.7);
            d3.select("#tooltip")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 5}px`)
                .style("display", "block")
                .html(`Date: ${d.date.toLocaleDateString()}<br>Value: ${d.value}</br>${volumes ? `Volume: ${d.volume}` : ''}`);
        })
        .on("mouseout", function () {
            d3.select(this).attr("opacity", 0);
            d3.select("#tooltip").style("display", "none");
        });

    if (options.yMin !== undefined && options.yMax !== undefined) {
        y.domain([options.yMin, options.yMax]);
    }

    if (options.horizontalLines) {
        options.horizontalLines.forEach(line => {
            svg.append("line")
                .style("stroke", "red")
                .attr("x1", 0)
                .attr("y1", y(line))
                .attr("x2", innerWidth)
                .attr("y2", y(line));
        });
    }

    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "'Shafarik', sans-serif")
        .text(title);
}

// Calculation of RSI, Bollinger and Drawdown====================================================================
// Function to calculate RSI
function calculateRSI(data, window = 14) {
    const rsi = [];
    const gains = [];
    const losses = [];

    for (let i = 1; i < data.length; i++) {
        const delta = data[i] - data[i - 1];
        if (delta > 0) {
            gains.push(delta);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(-delta);
        }

        if (i >= window) {
            const avgGain = d3.mean(gains.slice(i - window, i));
            const avgLoss = d3.mean(losses.slice(i - window, i));
            const rs = avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
        } else {
            rsi.push(null);
        }
    }
    return rsi;
}

// Function to calculate Bollinger Bands
function calculateBollingerBands(data, window = 20) {
    const rollingMean = [];
    const rollingStd = [];
    const upper = [];
    const lower = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - window + 1);
        const windowData = data.slice(start, i + 1);
        const mean = d3.mean(windowData);
        const std = d3.deviation(windowData);
        rollingMean.push(mean);
        rollingStd.push(std);
        upper.push(mean + std * 2);
        lower.push(mean - std * 2);
    }
    return [upper, lower];
}

// Function to calculate Drawdown
function calculateDrawdown(data) {
    const cumReturns = [];
    const drawdown = [];
    let maxReturn = 0;
    for (let i = 0; i < data.length; i++) {
        const returnVal = data[i] / data[0];
        cumReturns.push(returnVal);
        maxReturn = Math.max(maxReturn, returnVal);
        drawdown.push(returnVal - maxReturn);
    }
    return drawdown;
}

// plots_p2.js (part 2) =====================================
// Plot non default charts =============================================================================

// Function to plot line chart with Bollinger Bands using D3.js
function plotBollingerBands(dates, prices, upper, lower, title, elementId) {
    d3.select(`#${elementId}`).selectAll("*").remove();

    const container = d3.select(`#${elementId}`).node();
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    const margin = { top: 20, right: 50, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("overflow", "hidden")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, innerWidth]);

    const y = d3.scaleLinear()
        .domain([d3.min(lower), d3.max(upper)])
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%U-%b-%y")).ticks(d3.timeWeek.every(1));

    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .attr("dy", "5px");

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the price line
    svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: prices[index] })))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    // Add the upper band line
    svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: upper[index] })))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    // Add the lower band line
    svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: lower[index] })))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    // Add tooltip
    svg.selectAll("dot")
        .data(dates.map((date, index) => ({ date, value: prices[index] })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", "blue");

    svg.selectAll("dot")
        .data(dates.map((date, index) => ({ date, value: prices[index], upper: upper[index], lower: lower[index] })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("fill", "blue")
        .attr("opacity", 0)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("opacity", 0.7);
            d3.select("#tooltip")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 5}px`)
                .style("display", "block")
                .html(`Date: ${d.date.toLocaleDateString()}<br>Price: ${d.value}<br>Upper Band: ${d.upper}<br>Lower Band: ${d.lower}`);
        })
        .on("mouseout", function () {
            d3.select(this).attr("opacity", 0);
            d3.select("#tooltip").style("display", "none");
        });

    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "'Shafarik', sans-serif")
        .text(title);
}

// Function to plot area chart using D3.js
function plotAreaChart(dates, values, label, ylabel, title, color, elementId) {
    d3.select(`#${elementId}`).selectAll("*").remove();

    const container = d3.select(`#${elementId}`).node();
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    const margin = { top: 30, right: 50, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("overflow", "hidden")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the gradients
    const gradientAbove = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient-above")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");

    gradientAbove.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0.1);

    gradientAbove.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0.7);

    const gradientBelow = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient-below")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "100%")
        .attr("y2", "0%");

    gradientBelow.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#C7E5F7")
        .attr("stop-opacity", 0.7);

    gradientBelow.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#C7E5F7")
        .attr("stop-opacity", 0.1);

    const x = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, innerWidth]);

    const y = d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%U-%b-%y")).ticks(d3.timeWeek.every(1));

    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start")
        .attr("dy", "5px");

    svg.append("g")
        .call(d3.axisLeft(y));

    // Add area path with gradient fill above the line
    const areaAbove = d3.area()
        .x(d => x(d.date))
        .y0(0)
        .y1(d => y(d.value))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: values[index] })))
        .attr("fill", "url(#area-gradient-above)")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", areaAbove);

    // Add area path with gradient fill below the line
    const areaBelow = d3.area()
        .x(d => x(d.date))
        .y0(innerHeight)
        .y1(d => y(d.value))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(dates.map((date, index) => ({ date, value: values[index] })))
        .attr("fill", "url(#area-gradient-below)")
        .attr("stroke", "#C7E5F7")
        .attr("stroke-width", 1.5)
        .attr("d", areaBelow);

    // Add tooltip
    svg.selectAll("dot")
        .data(dates.map((date, index) => ({ date, value: values[index] })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", color);

    svg.selectAll("dot")
        .data(dates.map((date, index) => ({ date, value: values[index], volume: null })))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("fill", color)
        .attr("opacity", 0)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("opacity", 0.7);
            d3.select("#tooltip")
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 5}px`)
                .style("display", "block")
                .html(`Date: ${d.date.toLocaleDateString()}<br>Value: ${d.value}`);
        })
        .on("mouseout", function () {
            d3.select(this).attr("opacity", 0);
            d3.select("#tooltip").style("display", "none");
        });
}
