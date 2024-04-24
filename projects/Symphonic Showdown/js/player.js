const pluckSynth = new Tone.PluckSynth().toDestination();

class Player {
    constructor(x, y, sprite) {
      this.sprite = createSprite(x, y);
      this.sprite.addImage(sprite);
      this.sprite.scale = 0.1; 
      this.sprite.static = true;
      this.projectiles = [];
    }

    shootProjectile(type) {
        let offsetX = 50 * cos(this.sprite.rotation);
        let offsetY = 50 * sin(this.sprite.rotation);

        let projectile = createSprite(this.sprite.position.x + offsetX, this.sprite.position.y + offsetY, 250, 650);
        projectile.scale = 0.07; 
        projectile.debug = true;
    
        if (type === "red") {
          projectile.addImage(red);
          projectile.type = "red";
          pluckSynth.triggerAttackRelease("C4", "16n");
        } else if (type === "green") {
          projectile.addImage(green);
          projectile.type = "green";
          pluckSynth.triggerAttackRelease("D4", "8n");
        } else if (type === "blue") {
          projectile.addImage(blue);
          projectile.type = "blue";
          pluckSynth.triggerAttackRelease("E4", "8n");
        }
    
        projectile.speed = 10;
        projectile.direction = this.sprite.rotation;
        projectile.mass = 900;
        projectile.life = 200; 
    
        this.projectiles.push(projectile);
      }
  
    keyPressed(right, left, up, down) {
      if (kb.pressing(right)) {
        this.sprite.position.x += 10;
        this.sprite.rotation = 0;
      } else if (keyCode === left) {
        this.sprite.position.x -= 10;
        this.sprite.rotation = 180;
      } 
      if (keyCode === up) {
        this.sprite.position.y -= 10;
        this.sprite.rotation = 90;
      } else if (keyCode === down) {
        this.sprite.position.y += 10;
        this.sprite.rotation = 270;
      }

      if (keyCode === 74) {
        this.shootProjectile("blue");
      } else if (keyCode === 75) {
        this.shootProjectile("green");
      } else if (keyCode == 76) {
        this.shootProjectile("red");
      }
    }
  
    keyReleased(right, left, up, down) {
      if (keyCode === right || keyCode === left || keyCode === up || keyCode === down) {
        this.move(0, 0);
      }
    }
  }  