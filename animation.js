// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     ||  
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// Initialize canvas and required variables
var ball_number = Math.floor((Math.random()*20)+1);

// Draw balls or ball trails at random
var draw_balls = Math.floor((Math.random()*2));

var colors = [];
colors.push("#FF88FF");
colors.push("#FF0000");
colors.push("#00FF00");
colors.push("#0000FF");
colors.push("#00FFFF");
colors.push("#FF00FF");
colors.push("#FFFF00");
colors.push("#CC66FF");
colors.push("#FF9933");
colors.push("#007A00");

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"); // Create canvas context

var W = window.innerWidth, // Window's width
    H = window.innerHeight; // Window's height

var balls = []; // Array containg two balls
var walls = []; // Array containg two walls
var wall_color = colors[Math.floor((Math.random()*10)+1)];
// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

ctx.fillRect(0, 0, W, H);

// Draw everything on canvas
function draw() {
  if(draw_balls) {
    paintCanvas();
  }
  for(var i = 0; i < walls.length; i++) {
      wall = walls[i];
      wall.draw();
  }
  for(var i = 0; i < balls.length; i++) {
      ball = balls[i];
      ball.draw();
      update(ball);
  }
}

// Function for running the whole animation
function animloop() {
    requestAnimFrame(animloop);
    draw();
}

// Function to paint canvas
function paintCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);
}

// Function for creating balls
function Ball() {
    // Height and width
    this.x = 50;
    this.y = 50;
    this.r = 5;
    this.c = colors[Math.floor((Math.random()*10)+1)];
    this.vx = Math.floor((Math.random()*10)+1);
    this.vy = Math.floor((Math.random()*10)+1);

    // Function for drawing ball on canvas
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fill();
    }
}

// Function for creating walls
function Wall(height, width, wall_x, wall_y) {
    // Height and width
    this.h = height;
    this.w = width; //Math.floor((Math.random()*500)+1);

    // Wall's position
    this.x = wall_x;
    this.y = wall_y;

    // Function for drawing wall on canvas
    this.draw = function() {
        ctx.fillStyle = wall_color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

// Push new balls into the balls[] array
for(var i = 0; i < ball_number; i++) {
  balls.push(new Ball());
}

// Push new walls into the walls[] array
walls.push(new Wall(10, 500, W/2 - 250, H/2 - 5));
walls.push(new Wall(500, 10, W/2 - 5, H/2 - 250));
walls.push(new Wall(300, 10, W/2 - 350, H/2 - 150));
walls.push(new Wall(300, 10, W/2 + 350, H/2 - 150));

function update(ball) {
  // Move the ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collision with middle wall
  for(var i = 0; i < walls.length; i++) {
    wall = walls[i];
    if(ball.x >= wall.x && ball.x <= wall.x + wall.w && ball.y >= wall.y && ball.y <= wall.y + wall.h) {
        //wall_color = ball.c;
        if(ball.x >= wall.x + ball.r * 2 && ball.x <= wall.x + wall.w - ball.r * 2) {
          ball.vy = -ball.vy;
        }
        else {
          ball.vx = -ball.vx;
        }
    }
  }

  // Collide with walls. If the ball hits the top/bottom,
  // walls, invert the y-velocity vector of ball.
  if(ball.y + ball.r > H) {
      ball.vy = -ball.vy;
      ball.y = H - ball.r;
      ball.c = colors[Math.floor((Math.random()*10)+1)];
  } 
  
  else if(ball.y < 0) {
      ball.vy = -ball.vy;
      ball.y = ball.r;
      ball.c = colors[Math.floor((Math.random()*10)+1)];
  }
  
  // If ball strikes the vertical walls, invert the 
  // x-velocity vector of ball.
  if(ball.x + ball.r > W) {
      ball.vx = -ball.vx;
      ball.x = W - ball.r;
      ball.c = colors[Math.floor((Math.random()*10)+1)];
  }
  
  else if(ball.x -ball.r < 0) {
      ball.vx = -ball.vx;
      ball.x = ball.r;
      ball.c = colors[Math.floor((Math.random()*10)+1)];
  }
}

animloop();
