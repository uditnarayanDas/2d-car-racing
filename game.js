const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const laneCount = 3;
const carWidth = 60;
const carHeight = 120;

const creditsBtn = document.getElementById("creditsBtn");
const creditsModal = document.getElementById("creditsModal");
const closeBtn = document.querySelector(".close");

const playerImg = new Image();
const enemyImg = new Image();
const roadImg = new Image();
const laneWidth = canvas.width / 3;

const emojiContainer = document.querySelector('.emoji-container');
const carEmojis = ['🚗', '🚕', '🏎️'];

playerImg.src = "mycar.png";
enemyImg.src = "10382555.png";
roadImg.src = "road.png";

let loaded = 0;
const total = 3;


function checkLoaded() {
  loaded++;
  if (loaded === total) {
    initGame();
  }
}

playerImg.onload = checkLoaded;
enemyImg.onload = checkLoaded;
roadImg.onload = checkLoaded;


let player = {};
let enemyCars = [];
let spawnTimer = 0;
let gameRunning = false;
let playerName = "";
let backgroundY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function initGame() {
    const carWidth = 80;
    const carHeight = 140;
  player = {
    lane: 1,
    y: canvas.height - carHeight - 10,
    carWidth: carWidth,
    speed: 4,
    distance: 0
  };
  enemyCars = [];
  spawnTimer = 0;
  backgroundY = 0;
  gameRunning = true;
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft" && player.lane > 0) {
    player.lane--;
    console.log("Moved Left, lane:", player.lane);
  }

  if (e.key === "ArrowRight" && player.lane < laneCount - 1) {
    player.lane++;
    console.log("Moved Right, lane:", player.lane);
  }
});

// function createEmoji() {
//     const emoji = document.createElement('div');
//     emoji.classList.add('emoji');
//     emoji.innerText = carEmojis[Math.floor(Math.random() * carEmojis.length)];
//     emoji.style.left = Math.random() * 100 + 'vw';
//     emoji.style.animationDuration = (3 + Math.random() * 5) + 's';
//     emoji.style.fontSize = (1.5 + Math.random() * 2.5) + 'rem';
//     emojiContainer.appendChild(emoji);

//     setTimeout(() => {
//       emoji.remove();
//     }, 8000);
//   }

//   setInterval(createEmoji, 300);

function update() {
  if (!gameRunning) return;

  // Scroll background
  backgroundY += player.speed;
  if (backgroundY >= canvas.height) backgroundY = 0;
  ctx.drawImage(roadImg, 0, backgroundY - canvas.height, canvas.width, canvas.height);
  ctx.drawImage(roadImg, 0, backgroundY, canvas.width, canvas.height);

  // Draw player
  const laneCount = 3;
  const carWidth = 80;
  const carHeight = 140;
  const laneWidth = canvas.width / laneCount;
  const playerX = player.lane * laneWidth + laneWidth / 2 - carWidth / 2;
  ctx.drawImage(playerImg, playerX, player.y, carWidth, carHeight);

  // Spawn enemies
  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnTimer = Math.max(40, 80 - player.speed * 3);
    enemyCars.push({
      lane: Math.floor(Math.random() * laneCount),
      y: -carHeight
    });
  }

  // Update enemies
  for (let i = enemyCars.length - 1; i >= 0; i--) {
    let car = enemyCars[i];
    car.y += player.speed;

    const carX = car.lane * laneWidth + laneWidth / 2 - carWidth / 2;
    ctx.drawImage(enemyImg, carX, car.y, carWidth, carHeight);

    // Collision detection
    if (
      car.lane === player.lane &&
      car.y + carHeight > player.y &&
      car.y < player.y + carHeight
    ) {
      endGame();
      return;
    }

    if (car.y > canvas.height) enemyCars.splice(i, 1);
  }

  // Distance tracking
  player.distance += player.speed * 0.1;
  if (Math.floor(player.distance) % 400 === 0) {
    player.speed += 1;
  }

  // Draw stats
  ctx.fillStyle = "white";
  ctx.font = `${Math.floor(canvas.width / 30)}px Arial`;
  ctx.fillText(`Name: ${playerName}`, 10, 30);
  ctx.fillText(`Distance: ${Math.floor(player.distance)} m`, 10, 60);
  ctx.fillText(`Speed: ${player.speed.toFixed(1)}x`, 10, 90);

  requestAnimationFrame(update);
}

function endGame() {
  gameRunning = false;
  document.getElementById("gameOverMenu").style.display = "block";
  document.getElementById("finalStats").innerText =
    `${playerName} You Crashed!\nDistance: ${Math.floor(player.distance)} m`;
}

function retryGame() {
  window.location.reload();
}

function goHome() {
  window.location.href = "index.html";
}

window.onload = () => {
  playerImg.onload = enemyImg.onload = roadImg.onload = () => {
    playerName = localStorage.getItem("playerName") || "Player";
    initGame();
  };

};

