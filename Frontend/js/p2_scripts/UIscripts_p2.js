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


