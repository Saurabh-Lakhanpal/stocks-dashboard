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
