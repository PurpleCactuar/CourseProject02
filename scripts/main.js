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

// Hero image pull
var heroPullReady = false;
var heroPullImage = new Image();
heroPullImage.onload = function () {
    heroPullReady = false;
};
heroPullImage.src = "images/hero/heroPull.png";


// Pikmin image
var pikminReady = false;
var pikminImage = new Image();
pikminImage.onload = function () {
    pikminReady = true;
};
pikminImage.src = "images/pikmin/ground.png";

// Pikmin pull image
var pikminPullReady = false;
var pikminPullImage = new Image();
pikminPullImage.onload = function () {
    pikminPullReady = false;
};
pikminPullImage.src = "images/pikmin/pikmin.png";

// Game objects
var hero = {
    speed: 116, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var pikmin = {
// for this version, the pikmin does not move, so just and x and y
    x: 0,
    y: 0
};
var pikminsCaught = 0;

// Handle keyboard controls
    var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up

addEventListener("keydown", function (e) {
    console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    console.log(e.keyCode + " up")
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
var space = false;
var touch = false;
//==========================================================


// Update game objects
var update = function (modifier) {
  
  left = false;
  right = false;
  up = false;
  down = false;

  var pull = function (){

    if (32 in keysDown && touch){
      
      heroReady = false;
      pikminReady = false;

      heroPullReady = true;
      pikminPullReady=true;
      

      
    }
  }
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
      hero.x <= pikmin.x + 32 &&
     pikmin.x <= hero.x + 32 &&
      hero.y <= pikmin.y + 32 &&
     pikmin.y <= hero.y + 32
    ) {
      touch = true;
      pull();
      ++pikminsCaught; // keep track of our “score”
      //reset(); // start a new cycle
    }




    //curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
    // it will count 0,1,2,0,1,2,0, etc
    if (counter == 6) { // adjust this to change "walking speed" of animation
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
      
    /*if (left == false && right == false && up == false && down == false) {
      srcX = 0 * width; //col
      srcY = 2 * height; //row
    }*/
};


// Draw everything in the main render function
var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (pikminReady) {
      ctx.drawImage(pikminImage, pikmin.x, pikmin.y);
    }
    if (heroReady) {
        //ctx.drawImage(heroImage, hero.x, hero.y);
      ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y,
      width, height)
    }
    if (heroPullReady) {
      ctx.drawImage(heroPullImage, srcX, srcY, width, height, hero.x, hero.y,
      width, height);

    if(pikminPullReady){
      ctx.drawImage(pikminPullImage, srcX, srcY, width, height, pikmin.x, pikmin.y,
        width, height)
    }
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

// Reset the game when the player catches a pikmin
var reset = function () {
  hero.x = canvas.width / 2 - 16;
  hero.y = canvas.height / 2 - 16;

  //Place the pikmin somewhere on the screen randomly
  // but not in the hedges, Article in wrong, the 64 needs to be
  // hedge 32 + hedge 32 + char 32 = 96
 pikmin.x = 32 + Math.random() * (canvas.width - 96);
 pikmin.y = 32 + Math.random() * (canvas.height - 96);
};

// end of define functions ==============================

// Let's play this game!======
var then = Date.now();
reset();
main(); // call the main game loop.