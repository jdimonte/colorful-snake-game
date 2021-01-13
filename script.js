/* global collideRectCircle, image, color, createGraphics, collideRectRect, random, textSize, CENTER, LEFT, textAlign, ellipse, fill, text, keyCode, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, createCanvas, colorMode, HSB, frameRate, background, width, height, noStroke, stroke, noFill, rect*/

let backgroundColor, playerSnake, currentApple, score, isGameOver, rate, circleSize;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  screen = createGraphics(400,400);
  screen.background(color(0,100,100));
  colorMode(HSB, 360, 100, 100);
  screen.colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  rate = 5;
  frameRate(rate);
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
  isGameOver = false;
  screen.fill(0,100,100);
  circleSize = 400;
}

function draw() {
  image(screen,0,0,400,400);
  // The snake performs the following four methods:
  frameRate(rate);
  
  if (!isGameOver) {
    background(backgroundColor);
    playerSnake.moveSelf();
    playerSnake.showSelf();
    playerSnake.checkCollisions();
    playerSnake.checkApples();

    // The apple needs fewer methods to show up on screen.
    currentApple.showSelf();

    // We put the score in its own function for readability.
    displayScore();
  }
  
}

function displayScore() {
  fill(0);
  text(`Score: ${score}`, 20, 20);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - 10;
    this.direction = 'N';
    this.speed = 12;
    this.tailSegments = [new TailSegment(this.x, this.y)];
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    
    let previousTailX = this.x;
    let previousTailY = this.y;
    for (let i = 0; i < this.tailSegments.length; i++) {
      let tempX = this.tailSegments[i].x;
      let tempY = this.tailSegments[i].y;
      this.tailSegments[i].move(previousTailX, previousTailY);
      previousTailX = tempX;
      previousTailY = tempY;
    }
    
    screen.rect(this.tailSegments[0].x,this.tailSegments[0].y,this.tailSegments[0].size,this.tailSegments[0].size);
  }

  showSelf() {
    for (let i = 0; i < this.tailSegments.length; i++) {
      this.tailSegments[i].showSelf();
    }
  }

  checkApples() {
    //if snake head collides with apple, increment score and create a new apple
    if (collideRectCircle(this.x, this.y, this.size, this.size,
                      currentApple.x, currentApple.y, currentApple.diam)) {
      score++;
      rate++;
      currentApple = new Apple();
      this.extendTail();
      screen.fill(this.tailSegments[this.tailSegments.length - 1].hue, 100, 100);
      screen.ellipse(this.x,this.y,circleSize,circleSize);
      circleSize -= 50;
      if(circleSize<50) {
        circleSize =50;
      }
    }
  }

  checkCollisions() {
//     if (this.tailSegments.length > 2) {
      
//     }
    for (let i = 2; i < this.tailSegments.length; i++) {
      if (collideRectRect(this.x, this.y, this.size, this.size,
                      this.tailSegments[i].x, this.tailSegments[i].y, this.tailSegments[i].size, this.tailSegments[i].size)) {
        gameOver();
      }
    }
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      gameOver();
    }
  }

  extendTail() {
    // add a new square onto the end of the snake
    let lastTailSegment = this.tailSegments[this.tailSegments.length - 1];
    let newXPos = lastTailSegment.x;
    let newYPos = lastTailSegment.y;
      
      if (this.direction === "N") {
        newYPos += this.size;
    } else if (this.direction === "S") {
        newYPos -= this.size;
    } else if (this.direction === "E") {
        newXPos -= this.size;
    } else if (this.direction === "W") {
        newXPos += this.size;
    }
    let lastHue;
    if (this.tailSegments.length > 1) {
      lastHue = lastTailSegment.hue;
      lastHue += 40;
      lastHue %= 360;
    }
    else {
      lastHue = 240;
    }
    this.tailSegments.push(new TailSegment(newXPos, newYPos, lastHue));
    
  }
}

class TailSegment {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.hue = hue;
  }
  
  showSelf() {
    stroke(this.hue, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }
  
  move(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Apple {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diam = 10;
  }

  showSelf() {
    stroke(0, 100, 100);
    noFill();
    ellipse(this.x, this.y, this.diam);
    noStroke();
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode)
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W";
  } else {
    console.log("wrong key");
  }
  
  if(keyCode==82){
    restartGame();
  }
}

function restartGame() {
  isGameOver = false;
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
  rate = 5;
  circleSize = 200;
}

function gameOver() {
  fill(0);
  textSize(30);
  textAlign(CENTER);
  text(`GAME OVER! Score: ${score}`, width/2, height/2);
  text("Press r to restart", width/2, height/2 + 40);
  textAlign(LEFT);
  textSize(12);
  isGameOver = true;
}