let selectedTickers = [];
let selectedTickerNames = {}; // Store ticker names

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

        const suggestions = data.ResultSet.Result;
        const suggestionsList = document.getElementById('suggestions');
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'block'; // Show the suggestions box

        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = suggestion.symbol;
            checkbox.dataset.name = suggestion.name; // Store company name in data attribute
            checkbox.onchange = () => handleSelection(checkbox);
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(suggestion.symbol));
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function handleSelection(checkbox) {
    if (checkbox.checked) {
        if (selectedTickers.length < 5) {
            selectedTickers.push(checkbox.value);
            selectedTickerNames[checkbox.value] = checkbox.dataset.name; // Store the company name
            updateSelectedList();
        } else {
            checkbox.checked = false;
            alert('You can select up to 5 tickers only.');
        }
    } else {
        selectedTickers = selectedTickers.filter(ticker => ticker !== checkbox.value);
        delete selectedTickerNames[checkbox.value]; // Remove the company name
        updateSelectedList();
    }
}

function updateSelectedList() {
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    selectedTickers.forEach(ticker => {
        const li = document.createElement('li');
        li.textContent = ticker; // Use ticker symbol instead of company name
        selectedList.appendChild(li);
    });

    if (selectedTickers.length > 0) {
        // Display the name of the first selected ticker
        document.getElementById('selected-ticker').textContent = selectedTickerNames[selectedTickers[0]];
    } else {
        document.getElementById('selected-ticker').textContent = '';
    }
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
