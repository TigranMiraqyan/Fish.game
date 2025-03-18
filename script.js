const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x87CEEB,
});
document.body.appendChild(app.view);

let fish, enemyFish = [], scoreText, gameOver = false, score = 0;
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;
let gameStarted = false;
let speed = 5;
let difficulty = "easy";  
let bomb;

const fishTexture = PIXI.Texture.from('https://pixijs.com/assets/tutorials/fish-pond/fish2.png');
fish = new PIXI.Sprite(fishTexture);
fish.anchor.set(0.5);
fish.x = 100;
fish.y = 300;
fish.scale.set(0.3);
app.stage.addChild(fish);

scoreText = new PIXI.Text(`Score: ${score}`, { fontSize: 24, fill: "#ffffff" });
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.style.position = "absolute";
startButton.style.top = "50%";
startButton.style.left = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.fontSize = "24px";
startButton.style.padding = "10px 20px";
startButton.style.backgroundColor = "#4CAF50";
startButton.style.color = "white";
startButton.style.border = "none";
startButton.style.cursor = "pointer";
startButton.style.zIndex = "9999"; 
document.body.appendChild(startButton);

const difficultySelect = document.createElement("select");
difficultySelect.style.position = "absolute";
difficultySelect.style.top = "60%";
difficultySelect.style.left = "50%";
difficultySelect.style.transform = "translateX(-50%)";
difficultySelect.style.fontSize = "24px";
difficultySelect.style.padding = "10px 20px";
difficultySelect.style.backgroundColor = "#4CAF50";
difficultySelect.style.color = "white";
difficultySelect.style.border = "none";
difficultySelect.style.cursor = "pointer";
difficultySelect.style.zIndex = "9999"; 

const easyOption = document.createElement("option");
easyOption.textContent = "Easy";
easyOption.value = "easy";
difficultySelect.appendChild(easyOption);

const mediumOption = document.createElement("option");
mediumOption.textContent = "Medium";
mediumOption.value = "medium";
difficultySelect.appendChild(mediumOption);

const hardOption = document.createElement("option");
hardOption.textContent = "Hard";
hardOption.value = "hard";
difficultySelect.appendChild(hardOption);

document.body.appendChild(difficultySelect);

const restartButton = document.createElement("button");
restartButton.textContent = "Restart Game";
restartButton.style.position = "absolute";
restartButton.style.bottom = "20px";
restartButton.style.left = "50%";
restartButton.style.transform = "translateX(-50%)";
restartButton.style.fontSize = "24px";
restartButton.style.padding = "10px 20px";
restartButton.style.backgroundColor = "#4CAF50";
restartButton.style.color = "white";
restartButton.style.border = "none";
restartButton.style.cursor = "pointer";
restartButton.style.zIndex = "9999"; 
document.body.appendChild(restartButton);
restartButton.style.display = "none"; 
restartButton.addEventListener("click", restartGame);

difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value; 
});

startButton.addEventListener("click", startGame);

function createEnemyFish() {
  const enemyTexture = PIXI.Texture.from('https://pixijs.com/assets/tutorials/fish-pond/fish1.png');
  const enemy = new PIXI.Sprite(enemyTexture);
  enemy.anchor.set(0.5);
  enemy.x = Math.random() * (app.view.width - 50) + 25;
  enemy.y = Math.random() * (app.view.height - 50) + 25;
  
  if (difficulty === "easy") {
    enemy.speed = Math.random() * 1.5 + 0.5; 
    enemy.scale.set(Math.random() * 0.3 + 0.2); 
  } else if (difficulty === "medium") {
    enemy.speed = Math.random() * 2 + 1; 
    enemy.scale.set(Math.random() * 0.4 + 0.3); 
  } else if (difficulty === "hard") {
    enemy.speed = Math.random() * 2.5 + 1.5; 
    enemy.scale.set(Math.random() * 0.5 + 0.4); 
  }
  
  enemy.direction = Math.random() * Math.PI * 2; 
  app.stage.addChild(enemy);
  enemyFish.push(enemy);
}

function moveEnemyFish() {
  enemyFish.forEach(enemy => {
    enemy.x += Math.cos(enemy.direction) * enemy.speed;
    enemy.y += Math.sin(enemy.direction) * enemy.speed;

    if (enemy.x < 0) enemy.x = app.view.width;
    if (enemy.x > app.view.width) enemy.x = 0;
    if (enemy.y < 0) enemy.y = app.view.height;
    if (enemy.y > app.view.height) enemy.y = 0;
  });
}

function checkEnemyFishCollision() {
  for (let i = enemyFish.length - 1; i >= 0; i--) {
    let enemy = enemyFish[i];
    let dx = fish.x - enemy.x;
    let dy = fish.y - enemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (fish.width / 2) + (enemy.width / 2)) {
      if (fish.scale.x > enemy.scale.x) {
        app.stage.removeChild(enemy);
        enemyFish.splice(i, 1);
        score++;
        scoreText.text = `Score: ${score}`;

        fish.scale.set(fish.scale.x + enemy.scale.x);  
      } else {
        gameOver = true;
        scoreText.text = `Game Over! Final Score: ${score}`;
        scoreText.style.fontSize = 48;
        scoreText.x = app.view.width / 2 - scoreText.width / 2;
        scoreText.y = app.view.height / 2 - scoreText.height / 2;
        restartButton.style.display = "block";
      }
      break;
    }
  }

  if (enemyFish.length === 0) {
    gameOver = true;
    scoreText.text = `You Win! Final Score: ${score}`;
    scoreText.style.fontSize = 48;
    scoreText.x = app.view.width / 2 - scoreText.width / 2;
    scoreText.y = app.view.height / 2 - scoreText.height / 2;
    restartButton.style.display = "block";
  }
}

