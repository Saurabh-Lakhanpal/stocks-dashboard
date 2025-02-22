const API_KEY = "dcac4212e4deb53e17d4435a56d0db27";

// Function to fetch stock data
async function fetchStockData(symbol, dateFrom, dateTo) {
    const url = `http://api.marketstack.com/v1/eod?access_key=${API_KEY}&symbols=${symbol}&date_from=${dateFrom}&date_to=${dateTo}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
}

// Function to calculate 50-day moving average
function calculateMA(data, period = 50) {
    return data.map((_, index, array) => {
        const start = Math.max(0, index - period + 1);
        const subset = array.slice(start, index + 1);
        const sum = subset.reduce((acc, val) => acc + val.close, 0);
        return sum / subset.length;
    });
}

// Function to update the chart
function updateChart(symbol) {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    fetchStockData(symbol, oneYearAgo.toISOString().split('T')[0], today.toISOString().split('T')[0])
        .then(data => {
            if (!data || data.length === 0) {
                console.error('No data received from API');
                return;
            }

            const ohlc = data.map(d => ({
                x: new Date(d.date),
                y: [d.open, d.high, d.low, d.close]
            }));

            const volume = data.map(d => ({
                x: new Date(d.date),
                y: d.volume
            }));

            const ma50 = calculateMA(data);

            // Update the chart using ApexCharts
            const options = {
                series: [
                    {
                        name: 'Candlestick',
                        type: 'candlestick',
                        data: ohlc
                    },
                    {
                        name: 'Volume',
                        type: 'bar',
                        data: volume
                    },
                    {
                        name: '50-day MA',
                        type: 'line',
                        data: ma50.map((value, index) => ({
                            x: new Date(data[index].date),
                            y: value
                        }))
                    }
                ],
                chart: {
                    height: 350,
                    type: 'line'
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#00B746', // Green for upward candles
                            downward: '#EF403C' // Red for downward candles
                        },
                        wick: {
                            useFillColor: true // Ensures wicks use the same color as candles
                        },
                        barWidth: '60%' // Adjusts spacing between candles (smaller value increases space)
                    }
                },
                stroke: {
                    width: [1, 1, 2] // Thinner wicks for candlesticks and volume bars; thicker for MA line
                },
                title: {
                    text: `${symbol} Stock Price`,
                    align: 'left'
                },
                xaxis: {
                    type: 'datetime',
                    tickPlacement: 'on' // Ensures proper spacing between candlesticks
                },
                yaxis: [
                    {
                        title: {
                            text: 'Price'
                        }
                    },
                    {
                        opposite: true,
                        title: {
                            text: 'Volume'
                        }
                    }
                ]
            };

            const chartElement = document.querySelector("#plot");
             if(chartElement){
                chartElement.innerHTML = ''; // Clear previous chart before rendering a new one
            }
            const chart = new ApexCharts(chartElement, options);
            chart.render();
        });
}

document.addEventListener('DOMContentLoaded', () => {
      const chartElement = document.querySelector("#plot");
    if(chartElement){
        chartElement.innerHTML = ''; // Clear previous chart before rendering a new one
    }
    updateChart('AAPL');
});
