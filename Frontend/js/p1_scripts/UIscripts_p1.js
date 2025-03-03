// UIscripts_p1.js

// // Carousel Script ============================================================
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


// Interval Button Script ======================================================
document.addEventListener("DOMContentLoaded", function() {
    const intervalButtons = document.querySelectorAll(".interval-button");

    intervalButtons.forEach(button => {
        button.addEventListener("click", function() {
            intervalButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
});


// Refresh Button Script =======================================================
// Function to update the timestamp on the refresh button
function updateButtonTimestamp() {
    let now = new Date();
    let timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('refreshButton').innerText = `Last Updated: ${timestamp}`;
}

// Event listener for the refresh button
document.getElementById('refreshButton').addEventListener('click', function() {
    updateButtonTimestamp();
    location.reload();
});

// Event listener for changes in range selector
document.getElementById('range-selector').addEventListener('change', function() {
    updateButtonTimestamp();
});

// Event listeners for changes in interval buttons
const intervalButtons = document.querySelectorAll('.interval-button');
intervalButtons.forEach(button => {
    button.addEventListener('click', function() {
        updateButtonTimestamp();
    });
});

// Update the timestamp when the page loads
window.onload = function() {
    updateButtonTimestamp();
}


// Page navigation =============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('historical').addEventListener('click', function() {
        window.location.href = 'index_p2.html';
    });

    document.getElementById('overview').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // document.getElementById('ratios').addEventListener('click', function() {
    //     window.location.href = 'index_p3.html';
    // });
});

// Range and Intervals =============================================================
document.addEventListener('DOMContentLoaded', function() {
    const rangeSelector = document.getElementById('range-selector');
    const intervalButtons = document.querySelectorAll('.interval-button');

    const rules = {
        '1d': { intervals: ['1m', '5m', '15m'], default: '5m' },
        '5d': { intervals: ['1m', '5m', '15m', '1d'], default: '15m' },
        '1mo': { intervals: ['15m', '1d', '1wk'], default: '1d' },
        '3mo': { intervals: ['1d', '1wk', '1mo'], default: '1d' },
        '6mo': { intervals: ['1d', '1wk', '1mo'], default: '1d' },
        '1y': { intervals: ['1d', '1wk', '1mo'], default: '1wk' },
        '5y': { intervals: ['1wk', '1mo'], default: '1mo' },
    };

    function updateIntervals() {
        const selectedRange = rangeSelector.value;
        const allowedIntervals = rules[selectedRange].intervals;
        const defaultInterval = rules[selectedRange].default;

        intervalButtons.forEach(button => {
            if (allowedIntervals.includes(button.textContent)) {
                button.disabled = false;
                button.classList.remove('disabled');
                if (button.textContent === defaultInterval) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } else {
                button.disabled = true;
                button.classList.add('disabled');
                button.classList.remove('active');
            }
        });
    }

    rangeSelector.addEventListener('change', updateIntervals);
    updateIntervals();
});

