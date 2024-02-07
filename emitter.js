const app = new PIXI.Application({
  backgroundColor: 0x1099bb,
  resizeTo: window,
});
document.body.appendChild(app.view);

// Add the bunny sprite
const bunny = PIXI.Sprite.from("https://pixijs.com/assets/bunny.png");
bunny.scale.set(1.5);
bunny.anchor.set(0.5);
bunny.x = 1000;
bunny.y = 900;
app.stage.addChild(bunny);

// Set the initial speed for bunny movement
const speed = 5;
var score=0;


//scoreboard

const demoContainer = new PIXI.Container();
demoContainer.x = app.renderer.width - 300; 
demoContainer.y = 20;
app.stage.addChild(demoContainer);

//bg rect
const bgRect = new PIXI.Graphics();
bgRect.beginFill(0x333333); 
bgRect.drawRect(0, 0, 250, 100);
bgRect.alpha=0.5 
demoContainer.addChild(bgRect);

// Create the text
const text = new PIXI.Text('Score: '+score, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xFFFFFF, // Text color (white)
    align: 'left'
});
text.anchor.set(0.8); 
text.x = bgRect.width / 2; 
text.y = bgRect.height / 2;
demoContainer.addChild(text);

// Set up a velocity vector for smoother movement
const velocity = new PIXI.Point(0, 0);

// Check for collisions between bunny and target objects
app.ticker.add(() => {
  targetObjects.forEach((targetObject) => {
    if (targetObject.containsPoint(bunny.position)) {
      gameOver();
    }
  });
});

// Function to handle game over
function gameOver() {
  alert("Game over!");
  bunny.x = 1000;
  bunny.y = 900;
  velocity.set(0, 0);
}

// Use PIXI ticker for continuous updates
app.ticker.add(() => {
  // Update bunny position based on velocity
  bunny.x += velocity.x;
  bunny.y += velocity.y;

  // Implement border logic
  if (bunny.x < 0) {
    bunny.x = app.renderer.width;
  } else if (bunny.x > app.renderer.width) {
    bunny.x = 0;
  }
  if (bunny.y < 0) {
    bunny.y = app.renderer.height;
  } else if (bunny.y > app.renderer.height) {
    bunny.y = 0;
  }
});

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      velocity.x = 0;
      velocity.y = -speed;
      break;
    case "a":
      velocity.y = 0;
      velocity.x = -speed;
      break;
    case "s":
      velocity.x = 0;
      velocity.y = speed;
      break;
    case "d":
      velocity.y = 0;
      velocity.x = speed;
      break;
    case " ":
      emitParticle(bunny.x, bunny.y);
      break;
    case "Enter":
      velocity.set(0, 0);
      break;
  }
});

function emitParticle(x, y) {
  // Create a new particle
  const particle = PIXI.Sprite.from("images/particle.png");
  particle.scale.set(0.5);
  particle.anchor.set(0.5);
  particle.x = x;
  particle.y = y;

  // Add the particle to the stage
  app.stage.addChild(particle);

  // Update the particle's position in the game loop
  app.ticker.add(() => {
    particle.y -= 10;

    // Check for collision with target objects
    targetObjects.forEach((targetObject) => {
      if (targetObject.containsPoint(particle.position)) {
        targetObject.y = -targetObject.height - 500;  
        score++;
        text.text='score :' + score;
      }
      else{
        score=score+0;
        text.text='score :' + score;
      }
      // Remove particle when it reaches the top border
      if (particle.y < 0) {
        app.stage.removeChild(particle);
      }
    });
  });
}

text.text='Score : '+score;

const targetObjects = [];
const objectSpeed = 2;
const totalTargetObjects = 10;

function createTargetObject() {
  const texture = PIXI.Texture.from("images/astroid.png");
  const targetObject = new PIXI.Sprite(texture);
  targetObject.scale.set(Math.random() * (0.3 - 0.2) + 0.2);
  app.stage.addChild(targetObject);

  //set intial position of astroid
  targetObject.x = Math.random() * app.renderer.width;
  targetObject.y = -targetObject.height - 500; // Start from above the screen

  // Add targetObject to the array
  targetObjects.push(targetObject);

  //random delay before falling
  targetObject.delay = Math.random() * 100;
  targetObject.elapsedTime = 0;
}

for (let i = 0; i < totalTargetObjects; i++) {
  createTargetObject();
}

// Use PIXI ticker for continuous updates
app.ticker.add((delta) => {
  targetObjects.forEach((targetObject) => {
    targetObject.elapsedTime += delta;

    if (targetObject.elapsedTime >= targetObject.delay) {
      targetObject.y += (objectSpeed * delta) / 1; // adjust falling time
      //border logic
      if (targetObject.y > app.renderer.height) {
        targetObject.x = Math.random() * app.renderer.width;
        targetObject.y = -targetObject.height;
        //reset falling start time after the border touch
        targetObject.elapsedTime = 0;
        targetObject.delay = Math.random() * 1;
      }
    }
  });
});


