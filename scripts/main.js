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


// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
    speed: 116, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var monster = {
// for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};
var monstersCaught = 0;

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

  //Place the monster somewhere on the screen randomly
// but not in the hedges, Article in wrong, the 64 needs to be 
// hedge 32 + hedge 32 + char 32 = 96
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
};

if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

//===========================================================
//Animation

// lots of variables to keep track of sprite geometry
var rows = 4;
var cols = 3;
//second row for the right movement (counting the index from 0)
var trackRight = 3;
//third row for the left movement (counting the index from 0)
var trackLeft = 0;
var trackUp = 2; // not using up and down in this version, see next version
var trackDown = 1;
var spriteWidth = 210; // also spriteWidth/cols;
var spriteHeight = 280; // also spriteHeight/rows;

var width = spriteWidth / cols;
var height = spriteHeight / rows;

var curXFrame = 0; // start on left side
var frameCount = 3; // 3 frames per row

//x and y coordinates of the overall sprite image to get the single frame
var srcX = 0; // our image has no borders or other stuff
var srcY = 0;
//Assuming that at start the character will move right side
var left = false;
var right = false;
var up = false;
var down = false;
//==========================================================


// Update game objects
var update = function (modifier) {
  
  //ctx.clearRect(hero.x, hero.y, width, height);
  left = false;
  right = false;
  up = false;
  down = false;

    // check on keys and not allowing hero move outside of bounds
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
  
    // Are they touching?
    if (
      hero.x <= monster.x + 32 &&
      monster.x <= hero.x + 32 &&
      hero.y <= monster.y + 32 &&
      monster.y <= hero.y + 32
    ) {
      ++monstersCaught; // keep track of our “score”
      reset(); // start a new cycle
    }


    //curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
    // it will count 0,1,2,0,1,2,0, etc
    if (counter == 5) { // adjust this to change "walking speed" of animation
      curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
      // it will count 0,1,2,0,1,2,0, etc
      counter = 0;
    } 
      else {
      counter++;
    }

    srcX = curXFrame * width; //Calculating the x coordinate for spritesheet
    //if left is true, pick Y dim of the correct row
    if (left) {
      //calculate srcY
      srcY = trackLeft * height;
    }
    //if the right is true, pick Y dim of the correct row
    if (right) {
    //calculating y coordinate for spritesheet
    srcY = trackDown * height;
    }
    if (up) {
      //calculating y coordinate for spritesheet
      srcY = trackUp * height;
    }

    if (down) {
      //calculating y coordinate for spritesheet
      srcY = trackRight * height;
      }
      
    if (left == false && right == false && up == false && down == false) {
    srcX = 0 * width;
    srcY = 2 * height;
    }
};


// Draw everything in the main render function
var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
      ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y,
      width, height)
    }

};



// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Reset the game when the player catches a monster
var reset = function () {
  hero.x = canvas.width / 2 - 16;
  hero.y = canvas.height / 2 - 16;

  //Place the monster somewhere on the screen randomly
  // but not in the hedges, Article in wrong, the 64 needs to be
  // hedge 32 + hedge 32 + char 32 = 96
  monster.x = 32 + Math.random() * (canvas.width - 96);
  monster.y = 32 + Math.random() * (canvas.height - 96);
};

// end of define functions ==============================

// Let's play this game!======
var then = Date.now();
reset();
main(); // call the main game loop.