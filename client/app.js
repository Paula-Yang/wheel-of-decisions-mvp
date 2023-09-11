let options = [];

function addOption() {
    const input = document.getElementById('optionInput');
    if (input.value) {
        options.push(input.value);
        const ul = document.getElementById('optionsList');
        const li = document.createElement('li');
        li.textContent = input.value;
        ul.appendChild(li);
        input.value = '';
        drawWheel();
    }
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    const arc = 2 * Math.PI / options.length;
    for (let i = 0; i < options.length; i++) {
        ctx.beginPath();
        ctx.arc(200, 200, 190, arc * i, arc * (i + 1));
        ctx.lineTo(200, 200);
        ctx.fillStyle = i % 2 === 0 ? '#f3f3f3' : '#ccc'; // Alternate colors for visibility
        ctx.fill();
    }
}

function spinWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const spins = Math.floor(Math.random() * (10 - 3)) + 3; // Spin between 3 to 10 times
    const angle = 2 * Math.PI * spins;
    const duration = spins * 1000; // Duration in milliseconds

    let start;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const currentAngle = easeOutCubic(progress, 0, angle, duration);
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(200, 200);
        ctx.rotate(currentAngle);
        ctx.translate(-200, -200);
        drawWheel();
        ctx.restore();
        if (progress < duration) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function easeOutCubic(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}