document.addEventListener('keydown', (event) => {
  if (gameStarted) {
    if (event.key === "ArrowUp" || event.key === "w") moveUp = true;
    if (event.key === "ArrowDown" || event.key === "s") moveDown = true;
    if (event.key === "ArrowLeft" || event.key === "a") moveLeft = true;
    if (event.key === "ArrowRight" || event.key === "d") moveRight = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (gameStarted) {
    if (event.key === "ArrowUp" || event.key === "w") moveUp = false;
    if (event.key === "ArrowDown" || event.key === "s") moveDown = false;
    if (event.key === "ArrowLeft" || event.key === "a") moveLeft = false;
    if (event.key === "ArrowRight" || event.key === "d") moveRight = false;
  }
});

function startGame() {
  gameStarted = true; 
  score = 0;
  gameOver = false;
  scoreText.text = `Score: ${score}`;
  scoreText.style.fontSize = 24;
  scoreText.x = 10;
  scoreText.y = 10;
  fish.x = 100;
  fish.y = 300;
  fish.scale.set(0.3);
  speed = difficulty === "easy" ? 4 : (difficulty === "medium" ? 5 : 6);
  
  enemyFish.forEach(enemy => app.stage.removeChild(enemy));
  enemyFish = [];
  
  const numEnemies = difficulty === "easy" ? 10 : (difficulty === "medium" ? 15 : 20);
  for (let i = 0; i < numEnemies; i++) {  
    createEnemyFish();
  }
  
  startButton.style.display = "none";
  difficultySelect.style.display = "none";

  if (!bomb) {
    createBomb();
  }
  
  restartButton.style.display = "none";
}

function restartGame() {
  score = 0;
  gameOver = false;
  scoreText.text = `Score: ${score}`;
  scoreText.style.fontSize = 24;
  scoreText.x = 10;
  scoreText.y = 10;
  fish.x = 100;
  fish.y = 300;
  fish.scale.set(0.3);
  speed = difficulty === "easy" ? 4 : (difficulty === "medium" ? 5 : 6);
  
  enemyFish.forEach(enemy => app.stage.removeChild(enemy));
  enemyFish = [];
  
  const numEnemies = difficulty === "easy" ? 10 : (difficulty === "medium" ? 15 : 20);
  for (let i = 0; i < numEnemies; i++) {
    createEnemyFish();
  }
  
  restartButton.style.display = "none";
  startButton.style.display = "block";
  difficultySelect.style.display = "block";
}

function createBomb() {
  bomb = new PIXI.Graphics();
  bomb.beginFill(0xFF0000); 
  bomb.drawCircle(0, 0, 15); 
  bomb.endFill();
  
  bomb.x = Math.random() * (app.view.width - 50) + 25;
  bomb.y = Math.random() * (app.view.height - 50) + 25;

  bomb.speed = 2; 
  bomb.direction = Math.random() * Math.PI * 2; 
  
  app.stage.addChild(bomb); 
}

function moveBomb() {
  if (!bomb) return; 
  bomb.x += Math.cos(bomb.direction) * bomb.speed;
  bomb.y += Math.sin(bomb.direction) * bomb.speed;

  if (bomb.x < 0) bomb.x = app.view.width;
  if (bomb.x > app.view.width) bomb.x = 0;
  if (bomb.y < 0) bomb.y = app.view.height;
  if (bomb.y > app.view.height) bomb.y = 0;
}

function checkBombCollision() {
  if (!bomb) return;

  let dx = fish.x - bomb.x;
  let dy = fish.y - bomb.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < (fish.width / 2) + 15) {
    gameOver = true;
    scoreText.text = `Game Over! Final Score: ${score}`;
    scoreText.style.fontSize = 48;
    scoreText.x = app.view.width / 2 - scoreText.width / 2;
    scoreText.y = app.view.height / 2 - scoreText.height / 2;
    restartButton.style.display = "block";
  }
}

app.ticker.add(() => {
  if (gameOver || !gameStarted) return;

  let adjustedSpeed = speed / fish.scale.x;

  if (moveUp) fish.y -= adjustedSpeed;
  if (moveDown) fish.y += adjustedSpeed;
  if (moveLeft) fish.x -= adjustedSpeed;
  if (moveRight) fish.x += adjustedSpeed;

  moveEnemyFish();

  moveBomb();
  checkBombCollision();

  checkEnemyFishCollision();

  if (enemyFish.length === 0) {
    gameOver = true;
    scoreText.text = `You Win! Final Score: ${score}`;
    scoreText.style.fontSize = 48;
    scoreText.x = app.view.width / 2 - scoreText.width / 2;
    scoreText.y = app.view.height / 2 - scoreText.height / 2;
    restartButton.style.display = "block";
  }
});
