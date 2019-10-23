/// Author: Xueer Zhu 10/16/2019
///
/// Interactive game about feeding baby space cookies.

/* global 
createCanvas 
mouseX 
mouseY 
width 
height 
ellipse 
rect 
fill 
mx 
my 
abs 
background 
constrain 
noStroke 
rectMode 
ellipseMode 
CORNER 
RADIUS 
push 
pop 
ambientLight 
ambientMaterial 
rotateZ 
rotateX 
rotateY 
sphere 
torus 
translate 
orbitControl 
shader 
loadShader  
shaderTexture
image 
WEBGL 
loadImage 
createGraphics 
setUniform 
millis 
frameCount
strokeWeight 
map 
texture 
circle 
ellipsoid 
stroke 
box 
PI
beginShape 
TRIANGLE_STRIP 
vertex 
endShape 
noise 
plane
textSize
text
textFont
loadFont
color
square
cos
keyCode
ENTER
*/

// ///
let gameStarted = false;
let mouthImage;
let cookieShader;
let cookieScalar = 1; // default for near bottom scale [1, 0.5]
let cookieTranslate = 0;
let scored;

let moving = true;
let x2 = 0;

let myFont;

let proceduralConst = 0.0;
let col;
let row;
let scale;
let terrainZ;
let xNoiseOff;
let yNoiseOff;

let terrainColors = [];

const objects = [];

function preload() {
  mouthImage = loadImage(
    "https://cdn.glitch.com/b62a0802-b684-4cbe-93d2-6590fe1d18a4%2Fmouth%20final.png?v=1571778528060"
  );
  cookieShader = loadShader("cookie.vert", "cookie.frag");
  myFont = loadFont(
    "https://cdn.glitch.com/b62a0802-b684-4cbe-93d2-6590fe1d18a4%2FInconsolata.otf?v=1571312423623"
  );
}

function setup() {
  createCanvas(900, 720, WEBGL);

  // init createGraphics layers for cookie shader
  shaderTexture = createGraphics(900, 720, WEBGL);
  shaderTexture.noStroke();

  fill("#ED225D");
  textFont(myFont);
  textSize(36);

  scale = 45;
  col = width / scale;
  row = height / scale;
  terrainZ = [];
  xNoiseOff = 0.0;
}

let scalar = 300;
let ang1 = 0.2;

let x1;

function draw() {
  // environment and lighting
  background("#FFE6E1");
  ambientLight(255);

  // DEBUG control
  //orbitControl();

  // render mouth
  translate(-150, 0, -100);

  x1 = scalar * cos(ang1) + (scalar / 20) * cos(ang1 * 15);

  if (moving == true) {
    image(mouthImage, x1, -300, 280, 200);
    cookieScalar = 1;
    cookieTranslate = 0;
  } else {
    image(mouthImage, x2, -300, 280, 200);
    cookieScalar = 0.5;
    cookieTranslate = 400;
  }

  drawCookie();

  ang1 += 0.02;
  // render terrain - perlin noise
  terrain();

  instructions();
}

function mouseClicked() {
  // proceduralConst -= 1;
  if (gameStarted == true) {
    if (moving == false) {
      moving = true;
    } else {
      moving = false;
    }

    x2 = x1;  // record the final mouth position

    if (150 >= x2 +10 && 150 <= x2 + 290) {
      scored = true;
    } else {
      scored = false;
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    gameStarted = true;
  }
}

// utility rendering functions
function terrain() {
  yNoiseOff = proceduralConst;
  // 2D array for noise shifted Z value
  for (let i = 0; i < row; i++) {
    terrainZ[i] = [];
    xNoiseOff = 0.0;
    for (let j = 0; j <= col + 12; j++) {
      terrainZ[i][j] = map(noise(xNoiseOff, yNoiseOff), 0, 1, -300, 100);
      xNoiseOff += 0.25;
    }
    yNoiseOff += 0.25;
  }

  // prepare for rendering
  push();
  rotateX(PI / 3);
  translate(-width / 2 + 50, -height / 2 + 350);

  noStroke();
  terrainColors = [color(246, 199, 207, 250), color(217, 238, 243, 250)];
  let colorIndex = 1;

  // rendering
  for (let i = 0; i < row; i++) {
    for (let j = 0; j <= col + 7; j++) {
      fill(terrainColors[colorIndex % 2]);
      square(j * scale, i * scale, terrainZ[i][j], scale);
      colorIndex++;
    }
  }
  pop();
}

function drawCookie() {
  push();
  rotateX(PI / 3);
  translate(150, 350 - cookieTranslate, 10);
  shaderTexture.shader(cookieShader);
  cookieShader.setUniform("resolution", [width, height]);
  cookieShader.setUniform("time", millis() / 1000.0);
  cookieShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  shaderTexture.rect(0, 0, width, height);
  texture(shaderTexture);

  //fill("#CF9B48");
  stroke("#F0DFC3");
  strokeWeight(15);
  //rotateX(PI / 3);
  rotateZ(frameCount * 0.01);

  circle(0, 0, 120 * cookieScalar);

  pop();
}

function instructions() {
  
  
  if(gameStarted == false) {
    push();
    textSize(32);
  text("Left click to feed the baby space cookie! ", -200, 100);
  text("Click again to replay! ", -200, 140);
  text("Press ENTER to start! ", -200, 180);
    pop();
  } else {
    push();
    textSize(32);
    text("I love cookies! ", -200, 100);
    pop();
    if(moving == false) {
      if (scored == true) {
    textSize(50);
    text("Thank you for the cookie! ", -200, 230);
  } else {
    textSize(50);
    text("Sorry, you missed! ", -200, 230);
  }
  
    }
  }
  
  
}
