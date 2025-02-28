// plots_p2.js (part1)===================================================================================

// Function to plot stock analysis
// Function to plot stock analysis
async function plotStockAnalysis(ticker, startDate, endDate, showHistoricalPrice, showRSI, showBollinger, showDrawdown) {
    const url = `http://127.0.0.1:5000/api/v1.0/sp500?ticker=${ticker}&start_date=${startDate}&end_date=${endDate}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        
        const data = await response.json();

        if (data.length === 0) {
            console.log(`No data found for ticker: ${ticker}`);
            return;
        }

        // Ensure the data is sorted by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Filter out invalid or NaN values
        const validData = data.filter(d => !isNaN(d.close_price) && !isNaN(d.volume));
        
        if (validData.length === 0) {
            console.error('No valid data to plot for ticker:', ticker);
            return;
        }

        // Now that validData is properly initialized, extract values
        const dates = validData.map(d => new Date(d.date));
        const closePrices = validData.map(d => d.close_price);

        // Add check for NaN values in closePrices and dates
        const cleanData = dates.filter((date, index) => !isNaN(closePrices[index]) && closePrices[index] !== null);

        if (cleanData.length === 0) {
            console.error('No valid data after cleaning.');
            return;
        }

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
            console.log(rsiData);
        }

        // Plot Bollinger Bands
        if (showBollinger) {
            const bollingerBands = calculateBollingerBands(closePrices, 20);  // Assuming a window size of 20
            plotBollingerBands(dates, closePrices, bollingerBands, 'Bollinger Bands for ' + ticker, 'plot_p2');
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

    if (!Array.isArray(prices) || prices.length === 0) {
        console.error('Bollinger Bands data is invalid or empty');
        return;
    }
    
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

    // Clean data: remove NaN or null values before plotting
    const cleanData = dates.filter((date, index) => {
        return !isNaN(closePrices[index]) && closePrices[index] !== null &&
               !isNaN(upper[index]) && upper[index] !== null &&
               !isNaN(lower[index]) && lower[index] !== null;
    });

    if (cleanData.length === 0) {
        console.error('Bollinger Bands data contains invalid values.');
        return;
    }

    // Plot Close Prices
    svg.append("path")
        .datum(cleanData.map((date, index) => ({ date: date, value: closePrices[index] })))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    // Plot Upper Bollinger Band
    svg.append("path")
        .datum(cleanData.map((date, index) => ({ date: date, value: upper[index] })))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value))
        );

    // Plot Lower Bollinger Band
    svg.append("path")
        .datum(cleanData.map((date, index) => ({ date: date, value: lower[index] })))
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
function calculateRSI(prices, period = 14) {
    let gains = [];
    let losses = [];
    let avgGain = 0;
    let avgLoss = 0;

    // Calculate initial gains and losses
    for (let i = 1; i < period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) {
            gains.push(change);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(-change);
        }
    }

    avgGain = gains.reduce((acc, val) => acc + val, 0) / period;
    avgLoss = losses.reduce((acc, val) => acc + val, 0) / period;

    // Calculate RSI for the rest of the data
    const rsiValues = [];
    for (let i = period; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        rsiValues.push(rsi);
    }

    return rsiValues;
}


 // Function to calculate Bollinger Bands
 function calculateBollingerBands(closePrices, windowSize) {
    const rollingMean = [];
    const rollingStd = [];
    const upper = [];
    const lower = [];

    for (let i = 0; i < closePrices.length; i++) {
        if (i >= windowSize - 1) {
            const windowSlice = closePrices.slice(i - windowSize + 1, i + 1);
            const mean = d3.mean(windowSlice);
            const std = d3.deviation(windowSlice);
            rollingMean.push(mean);
            rollingStd.push(std);
            upper.push(mean + 2 * std);
            lower.push(mean - 2 * std);
        } else {
            rollingMean.push(null);
            rollingStd.push(null);
            upper.push(null);
            lower.push(null);
        }
    }

    return { upper, lower };
}

// Function to calculate Drawdown
function calculateDrawdown(data) {
    const drawdown = [];
    let peak = data[0];
    for (let i = 0; i < data.length; i++) {
        peak = Math.max(peak, data[i]);
        const drawdownVal = (data[i] - peak) / peak;
        drawdown.push(drawdownVal);
    }
    return drawdown;
}
