// layers_p1.js

// Function to handle candlestick data
function handleCandlestickData(data) {
    console.log('handleCandlestickData function called');
    if (!data) {
        console.error('No data received');
        document.getElementById('plot').innerHTML = '<p class="error-message">Error fetching Candlestick data.</p>';
        return;
    }

    console.log('Data received:', data);

    const historicalData = data.chart.result[0].indicators.quote[0].close.map((price, index) => ({
        date: new Date(data.chart.result[0].timestamp[index] * 1000),
        open: data.chart.result[0].indicators.quote[0].open[index],
        high: data.chart.result[0].indicators.quote[0].high[index],
        low: data.chart.result[0].indicators.quote[0].low[index],
        close: data.chart.result[0].indicators.quote[0].close[index],
        volume: data.chart.result[0].indicators.quote[0].volume[index]
    }));

    console.log('Historical data processed:', historicalData);

    plotCandlestickLayer(historicalData);
}

// Function to plot candlestick layer
function plotCandlestickLayer(data) {
    console.log('plotCandlestickLayer function called with data:', data);

    const container = d3.select("#plot").node();
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height;

    console.log('Container dimensions:', width, height);

    const margin = { top: 10, right: 100, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#plot svg g");
    console.log('SVG element selected:', svg);

    const x = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, innerWidth])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
        .range([innerHeight, 0]);

    console.log('Scales created:', x, y);

    const candlestickWidth = x.bandwidth();
    console.log('Candlestick width:', candlestickWidth);

    const candlesticks = svg.selectAll(".candlestick-layer")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "candlestick-layer")
        .attr("x", d => x(d.date))
        .attr("y", d => y(Math.max(d.open, d.close)))
        .attr("width", candlestickWidth * 0.5)
        .attr("height", d => {
            const height = Math.abs(y(d.open) - y(d.close));
            console.log('Candlestick height:', height);
            return height;
        })
        .attr("fill", d => d.open > d.close ? "#DB0A40" : "#0A3064")
        .attr("rx", 5)  
        .attr("ry", 5)
        .attr("opacity", 0.8);  

    // Hover tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px");

    candlesticks.on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 0.7);
            tooltip.html(`Date: ${d.date.toLocaleDateString()}<br>Open: ${d.open}<br>High: ${d.high}<br>Low: ${d.low}<br>Close: ${d.close}`)
                .style("visibility", "visible");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", `${event.pageY - 10}px`).style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 1);
            tooltip.style("visibility", "hidden");
        });

    console.log('Candlesticks added:', candlesticks);
}
