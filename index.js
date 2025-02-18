const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lightSource = { x: 100, y: 100, radius: 50 };
const circleObject = { x: 1500, y: 500, radius: 100 };
const RAYS_NUMBER = 100; // Reduced for better performance
const rays = [];
const RAY_COLOR = "white";
let dragging = false;
let circleObjectSpeedY = -1;

class Ray {
  constructor(startX, startY, angle) {
    this.startX = startX;
    this.startY = startY;
    this.angle = angle;
  }
}

const generateRays = (lightSource, raysNumber) => {
  const newRays = [];
  for (let i = 0; i < raysNumber; i++) {
    newRays.push(
      new Ray(lightSource.x, lightSource.y, (i * Math.PI * 2) / raysNumber)
    );
  }
  return newRays;
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Light Source
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(lightSource.x, lightSource.y, lightSource.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw Circle Object
  ctx.fillStyle = "blue";

  ctx.beginPath();
  circleObject.y += circleObjectSpeedY;
  if (circleObject.y - circleObject.radius < 0) {
    circleObjectSpeedY = -circleObjectSpeedY;
  }

  if (circleObject.y + circleObject.radius > canvas.height) {
    circleObjectSpeedY = -circleObjectSpeedY;
  }

  ctx.arc(circleObject.x, circleObject.y, circleObject.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw Rays efficiently
  const rays = generateRays(lightSource, RAYS_NUMBER);
  ctx.strokeStyle = RAY_COLOR;
  ctx.lineWidth = 0.5;
  ctx.beginPath();

  for (let ray of rays) {
    let xDraw = ray.startX;
    let yDraw = ray.startY;
    let endOfScreen = false;
    let step = 2; // Increase step size for better performance

    while (!endOfScreen) {
      xDraw += step * Math.cos(ray.angle);
      yDraw += step * Math.sin(ray.angle);

      // Check if ray goes out of bounds
      if (
        xDraw < 0 ||
        xDraw > canvas.width ||
        yDraw < 0 ||
        yDraw > canvas.height
      ) {
        endOfScreen = true;
      } else {
        ctx.moveTo(ray.startX, ray.startY);
        ctx.lineTo(xDraw, yDraw);
      }

      // Check if ray hits the circle object
      const distance_squared =
        Math.pow(xDraw - circleObject.x, 2) +
        Math.pow(yDraw - circleObject.y, 2);
      if (distance_squared < Math.pow(circleObject.radius, 2)) {
        break;
      }
    }
  }

  ctx.stroke();
}

// Smooth animation with requestAnimationFrame
function animate() {
  requestAnimationFrame(animate);
  draw();
}

// Mouse Events
canvas.addEventListener("mousedown", (event) => {
  const dx = event.clientX - lightSource.x;
  const dy = event.clientY - lightSource.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= lightSource.radius) {
    dragging = true;
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (dragging) {
    lightSource.x = event.clientX;
    lightSource.y = event.clientY;
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
});

// Start animation loop
animate();
