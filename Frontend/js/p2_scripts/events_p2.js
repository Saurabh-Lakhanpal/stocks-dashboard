// Event listener for the "Plot" button
document.getElementById('plot-button').addEventListener('click', function () {
    const ticker = document.getElementById('ticker-selector').value;
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;

    fetchAndPlotData(ticker, startDate, endDate);
});


document.addEventListener("DOMContentLoaded", function () {
    const refreshButton = document.getElementById('refreshButton');
    const plotButton = document.getElementById('plot-button');

    // Ensure the elements exist before adding event listeners
    if (refreshButton) {
        refreshButton.addEventListener('click', function () {
            const ticker = document.getElementById('ticker-selector').value;
            const startDate = document.getElementById('start_date').value;
            const endDate = document.getElementById('end_date').value;
            fetchAndPlotData(ticker, startDate, endDate);
        });
    }

    if (plotButton) {
        plotButton.addEventListener('click', function () {
            const ticker = document.getElementById('ticker-selector').value;
            const startDate = document.getElementById('start_date').value;
            const endDate = document.getElementById('end_date').value;
            fetchAndPlotData(ticker, startDate, endDate);
        });
    }
});
