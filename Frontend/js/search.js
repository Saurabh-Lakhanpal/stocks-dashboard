let selectedTickers = [];
let selectedTickerNames = {};
let start_date = ["2014-01-01"];
let end_date = ["2014-06-30"];

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
        suggestionsList.style.display = 'block'; 

        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = suggestion.symbol;
            checkbox.dataset.name = suggestion.name; 
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

document.addEventListener('DOMContentLoaded', function() {
    var startDateInput = document.getElementById('start_date');
    var endDateInput = document.getElementById('end_date');

    startDateInput.value = start_date[0];
    endDateInput.value = end_date[0];

    startDateInput.addEventListener('change', function() {
        var startDate = this.value;
        if (startDate < "2013-02-08" || startDate > "2018-02-07") {
            alert("Start date must be within the range of 2013-02-08 to 2018-02-07.");
            this.value = start_date[0];
            return;
        }
        console.log("Start date: " + startDate);
        start_date[0] = startDate;
    });

    endDateInput.addEventListener('change', function() {
        var endDate = this.value;
        if (endDate < "2013-02-08" || endDate > "2018-02-07") {
            alert("End date must be within the range of 2013-02-08 to 2018-02-07.");
            this.value = end_date[0];
            return;
        }
        console.log("End date: " + endDate);
        end_date[0] = endDate;
    });
});
