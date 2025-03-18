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
let difficulty = "easy";  // Default difficulty is easy
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

// Create start button
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
startButton.style.zIndex = "9999"; // Ensure the button is above other elements
document.body.appendChild(startButton);

// Create difficulty select dropdown
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
difficultySelect.style.zIndex = "9999"; // Ensure the dropdown is above other elements

// Add options for difficulty levels
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

// Create restart button
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
restartButton.style.zIndex = "9999"; // Ensure the button is above other elements
document.body.appendChild(restartButton);
restartButton.style.display = "none"; // Hidden initially
restartButton.addEventListener("click", restartGame);

difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value; // Update difficulty
});

startButton.addEventListener("click", startGame);

function createEnemyFish() {
  const enemyTexture = PIXI.Texture.from('https://pixijs.com/assets/tutorials/fish-pond/fish1.png');
  const enemy = new PIXI.Sprite(enemyTexture);
  enemy.anchor.set(0.5);
  enemy.x = Math.random() * (app.view.width - 50) + 25;
  enemy.y = Math.random() * (app.view.height - 50) + 25;
  
  // Set the enemy speed and size based on the difficulty
  if (difficulty === "easy") {
    enemy.speed = Math.random() * 1.5 + 0.5; // Slower enemies
    enemy.scale.set(Math.random() * 0.3 + 0.2); // Smaller enemies
  } else if (difficulty === "medium") {
    enemy.speed = Math.random() * 2 + 1; // Moderate speed
    enemy.scale.set(Math.random() * 0.4 + 0.3); // Moderate size
  } else if (difficulty === "hard") {
    enemy.speed = Math.random() * 2.5 + 1.5; // Faster enemies
    enemy.scale.set(Math.random() * 0.5 + 0.4); // Larger enemies
  }
  
  enemy.direction = Math.random() * Math.PI * 2; // Random direction for movement
  app.stage.addChild(enemy);
  enemyFish.push(enemy);
}

function moveEnemyFish() {
  enemyFish.forEach(enemy => {
    // Move the enemy fish based on speed and direction
    enemy.x += Math.cos(enemy.direction) * enemy.speed;
    enemy.y += Math.sin(enemy.direction) * enemy.speed;

    // Wrap the enemy fish around the screen if it goes out of bounds
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
      // If the player eats the enemy fish (it's smaller)
      if (fish.scale.x > enemy.scale.x) {
        app.stage.removeChild(enemy);
        enemyFish.splice(i, 1);
        score++;
        scoreText.text = `Score: ${score}`;

        // Increase fish size and speed after eating
        fish.scale.set(fish.scale.x + enemy.scale.x);  // Add size of the eaten enemy fish
      } else {
        // Game over if the player touches a bigger enemy fish
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

  // Check if all enemies have been eaten
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
  gameStarted = true;  // Game has started
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
  
  // Clear old enemy fish
  enemyFish.forEach(enemy => app.stage.removeChild(enemy));
  enemyFish = [];
  
  // Create new enemy fish based on difficulty
  const numEnemies = difficulty === "easy" ? 10 : (difficulty === "medium" ? 15 : 20);
  for (let i = 0; i < numEnemies; i++) {  
    createEnemyFish();
  }
  
  // Remove start and difficulty buttons
  startButton.style.display = "none";
  difficultySelect.style.display = "none";

  // Create the bomb once, regardless of difficulty
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
  
  // Clear old enemy fish
  enemyFish.forEach(enemy => app.stage.removeChild(enemy));
  enemyFish = [];
  
  // Create new enemy fish based on difficulty
  const numEnemies = difficulty === "easy" ? 10 : (difficulty === "medium" ? 15 : 20);
  for (let i = 0; i < numEnemies; i++) {
    createEnemyFish();
  }
  
  // Restart the game
  restartButton.style.display = "none";
  startButton.style.display = "block";
  difficultySelect.style.display = "block";
}

function createBomb() {
  bomb = new PIXI.Graphics();
  bomb.beginFill(0xFF0000); // Red color for the bomb
  bomb.drawCircle(0, 0, 15); // Bomb size (radius 15)
  bomb.endFill();
  
  // Random starting position for the bomb
  bomb.x = Math.random() * (app.view.width - 50) + 25;
  bomb.y = Math.random() * (app.view.height - 50) + 25;

  bomb.speed = 2; // Bomb movement speed
  bomb.direction = Math.random() * Math.PI * 2; // Random direction
  
  app.stage.addChild(bomb); // Add the bomb to the stage
}

function moveBomb() {
  if (!bomb) return; // Check if bomb exists
  
  // Move the bomb in the random direction
  bomb.x += Math.cos(bomb.direction) * bomb.speed;
  bomb.y += Math.sin(bomb.direction) * bomb.speed;

  // Wrap bomb around the screen if it goes out of bounds
  if (bomb.x < 0) bomb.x = app.view.width;
  if (bomb.x > app.view.width) bomb.x = 0;
  if (bomb.y < 0) bomb.y = app.view.height;
  if (bomb.y > app.view.height) bomb.y = 0;
}

function checkBombCollision() {
  if (!bomb) return;

  // Calculate the distance between the fish and the bomb
  let dx = fish.x - bomb.x;
  let dy = fish.y - bomb.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // If the fish touches the bomb, game over
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

  // Player movement
  if (moveUp) fish.y -= adjustedSpeed;
  if (moveDown) fish.y += adjustedSpeed;
  if (moveLeft) fish.x -= adjustedSpeed;
  if (moveRight) fish.x += adjustedSpeed;

  // Move enemy fish
  moveEnemyFish();

  // Move and check for bomb collision
  moveBomb();
  checkBombCollision();

  // Check collisions between the player and enemy fish
  checkEnemyFishCollision();

  // Check if the player wins
  if (enemyFish.length === 0) {
    gameOver = true;
    scoreText.text = `You Win! Final Score: ${score}`;
    scoreText.style.fontSize = 48;
    scoreText.x = app.view.width / 2 - scoreText.width / 2;
    scoreText.y = app.view.height / 2 - scoreText.height / 2;
    restartButton.style.display = "block";
  }
});
