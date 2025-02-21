let selectedTickers = [];

// Ensure config.js is loaded before using API_KEY
console.log('API_KEY:', API_KEY); // Log the API key

async function fetchSuggestions() {
    const query = document.getElementById('ticker-selector').value;
    if (query.length < 1) {
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('suggestions').style.display = 'none';
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
        if (selectedTickers.length < 5) {
            selectedTickers.push(checkbox.value);
            updateSelectedList();
        } else {
            checkbox.checked = false;
            alert('You can select up to 5 tickers only.');
        }
    } else {
        selectedTickers = selectedTickers.filter(ticker => ticker !== checkbox.value);
        updateSelectedList();
    }
}

function updateSelectedList() {
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    selectedTickers.forEach(ticker => {
        const li = document.createElement('li');
        li.textContent = ticker;
        selectedList.appendChild(li);
    });
}

function showSuggestions() {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.style.display = 'block';
}

document.addEventListener('click', function(event) {
    const suggestionsList = document.getElementById('suggestions');
    const searchBox = document.getElementById('ticker-selector');
    if (!suggestionsList.contains(event.target) && !searchBox.contains(event.target)) {
        suggestionsList.style.display = 'none';
    }
});

// Carousel Script
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

// Interval Button Script
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
