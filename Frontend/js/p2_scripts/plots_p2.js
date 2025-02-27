// plots_p2.js (part1)===================================================================================

// Function to plot stock analysis
async function plotStockAnalysis(ticker, startDate, endDate, showHistoricalPrice, showRSI, showBollinger, showDrawdown) {
    const url = `http://127.0.0.1:5000/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;
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
function plotLineChart(dates, values, label, ylabel, title, color, elementId, options = {}) {
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(`#${elementId}`).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(dates.map((date, index) => ({ date: date, value: values[index] })))
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);

    if (options.yMin !== undefined && options.yMax !== undefined) {
        y.domain([options.yMin, options.yMax]);
    }
    
    if (options.horizontalLines) {
        options.horizontalLines.forEach(line => {
            svg.append("line")
                .style("stroke", "red")
                .attr("x1", 0)
                .attr("y1", y(line))
                .attr("x2", width)
                .attr("y2", y(line));
        });
    }
}

// Function to plot Bollinger Bands using D3.js
function plotBollingerBands(dates, closePrices, upper, lower, title, elementId) {
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(`#${elementId}`).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(lower), d3.max(upper)])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(dates.map((date, index) => ({ date: date, value: closePrices[index] })))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    svg.append("path")
        .datum(dates.map((date, index) => ({ date: date, value: upper[index] })))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    svg.append("path")
        .datum(dates.map((date, index) => ({ date: date, value: lower[index] })))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
}

// plots_p2.js (part2) =================================================================================================
// plots_p2.js (part2)

// Function to plot area chart using D3.js
function plotAreaChart(dates, values, label, ylabel, title, color, elementId) {
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(`#${elementId}`).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleTime()
        .domain(d3.extent(dates))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(values), d3.max(values)])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(dates.map((date, index) => ({ date: date, value: values[index] })))
        .attr("fill", color)
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.value))
        );
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
}

// Function to calculate RSI
function calculateRSI(data, window = 14) {
    const rsi = [];
    let gain = 0;
    let loss = 0;
    for (let i = 1; i < data.length; i++) {
        const delta = data[i] - data[i - 1];
        if (delta > 0) gain += delta;
        if (delta < 0) loss -= delta;
        if (i >= window) {
            const avgGain = gain / window;
            const avgLoss = loss / window;
            const rs = avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
            gain -= (data[i - window + 1] - data[i - window]);
            loss += (data[i - window] - data[i - window + 1]);
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
