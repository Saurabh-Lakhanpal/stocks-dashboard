// Carousel Script ============================================================
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
            // Remove active class from all buttons
            intervalButtons.forEach(btn => btn.classList.remove("active"));
            
            // Add active class to the clicked button
            this.classList.add("active");
        });
    });
});


// Refresh Button Script =======================================================
function updateButtonTimestamp() {
    let now = new Date();
    let timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('refreshButton').innerText = `Last Updated: ${timestamp}`;
}

document.getElementById('refreshButton').addEventListener('click', function() {
    updateButtonTimestamp();
    location.reload();
});

// Initialize the button with the current timestamp on page load
window.onload = function() {
    updateButtonTimestamp();
}

// Page navigation =============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('historical').addEventListener('click', function() {
        window.location.href = 'index_p2.html';
    });

    document.getElementById('overview').addEventListener('click', function() {
        window.location.href = 'index_p1.html';
    });

    document.getElementById('ratios').addEventListener('click', function() {
        window.location.href = 'index_p3.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const rangeSelector = document.getElementById('range-selector');
    const intervalButtons = document.querySelectorAll('.interval-button');

    const rules = {
        'range1': ['1m', '5m', '15m'],
        'range2': ['1m', '5m', '15m', '1d'],
        'range3': ['15m', '1d', '1wk'],
        'range4': ['1d', '1wk', '1mo'],
        'range5': ['1d', '1wk', '1mo'],
        'range6': ['1d', '1wk', '1mo'],
        'range7': ['1wk', '1mo'],
    };


    // Range and Intervals =============================================================
    function updateIntervals() {
        const selectedRange = rangeSelector.value;
        const allowedIntervals = rules[selectedRange];

        intervalButtons.forEach(button => {
            if (allowedIntervals.includes(button.textContent)) {
                button.disabled = false;
                button.classList.remove('disabled');
            } else {
                button.disabled = true;
                button.classList.add('disabled');
            }
        });
    }

    rangeSelector.addEventListener('change', updateIntervals);

    // Initial call to set intervals based on the default selected range
    updateIntervals();
});
