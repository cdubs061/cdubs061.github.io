let port;
let writer, reader;
let red, green, blue;
let projectiles;
let sensorData = {};
let bigSlow;
let sp = 0;
const encoder = new TextEncoder();
const decorder = new TextDecoder();

let bgImage;
let playerSprite;
let player;
let enemies = [];

let health = { number: 3 };
let previousHealth = -1;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = { maxTime: 0, elapsedTime: 0, state: GameState.Start };

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0.1,
    release: 0.5,
  },
}).toDestination();

function preload() {
  bgImage = loadImage('assets/background.png');
  playerSprite = loadImage('assets/player.png');
  guitarHero = loadFont('assets/guitar_hero.ttf');
  AIart = loadImage('assets/AI_art.jpg');

  blue = loadImage("assets/blue_note.png");
  green = loadImage("assets/green_note.png");
  red = loadImage("assets/red_note.png");
}

function setup() {
  createCanvas(500, 500);

  projectiles = new Group();

  reset();

  if ("serial" in navigator) {
    let button = createButton("connect");
    button.position(0,0);
    button.mousePressed(connect);
  }
}

function reset() {
  game.elapsedTime = 0;
  health["number"] = 3;;
}

function draw() {
  switch(game.state) {
    case GameState.Playing:
      
      push(); 
      resetMatrix(); 
      background(255); 
      drawGrid(); 
      pop();

      serialRead();
      console.log(JSON.stringify(sensorData));

      const speedFactor = 2; 

      if (sensorData.x || sensorData.y) {
        const angle = Math.atan2(sensorData.y, sensorData.x);

        player.sprite.position.x += speedFactor * sensorData.x / 512;
        player.sprite.position.y += speedFactor * sensorData.y / 512;
        player.sprite.rotation = degrees(angle);
      }

      camera.x = player.sprite.x;
      camera.y = player.sprite.y;

      if (game.elapsedTime > sp) {
        enemies.push(spawnEnemy());
        sp += 5;
      } 

      bigSlow.moveTowardsPlayer();

      if (enemies.length > 0) {
        for (const enemy of enemies) {
          if (player.sprite.collides(enemy.projectiles)) {
            health["number"] -= 1;
            enemy.projectiles.remove();
          }

          for(const projectile of player.projectiles)
            if (enemy.sprite.collides(projectile)) {
              if (enemy.colorSequence[0] === projectile.type) {
                enemy.colorSequence.shift();
              }
              if(enemy.colorSequence.length < 1) {
                enemy.sprite.remove();
              }
              projectile.remove();
            }
          enemy.moveTowardsPlayer();
        }
      }

      if(player.sprite.collides((bigSlow.sprite))) {
        health["number"] -= 1;
      }
      
      fill(0);
      textSize(40);
      text(game.score,20,40);
      let currentTime =  game.elapsedTime;
      text(ceil(currentTime), 300,40);
      game.elapsedTime += deltaTime / 1000;

      if(health["number"] !== previousHealth) {
        serialWrite(health);
        previousHealth = health["number"];
        synth.triggerAttackRelease(["C4", "G4", "Bb4"], "16n");
      }

      if (currentTime < 0)
        game.state = GameState.GameOver;
      if (health["number"] <= 0)
        game.state = GameState.GameOver;
      break;
    case GameState.GameOver:
      game.maxTime = max(game.elapsedTime,game.maxTime);

      for (const enemy of enemies) {
        enemy.stopShooting();
        enemy.sprite.remove();
      }

      bigSlow.sprite.remove();
      player.sprite.remove();

      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!",200,200);
      textSize(35);
      text("Time: " + game.elapsedTime,200,270);
      text("Max Time: " + game.maxTime,200,320);
      break;
    case GameState.Start:
      background(200);
      image(AIart, 0, 0, 800, 700);
      fill(0);
      textSize(50);
      textAlign(LEFT);
      textFont(guitarHero);
      textSize(60);
      fill(255);
      text("Symphonic Sowdown",0,100);
      textSize(30);
      text("Press Any Key to Start",0,250);
      break;
  }
  
}

// fuction keyPressed() {
function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      bigSlow = new BigSlow(100, 100);
      player = new Player(height/2, width/2, playerSprite);
      break;
    case GameState.GameOver:
      reset();
      bigSlow = new BigSlow(100, 100);
      player = new Player(height/2, width/2, playerSprite);
      game.state = GameState.Playing;
      break;
    case GameState.Playing:
      player.keyPressed(RIGHT_ARROW, LEFT_ARROW, UP_ARROW, DOWN_ARROW);
  }
}

function drawGrid() {
  const gridSize = 50;
  const offsetX = -camera.position.x % gridSize;
  const offsetY = -camera.position.y % gridSize;
  stroke(200); 
  strokeWeight(1); 

  for (let x = offsetX; x <= width; x += gridSize) {
    line(x, 0, x, height);
  }

  for (let y = offsetY; y <= height; y += gridSize) {
    line(0, y, width, y);
  }
}