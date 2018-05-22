var Player = {
	LIVES: 3,
	SCORE: 0,
	LEVEL: 0,
	TITLE: ["", "Chiayo", "Noob", "Apprentice", "Journeywomyn", "Master",
			"Grandmaster", "Legendary", "Prodigy", "Thy"],
};

var Paddle = {
    WIDTH: 60,
    HEIGHT: 10,
    RADIUS: 10,
    Y: 360,
    
    location: () => { 
    	return mouseX - Paddle.WIDTH / 2;
    },

    draw: () => { 
    	fill(255, 255, 255);
    	rect(
    		Paddle.location(), 
    		Paddle.Y, 
    		Paddle.WIDTH, 
    		Paddle.HEIGHT,
    		Paddle.RADIUS,
    	)
    },
};

var Ball = {
	SIZE: 20,
	SPEED_X: 4,
	SPEED_Y: 3,
	X: random(10, 390),
	Y: 15,

	update: () => {
		// apply vertical and horizontal speed
		Ball.X += Ball.SPEED_X;
		Ball.Y += Ball.SPEED_Y;

		// ball bounces off 2 side walls
		if(Ball.X > width - Ball.SIZE / 2 || Ball.X < Ball.SIZE / 2)
        	Ball.SPEED_X *= -1; // ball bounces left / right
    
    	// ball bounces off top and bottom
    	if(Ball.Y <  Ball.SIZE / 2)
        	Ball.SPEED_Y *= -1; // ball bounces down

    	if(Ball.Y >= height - Ball.SIZE / 2) {
        	Ball.Y = 15; 	   // reset position of ball on top of canvas
        	Player.LIVES -= 1; // number of lives decreases by 1
    	}

    	/** paddle collision detection **/
    	if(Ball.Y > Paddle.Y - Ball.SIZE / 2
    		&& Ball.X > Paddle.location()
    		&& Ball.X < Paddle.location() + Paddle.WIDTH) {
				Ball.SPEED_Y *= -1; // ball bounces up
		}
    },

    draw: () => {
    	fill(252, 248, 138);
    	ellipse(Ball.X, Ball.Y, Ball.SIZE, Ball.SIZE);

    	Ball.update();
    },
};

var Skeets = {
	LIST: [],
	SIZE: 40,
	NUM_OBJ: 0,

	create: (num) => {
		Skeets.LIST = [];
		Skeets.NUM_OBJ = num;
		for(var i = 0; i < Skeets.NUM_OBJ; i++) {
			Skeets.LIST[i] = {
        		collision: false,
				x: random(10, 390), 
				y: random(10, 200),
				c: color(
					random(0, 225), 
					random(0, 255), 
					random(0, 255),
				)
			}
		}
	},

	vanquish: () => {
		for(var u = 0; u < Skeets.LIST.length; u++) {
			if(Skeets.LIST[u].collision) {
				Skeets.LIST.splice(u, 1);
				Player.SCORE++;
				Skeets.NUM_OBJ--;
			}
		}
	},

	update: () => {
		for(var obj = 0; obj < Skeets.LIST.length; obj++) {
			if(dist(Ball.X, Ball.Y, Skeets.LIST[obj].x, Skeets.LIST[obj].y) 
				< (Skeets.SIZE/2 + Ball.SIZE / 2)) 
					Skeets.LIST[obj].collision = true;
    	}
	},

	draw: () => {
		for(var ob = 0; ob < Skeets.LIST.length; ob++) {
			fill(Skeets.LIST[ob].c);
			ellipse(
				Skeets.LIST[ob].x, 
				Skeets.LIST[ob].y, 
				Skeets.SIZE, 
				Skeets.SIZE,
			);
		}

		Skeets.update();
		Skeets.vanquish();
	},
};

var Game = {
	INTRO: 0,
	COMPLETED: 1,
	OVER: 2,
	
	state: () => {
		if(Player.LEVEL ===  0) return Game.INTRO;
		if(Player.LIVES ===  0) return Game.OVER;
		if(Player.LEVEL === 11) return Game.COMPLETED;
	},

	reset: () => {
		Player.LIVES = 3;
		Player.LEVEL = 0;
		Player.SCORE = 0;

		Skeets.SIZE = 40;
		Skeets.LIST = [];
		Skeets.NUM_OBJ = 0;

		Ball.SPEED_Y = 3;
		Ball.SPEED_X = 4;

		Paddle.WIDTH = 60;
	},

	message: (type) => {
		fill(255);
		textSize(15);
		textFont("Monospace");
		
		switch(type) {
		case Game.INTRO:
			text("Welcome to A Dot Game\n\nClick anywhere to play", 30, 150);
			break;
		case Game.COMPLETED:
			text("Congratulations!", 30, 150);
			break;
		
		case Game.OVER:
			text("Game Over. You're a " + 
					Player.TITLE[Player.LEVEL -1] + "!", 30, 150);
			text("Score  " + Player.SCORE, 30, 210);

			/* fall through */
		
		default:
			break;
		}
	},

	text: () => {
		fill(255);
    	text(Player.SCORE, 30, 50);
    	text("<3 ".repeat(Player.LIVES), 300 + 27 * (3 - Player.LIVES), 30);
    	text(Player.TITLE[Player.LEVEL - 1], 30, 30);

    	// debug
    	//text("speed_x: " + Math.abs(Ball.SPEED_X), 30, 60);
    	//text("speed_y: " + Math.abs(Ball.SPEED_Y), 30, 75);
    	//text("Level: " + Player.LEVEL + 
    	//		" - " + Skeets.NUM_OBJ, 30, 90);
	},

	run: () => {
		if(!Skeets.LIST.length) {
			switch(Player.LEVEL) {
			case 0:
				//Game.intro();
				break;

			case 1: 
			case 2: 
			case 3: 
				Skeets.SIZE -= 10;
				break;

			case  7:
			case  8:
			case  9:
			case 10:
				Paddle.WIDTH *= .8;
				/* fall through */

			case 4:
			case 5:
			case 6:
				var _abs = (n) => Math.abs(n);
				var _neg = (n) => (n < 0) ? -1 : +1;

				Ball.SPEED_X = _neg(Ball.SPEED_X) * (_abs(Ball.SPEED_X) + .5)
				Ball.SPEED_Y = _neg(Ball.SPEED_Y) * (_abs(Ball.SPEED_Y) + .5)
				break;
			}
			Skeets.create(Player.LEVEL++);
		}
		Skeets.draw();
		Paddle.draw();
		Ball.draw();		
	}
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function setup() {
    createCanvas(400, 400);
    noStroke();
}

function draw() {
    background(0); // clear screen

    switch(Game.state()) {
    case Game.INTRO:
    	Game.message(Game.INTRO);
    	if(mouseIsPressed)
			Player.LEVEL = 1;
		break;
    case Game.COMPLETED:
    	Game.message(Game.COMPLETED);
    	if(mouseIsPressed) 
    		Game.reset();
    	break;
    
    case Game.OVER:
    	Game.message(Game.OVER);
    	if(mouseIsPressed) 
    		Game.reset();
    	break;
    
    default:
    	Game.run();
    	Game.text();
    }
}