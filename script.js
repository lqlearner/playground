const canvas = document.getElementById('solarSystemCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawStarfield() {
    // Draw starfield here
}

function drawSolarSystem() {
    // Draw solar system here
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStarfield();
    drawSolarSystem();
    requestAnimationFrame(animate);
}

animate();