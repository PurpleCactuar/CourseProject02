// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);
let counter = 0;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero/hero.png";

// Pikmin image
var pikminReady = false;
var pikminImage = new Image();
pikminImage.onload = function () {
    pikminReady = true;
};
pikminImage.src = "images/pikmin/ground.png";

// Game objects
var hero = {
    speed: 176,
    x: 0,
    y: 0
};

var pikminsCaught = 0;
var pikminCount = 10;
var pikmins = [];

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


//===========================================================
//Animation variables

var rows = 4;
var cols = 3;
var trackRight = 3;
var trackLeft = 0;
var trackUp = 2;
var trackDown = 1;
var spriteWidth = 210;
var spriteHeight = 280;
var width = spriteWidth / cols;
var height = spriteHeight / rows;

var curXFrame = 0; // start on left side
var frameCount = 3; // 3 frames per row
var srcX = 0;
var srcY = 0;

var left = false;
var right = false;
var up = false;
var down = false;
//==========================================================

// Update game objects
var update = function (modifier) {
  left = false;
  right = false;
  up = false;
  down = false;

  if (38 in keysDown && hero.y > 32 + 4) {
    // holding up key
    hero.y -= hero.speed * modifier;
    up = true;
  }
  if (40 in keysDown && hero.y < canvas.height - (64 + 6)) {
    // holding down key
    hero.y += hero.speed * modifier;
    down = true;
  }
  if (37 in keysDown && hero.x > 32 + 4) {
    // holding left key
    hero.x -= hero.speed * modifier;
    left = true;
  }
  if (39 in keysDown && hero.x < canvas.width - (64 + 0)) {
    // holding right key
    hero.x += hero.speed * modifier;
    right = true;
  }

  // Check if hero has caught any pikmin
  for (var i = 0; i < pikminCount; i++) {
    var pikmin = pikmins[i];
    if (
      !pikmin.caught &&
      hero.x <= pikmin.x + 32 &&
      pikmin.x <= hero.x + 32 &&
      hero.y <= pikmin.y + 32 &&
      pikmin.y <= hero.y + 32
    ) {
      pikmin.caught = true;
      pikminsCaught++;
    }
  }

  if (counter == 6) {
    curXFrame = ++curXFrame % frameCount; 
    counter = 0;
  } 
  else {
    counter++;
  }

  srcX = curXFrame * width; 
  if (left) {
    srcY = trackLeft * height;
  }
  if (right) {
    srcY = trackDown * height;
  }
  if (up) {
    srcY = trackUp * height;
  }

  if (down) {
    srcY = trackRight * height;
  }
    if (left == false && right == false && up == false && down == false) {
      srcX = 0 * width; //col
      srcY = 2 * height; //row
    }
};

// Draw everything in the main render function
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (pikminReady) {
        for (var i = 0; i < pikminCount; i++) {
            var pikmin = pikmins[i];
            if (!pikmin.caught) {
                ctx.drawImage(pikminImage, pikmin.x, pikmin.y);
            }
        }
    }

    if (heroReady) {
        ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y,
            width, height);
    }

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Pikmins caught: " + pikminsCaught, 10, 30);

    // Display time left
    var timeLeft = Math.ceil(10 - (Date.now() - startTime) / 1000);
    ctx.fillText("Time left: " + timeLeft, 10, 60);

    // Game over
    if (timeLeft <= 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
};

// Reset the game
var reset = function () {
    hero.x = canvas.width / 2 - 16;
    hero.y = canvas.height / 2 - 16;

    pikmins = [];
    for (var i = 0; i < pikminCount; i++) {
        var pikmin = {
            x: 32 + Math.random() * (canvas.width - 96),
            y: 32 + Math.random() * (canvas.height - 96),
            caught: false
        };
        pikmins.push(pikmin);
    }

    startTime = Date.now();
    pikminsCaught = 0;
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    // Request to do this again ASAP
    if (timeLeft > 0) {
        requestAnimationFrame(main);
    }
};

// Start the game
var startTime;
var timeLeft = 10;
var then = Date.now();
reset();
main();
