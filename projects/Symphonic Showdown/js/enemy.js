const gunshotSynth = new Tone.NoiseSynth({
  noise: {
    type: "white"
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0.1
  }
}).toDestination();

class Enemy {
    constructor(x, y) {
      this.sprite = createSprite(x, y, 30, 30); 
      this.sprite.color = color(255, 0, 0); 
      this.sprite.rotationSpeed = 0;
      this.projectiles = new Group(); 
      this.startShooting();
      this.colorSequence = this.generateColorSequence();
    }
  
    generateColorSequence() {
      const colors = ['red', 'green', 'blue'];
      const sequence = [];
  
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        sequence.push(colors[randomIndex]);
      }

      this.sprite.textSize = 19;
      this.sprite.textColor = "black";
      this.sprite.text = "";
      for (let i = 0; i < 3; i++) {
        if (sequence[i] === 'red') {
          this.sprite.text += "R";
        } else if (sequence[i] === 'green') {
          this.sprite.text += "G";
        } else {
          this.sprite.text += "B";
         }
      }
  
      return sequence;
    }

    moveTowardsPlayer() {
      const dx = player.sprite.position.x - this.sprite.position.x;
      const dy = player.sprite.position.y - this.sprite.position.y;
      const angle = atan2(dy, dx);

      this.sprite.speed = 0.8;
      this.sprite.direction = angle;
    }

    shoot() {
      const dx = player.sprite.position.x - this.sprite.position.x;
      const dy = player.sprite.position.y - this.sprite.position.y;
      const angle = atan2(dy, dx);

      const projectile = createSprite(this.sprite.position.x, this.sprite.position.y, 5, 5); // Adjust size as needed
      projectile.color = color(255, 255, 0); 
      projectile.speed = 3; 
      projectile.direction = angle;
      projectile.life = 150; 
      this.projectiles.add(projectile);

      gunshotSynth.triggerAttackRelease("Bb4", "16n");
    }
    startShooting() {
      setInterval(() => {
        this.shoot();
      }, 1000); 
    }
    stopShooting() {
      if (this.shootingInterval) {
        clearInterval(this.shootingInterval);
        this.shootingInterval = null;
      }
    }
  }

  function spawnEnemy() {
    const x = random(-100, width + 100);
    const y = random(-100, height + 100);
  
    const enemy = new Enemy(x, y);
    return enemy;
  }

  class BigSlow {
    constructor(x, y) {
      this.sprite = createSprite(x, y, 150);
      this.sprite.color = color(255, 255, 255);
      this.sprite.text = "Insta Kill";
      this.sprite.bounciness = 1;
      this.sprite.mass = 0.5;
    }

    moveTowardsPlayer() {
      const dx = player.sprite.position.x - this.sprite.position.x;
      const dy = player.sprite.position.y - this.sprite.position.y;
      const angle = atan2(dy, dx);

      this.sprite.speed = 0.4;
      this.sprite.direction = angle;
    }
  }
  