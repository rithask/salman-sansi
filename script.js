window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2600);
});

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let W, H;
const lanterns = [];
const particles = [];

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Lantern {
    constructor() {
        this.reset();
        this.y = Math.random() * H;
    }

    reset() {
        this.x = Math.random() * W;
        this.y = H + 100;
        this.size = 28 + Math.random() * 22;
        this.speedY = 0.25 + Math.random() * 0.35;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.07 + Math.random() * 0.1;
        this.rotation = (Math.random() - 0.5) * 0.1;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;
        this.angle = 0;
        this.swaySpeed = 0.002 + Math.random() * 0.003;
        this.swayAmp = 0.4 + Math.random() * 0.6;
        this.scale = 0.5 + Math.random() * 0.6;
        this.glowIntensity = 0.5 + Math.random() * 0.5;
        this.hue = [190, 340, 160, 45][Math.floor(Math.random() * 4)]; // teal, ruby, emerald, gold
    }

    drawLantern(x, y, size, alpha, rot) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = alpha;

        const s = size;

        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.4);
        grd.addColorStop(0, `hsla(${this.hue}, 90%, 75%, ${0.15 * this.glowIntensity})`);
        grd.addColorStop(0.5, `hsla(${this.hue}, 80%, 65%, ${0.06 * this.glowIntensity})`);
        grd.addColorStop(1, `hsla(${this.hue}, 80%, 50%, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(0, 0, s * 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(192, 154, 83, ${alpha * 0.9})`; // Antique Gold
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.5);
        ctx.lineTo(0, -s * 0.9);
        ctx.stroke();

        ctx.strokeStyle = `rgba(200, 80, 60, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -s * 0.9, s * 0.12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        // Pointy Moorish/Turkish lamp shape
        ctx.moveTo(0, -s * 0.9);
        ctx.quadraticCurveTo(s * 0.7, -s * 0.4, s * 0.6, s * 0.3);
        ctx.quadraticCurveTo(0, s * 0.9, -s * 0.6, s * 0.3);
        ctx.quadraticCurveTo(-s * 0.7, -s * 0.4, 0, -s * 0.9);

        const bodyGrd = ctx.createRadialGradient(-s * 0.1, -s * 0.15, 0, 0, 0, s * 0.7);
        bodyGrd.addColorStop(0, `hsla(${this.hue}, 90%, 80%, ${alpha * 0.95})`);
        bodyGrd.addColorStop(0.35, `hsla(${this.hue}, 80%, 55%, ${alpha * 0.85})`);
        bodyGrd.addColorStop(0.7, `hsla(${this.hue}, 90%, 35%, ${alpha * 0.8})`);
        bodyGrd.addColorStop(1, `hsla(${this.hue}, 100%, 20%, ${alpha * 0.6})`);
        ctx.fillStyle = bodyGrd;
        ctx.fill();
        ctx.strokeStyle = `rgba(192, 154, 83, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Intricate line details (mosaic lines)
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.9);
        ctx.lineTo(0, s * 0.7);
        ctx.moveTo(-s * 0.4, -s * 0.2);
        ctx.lineTo(s * 0.4, -s * 0.2);
        ctx.moveTo(-s * 0.5, s * 0.2);
        ctx.lineTo(s * 0.5, s * 0.2);
        ctx.strokeStyle = `rgba(192, 154, 83, ${alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = `rgba(255, 245, 210, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.ellipse(0, s * 0.12, s * 0.18, s * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.angle += this.rotationSpeed;

        if (this.y < -120) {
            this.reset();
        }
    }

    draw() {
        this.drawLantern(this.x, this.y, this.size, this.opacity, this.angle);
    }
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * W;
        this.y = H + Math.random() * 80;
        this.size = 1 + Math.random() * 2.3;
        this.speedY = 0.2 + Math.random() * 0.25;
        this.alpha = 0.06 + Math.random() * 0.18;
        this.offset = Math.random() * Math.PI * 2;
    }

    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01 + this.offset) * 0.22;
        if (this.y < -20) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 220, 160, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 12; i += 1) {
    lanterns.push(new Lantern());
}
for (let i = 0; i < 60; i += 1) {
    particles.push(new Particle());
}

function animateScene() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(14, 11, 7, 0.18)';
    ctx.fillRect(0, 0, W, H);

    particles.forEach((p) => {
        p.update();
        p.draw();
    });

    lanterns.forEach((lantern) => {
        lantern.update();
        lantern.draw();
    });

    requestAnimationFrame(animateScene);
}

animateScene();

const fadeItems = document.querySelectorAll('.fade-in');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

fadeItems.forEach((item) => revealObserver.observe(item));

const eventDate = new Date('May 10, 2026 17:00:00');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

function shareOnWhatsApp(event) {
    event.preventDefault();
    const text = `You are warmly invited to the Reception of Salmanul Faiz and Sansi on 10 May 2026 at North View Auditorium, Kunnamangalam.`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + window.location.href)}`;
    window.open(shareUrl, '_blank');
}