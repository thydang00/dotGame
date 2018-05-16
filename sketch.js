/* EXAMPLE FROM P5.JS */

var rad = 60;
var xpos, ypos;
var xspeed = 2.2;
var yspeed = 2.8;
var xdirection = 1;
var ydirection = 1;

function setup() {
	createCanvas(400, 400);
  	noStroke();
  	frameRate(30);
  	ellipseMode(RADIUS);
  	xpos = width / 2;
  	ypos = height / 2;
}

function draw() {
  background(0);

  xpos = xpos + xspeed * xdirection;
  ypos = ypos + yspeed * ydirection;

  if (xpos > width - rad || xpos < rad) {
    xdirection *= -1;
  }
  if (ypos > height - rad || ypos < rad) {
    ydirection *= -1;
  }

  ellipse(xpos, ypos, rad, rad);
}
