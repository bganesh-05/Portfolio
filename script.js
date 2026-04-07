// Bubble Cursor Logic
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Wait a tiny bit and use simple animation or style update for outline
    outline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 150, fill: "forwards" });
});

// Interactive elements hover effect for cursor
const iterables = document.querySelectorAll('a, button, input, textarea');

iterables.forEach((el) => {
    el.addEventListener('mouseover', () => {
        outline.style.width = '60px';
        outline.style.height = '60px';
        outline.style.borderColor = 'var(--accent2)';
        dot.style.backgroundColor = 'var(--accent2)';
    });

    el.addEventListener('mouseleave', () => {
        outline.style.width = '40px';
        outline.style.height = '40px';
        outline.style.borderColor = 'var(--accent)';
        dot.style.backgroundColor = 'var(--accent)';
    });
});

// Form Submission Context
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message successfully initialized. (This is a demo, please add your backend service)');
    this.reset();
});
