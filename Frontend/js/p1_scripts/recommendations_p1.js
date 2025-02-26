// recommendations_p1.js

// Function to fetch and display recommended symbols
async function fetchAndDisplayRecommendations(ticker) {
    const url = `https://yfapi.net/v6/finance/recommendationsbysymbol/${ticker}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const recommendedSymbols = data.finance.result[0].recommendedSymbols;
        displayRecommendations(recommendedSymbols);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        // UI error display
        document.getElementById('recommended-symbols').innerHTML = '<li class="error-message">No Response from Recommendations.</li>';
    }
}

// Function to display the recommended symbols in the UI card
function displayRecommendations(recommendedSymbols) {
    const ul = document.getElementById('recommended-symbols');
    ul.innerHTML = '';

    recommendedSymbols.forEach(symbol => {
        const li = document.createElement('li');
        li.textContent = `${symbol.symbol}: Score: ${symbol.score}`;
        ul.appendChild(li);
    });
}

// Ensure the script runs after the DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Fetch and display recommendations for the default selected ticker on page load
    fetchAndDisplayRecommendations(selectedTickers[0]);

    // Add event listeners for checkbox changes
    const checkboxElements = document.querySelectorAll('#suggestions input[type="checkbox"]');
    checkboxElements.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const selectedTicker = this.value;
                fetchAndDisplayRecommendations(selectedTicker);
            }
        });
    });
});
