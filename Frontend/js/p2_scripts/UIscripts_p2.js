// UIscripts_p2.js

// Refresh Button Script =======================================================
function updateButtonTimestamp() {
    let now = new Date();
    let timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('refreshButton').innerText = `Last Updated: ${timestamp}`;
}

document.getElementById('refreshButton').addEventListener('click', function() {
    updateButtonTimestamp();
});

// Page navigation =============================================================
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code here
    document.getElementById('refreshButton').addEventListener('click', function() {
        updateButtonTimestamp();
    });
    document.getElementById('historical').addEventListener('click', function() {
        window.location.href = 'index_p2.html';
    });
    document.getElementById('overview').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

// Checkbox rules =============================================================
document.addEventListener('DOMContentLoaded', function() {
    const historicalCheckbox = document.getElementById('show-historical-price');
    const rsiCheckbox = document.getElementById('show-rsi');
    const bollingerCheckbox = document.getElementById('show-bollinger');
    const drawdownCheckbox = document.getElementById('show-drawdown');
    const checkboxes = [historicalCheckbox, rsiCheckbox, bollingerCheckbox, drawdownCheckbox];

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    document.getElementById('plot-button').addEventListener('click', function() {
        const selectedTicker = selectedTickers[0];
        const showHistoricalPrice = document.getElementById('show-historical-price').checked;
        const showRSI = document.getElementById('show-rsi').checked;
        const showBollinger = document.getElementById('show-bollinger').checked;
        const showDrawdown = document.getElementById('show-drawdown').checked;
        plotStockAnalysis(selectedTicker, start_date, end_date, showHistoricalPrice, showRSI, showBollinger, showDrawdown);
    });

    function handleCheckboxChange(event) {
        const target = event.target;

        // Disable concurrent selection of RSI and Bollinger
        if (target.id === 'show-rsi' && target.checked) {
            bollingerCheckbox.checked = false;
        } else if (target.id === 'show-bollinger' && target.checked) {
            rsiCheckbox.checked = false;
        }

        // Deselect other checkboxes when one is selected
        if (target.checked) {
            checkboxes.forEach(checkbox => {
                if (checkbox !== target) {
                    checkbox.checked = false;
                }
            });
        }
    }
});


// // Slider =====================================================================
const slider = document.getElementById('plot_p2');
const toggleButton = document.getElementById('toggleButton');
let isDragging = false;
let startX = 0;
let currentX = 0;
const containerWidth = 450; // 150px * 3
const sliderWidth = 3500; 

let isSliding = true;

// Dragging event listeners
slider.addEventListener('mousedown', (e) => {
isDragging = true;
startX = e.clientX - slider.offsetLeft;
slider.style.transition = 'none';
if (isSliding) {
  slider.style.animation = 'none';
}
});

document.addEventListener('mousemove', (e) => {
if (isDragging) {
  currentX = e.clientX - startX;
  currentX = Math.max(containerWidth - sliderWidth, Math.min(currentX, 0));
  slider.style.left = `${currentX}px`;
}
});

document.addEventListener('mouseup', () => {
if (isDragging) {
  isDragging = false;
  slider.style.transition = 'left 0.5s ease-in-out';
  if (isSliding) {
    slider.style.animation = 'slide 60s linear infinite alternate';
  }
}
});

// Toggle button event listener
toggleButton.addEventListener('click', () => {
isSliding = !isSliding;
if (isSliding) {
  slider.style.animation = 'slide 60s linear infinite alternate';
  toggleButton.textContent = 'Stop Sliding';
} else {
  slider.style.animation = 'none';
  toggleButton.textContent = 'Start Sliding';
}
});
