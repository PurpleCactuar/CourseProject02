// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

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
    speed: 116, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
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

// Update game objects
var update = function (modifier) {
    if (38 in keysDown && hero.y > 32 + 4) {
        // holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 6)) {
        // holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > 32 + 4) {
        // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 0)) {
        // holding right key
        hero.x += hero.speed * modifier;
    }

    // Check if hero has caught any pikmin
    for (var i = 0; i < pikminCount; i++) {
        var pikmin = pikmins[i];
        if (!pikmin.caught && hero.x <= pikmin.x + 32 && pikmin.x <= hero.x + 32 &&
            hero.y <= pikmin.y + 32 && pikmin.y <= hero.y + 32) {
            pikmin.caught = true;
            pikminsCaught++;
        }
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
        ctx.drawImage(heroImage, hero.x, hero.y);
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
