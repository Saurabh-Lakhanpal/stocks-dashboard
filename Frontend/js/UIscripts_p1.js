let selectedTickers = [];

// Ensure config.js is loaded before using API_KEY
console.log('API_KEY:', API_KEY); // Log the API key

async function fetchSuggestions() {
    const query = document.getElementById('ticker-selector').value;
    if (query.length < 1) {
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('suggestions').style.display = 'none'; // Hide the suggestions box
        return;
    }

    try {
        const response = await fetch(`https://yfapi.net/v6/finance/autocomplete?region=US&lang=en&query=${query}`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data); // Log the API response

        const suggestions = data.ResultSet.Result;
        const suggestionsList = document.getElementById('suggestions');
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'block'; // Show the suggestions box

        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = suggestion.symbol;
            checkbox.onchange = () => handleSelection(checkbox);
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(suggestion.symbol));
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error); // Log any errors
    }
}

function handleSelection(checkbox) {
    if (checkbox.checked) {
        if (selectedTickers.length < 3) {
            selectedTickers.push(checkbox.value);
        } else {
            checkbox.checked = false;
            alert('You can select up to 3 tickers only.');
        }
    } else {
        selectedTickers = selectedTickers.filter(ticker => ticker !== checkbox.value);
    }

    document.getElementById('ticker-selector').value = selectedTickers.join(', ');
}

// Hide the suggestions box when clicking outside
document.addEventListener('click', function(event) {
    const suggestionsList = document.getElementById('suggestions');
    const searchBox = document.getElementById('ticker-selector');
    if (!suggestionsList.contains(event.target) && !searchBox.contains(event.target)) {
        suggestionsList.style.display = 'none';
    }
});


// This script allows us to select
document.addEventListener("DOMContentLoaded", function() {
    const intervalButtons = document.querySelectorAll(".interval-button");

    intervalButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active class from all buttons
            intervalButtons.forEach(btn => btn.classList.remove("active"));
            
            // Add active class to the clicked button
            this.classList.add("active");
        });
    });
});

// This is the Carousel

document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const portfolio = document.querySelector('.portfolio');
    let currentPosition = 0;

    prevButton.addEventListener('click', function() {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentPosition < portfolio.children.length - 4) {
            currentPosition++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        portfolio.style.transform = `translateX(-${currentPosition * 25}%)`;
    }
});
