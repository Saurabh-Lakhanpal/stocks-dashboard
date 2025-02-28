// ratios_p2.js
async function fetchFinancialRatios(ticker) {
    console.log(`Fetching financial ratios for ticker: ${ticker}`);

    try {
        const response = await fetch(`https://yfapi.net/v11/finance/quoteSummary/${ticker}?modules=summaryDetail,financialData,defaultKeyStatistics`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log('Financial ratios data received:', data);

        // Extract and plot financial ratios
        plotFinancialRatiosChart(data, 'ratios');

        // Re-plot the chart when the window is resized for responsiveness
        window.addEventListener('resize', () => plotFinancialRatiosChart(data, 'ratios'));

        return data;
    } catch (error) {
        console.error("Error fetching financial ratios:", error);
        document.getElementById('ratios').innerHTML = '<p class="error-message">Error fetching from Quote Summary.</p>';
        return null;
    }
}

function updateRatios() {
    if (selectedTickers.length > 0) {
        fetchFinancialRatios(selectedTickers[0]);
    }
}

// Call updateRatios to fetch ratios on page load
document.addEventListener('DOMContentLoaded', function () {
    updateRatios();
});


function convertToPercentage(value) {
    return (value * 100).toFixed(2); // Convert to percentage and format to two decimal places
}

function plotBarChart(values, labels, elementId) {
    d3.select(`#${elementId}`).selectAll("*").remove();

    const margin = { top: 10, right: 30, bottom: 10, left: 10 };
    const containerWidth = document.getElementById(elementId).offsetWidth;
    const containerHeight = document.getElementById(elementId).offsetHeight;

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    console.log(`Plotting horizontal bar chart in #${elementId} with dimensions ${width}x${height}`);

    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert values to percentages only for current ratio
    const percentageValues = values.map((value, index) => {
        if (labels[index] === "Current Ratio") {
            return convertToPercentage(value);
        }
        return value;
    });

    const xDomain = [0, d3.max(percentageValues, d => d * 1.2)];

    const x = d3.scaleLinear()
        .domain(xDomain)
        .nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(labels)
        .range([0, height])
        .padding(0.4);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height))
        .selectAll("line")
        .attr("stroke", "none");

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text") // Remove y-axis labels
        .remove();

    svg.selectAll(".bar")
        .data(percentageValues)
        .enter().append("rect")
        .attr("y", (d, i) => y(labels[i]))
        .attr("x", 0)
        .attr("width", d => x(d))
        .attr("height", y.bandwidth())
        .attr("fill", "#1985C3");

    // Add text boxes with white background
    svg.selectAll(".bar-label")
        .data(percentageValues)
        .enter().append("rect")
        .attr("x", 10)
        .attr("y", (d, i) => y(labels[i]) + y.bandwidth() / 2 - 10)
        .attr("width", 160)
        .attr("height", 20)
        .attr("fill", "white");

    svg.selectAll(".bar-label")
        .data(percentageValues)
        .enter().append("text")
        .attr("x", 15)  // Add a margin from the y-axis
        .attr("y", (d, i) => y(labels[i]) + y.bandwidth() / 2 + 4) // Adjust position to align with bars
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .style("fill", "black") // Set the label color to black
        .text((d, i) => labels[i] === "Current Ratio" ? `${labels[i]}: ${percentageValues[i]}%` : `${labels[i]}: ${percentageValues[i]}`);
}

function plotFinancialRatiosChart(data, elementId) {
    const financialData = data?.quoteSummary?.result?.[0]?.financialData;
    const defaultMetrics = data?.quoteSummary?.result?.[0]?.defaultKeyStatistics;

    if (!financialData && !defaultMetrics) {
        console.error("Financial data missing:", data);
        d3.select(`#${elementId}`).append("p").text("Financial data not available.");
        return;
    }

    const peRatio = defaultMetrics?.forwardPE?.raw || financialData?.forwardPE?.raw || 0;
    const debtToEquity = financialData?.debtToEquity?.raw || 0;
    const currentRatio = financialData?.currentRatio?.raw || 0;

    console.log("Financial Ratios - P/E:", peRatio, ", Current:", currentRatio, ", Debt/Equity:", debtToEquity);

    plotBarChart([peRatio, currentRatio, debtToEquity], ["P/E Ratio", "Current Ratio", "Debt to Equity"], elementId);
}

// Call the fetchFinancialRatios function once the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchFinancialRatios('AAPL'); // Replace 'AAPL' with any ticker symbol
});
