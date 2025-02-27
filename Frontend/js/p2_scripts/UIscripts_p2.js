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

    function handleCheckboxChange(event) {
        const target = event.target;

        if (target.id === 'show-rsi' || target.id === 'show-bollinger') {
            if (rsiCheckbox.checked && bollingerCheckbox.checked) {
                historicalCheckbox.checked = false;
                drawdownCheckbox.checked = false;
            }
        } else {
            rsiCheckbox.checked = false;
            bollingerCheckbox.checked = false;

            if (target.checked) {
                checkboxes.forEach(checkbox => {
                    if (checkbox !== target) {
                        checkbox.checked = false;
                    }
                });
            }
        }

        if (historicalCheckbox.checked) {
            if (rsiCheckbox.checked || bollingerCheckbox.checked || drawdownCheckbox.checked) {
                historicalCheckbox.checked = false;
            }
        }

        if (drawdownCheckbox.checked) {
            if (rsiCheckbox.checked || bollingerCheckbox.checked || historicalCheckbox.checked) {
                drawdownCheckbox.checked = false;
            }
        }
    }
});

// Slider =====================================================================
const slider = document.getElementById('plot_p2');
const toggleButton = document.getElementById('toggleButton');
let isDragging = false;
let startX = 0;
let currentX = 0;
const containerWidth = 450; // 150px * 3
const sliderWidth = 1200; // 400px * 3

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

// Keyboard event listeners
slider.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      currentX = Math.max(currentX - 10, containerWidth - sliderWidth);
      slider.style.left = `${currentX}px`;
      if (isSliding) {
        slider.style.animation = 'none';
      }
      break;
    case 'ArrowLeft':
      currentX = Math.min(currentX + 10, 0);
      slider.style.left = `${currentX}px`;
      if (isSliding) {
        slider.style.animation = 'none';
      }
      break;
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





