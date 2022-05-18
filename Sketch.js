// This is truly a fantastic experience! Coding this 2D game, making it feels alive is a journey that I will never be able to forget.
// Some of the features of my game
// 1. Canyon with burning fire
// 2. Randomized clouds in height, size and speed
// 3. Sun that shines particle of light using mathematics

// DECLARE VARIABLE
// Character & Character Movement
let gameChar_x, gameChar_y;
let isLeft;
let isRight;
let isFalling
let isPlummeting;

// Shared canvas size and ground level
const shared = {
	width: 1300,
	height: 900,
};
const ground_level = shared.height*0.85;

// Control Time and Space variable
const dayTime = 5; // -> How many seconds sun and moon complete its circle
let risetime;
let scrollPos;

// Objects & Graphics
// Clouds
const clouds ={};
clouds.cloud_Xpos =[];
clouds.cloud_Ypos =[];
clouds.Duration = [];
clouds.Size = [];

// Canyons
const canyons ={};
canyons.canyon_Xpos =[];
canyons.canyon_Size =[];
canyons.dept;

// Collectibles
const collectible = {};

// StarrySky
let starrySky;

function setup() {
	frameRate(60);
	// Character & Character Movement
	gameChar_x = 50;
	gameChar_y = ground_level;
	isFalling = isPlummeting = false;
	isLeft = isRight = false;
	
	// Canvas, frameRate and the variable to control day and night
	createCanvas(shared.width, shared.height);
	risetime = 0.5;
	scrollPos = 0;
	
	// Objects & Graphics
	// Clouds
	clouds.cloud_Xpos.push(200, 500, 800, 330, 550, 700);
	
	// Canyon
	canyons.canyon_Xpos.push(240, 820, 1300, 1900, 2500);
	for (let i = 0; i < canyons.canyon_Xpos.length; i++){
		// Enter canyon size
		canyons.canyon_Size.push(120);
	}
	canyons.dept = 0;
	
	// Draw the starry sky
	starrySky = createGraphics(shared.width, ground_level);
	starrySky.starX = [];
	starrySky.starY = [];
	for (let i = 1; i< 100; i++){
		starrySky.starX.push(Math.floor(random(starrySky.width)));
		starrySky.starY.push(Math.floor(random(starrySky.height)));
	}

	for (let i = 1; i< 100; i++){
		starrySky.stroke(255);
		starrySky.ellipse(Math.floor(random(starrySky.width)), Math.floor(random(starrySky.height)), 1, 1);
	}
}

function draw() 
{
	Calculate_Time();

	// Draw the Sky();
	let skyRed = map(risetime, 0, 1, 100, 0);
	let skyGreen = map(risetime, 0, 1, 155, 0);
	let skyBlue = map(risetime, 0, 1, 255, 0);
	background(skyRed, skyGreen, skyBlue);
	image(starrySky, 0, 0);

	// The Sun and The Moon
	drawTheSun(theSun = {xPos: 400, yPos: height/6, size: 150, ray_Angle: 0}); 
	drawTheMoon(theMoon = {xPos: 800, maxHeight: height/4.5});

	// Draw The ground
	drawGround({upperLayer: {grassDept: (height - ground_level)/3}});
	
	push();
	translate(scrollPos, 0);
	
	// The Clouds
	getCloudProperties();
	for (let i=0; i< clouds.cloud_Xpos.length; i++) {
		drawCloud({cloud : {cloudX: clouds.cloud_Xpos[i], cloudXmax: clouds.cloud_Xpos[i]+width/3, cloudY: clouds.cloud_Ypos[i], cloudYrange: 45, cloudSize: clouds.Size[i], duration: clouds.Duration[i]}}); 
	}

	// The Trees
	drawGreenTree({trunk: {trunkX: 1000, trunkWidth: 70, trunkHeight: 170}});
	drawRedTree({trunk: {trunkX: 600, trunkWidth: 100, trunkHeight: 150}});

	// Canyon and Moutains
	for (let i=0; i < canyons.canyon_Xpos.length; i++){
		drawCanyon(canyon = {Xpos: canyons.canyon_Xpos[i], Size: canyons.canyon_Size[i], Dept: canyons.dept})
	}
			
	//a collectable token
	collectible.x_pos = 520;
	collectible.y_pos = 700;
	collectible.size = 60;

	fill(255,255,255);
	ellipse(collectible.x_pos,collectible.y_pos, collectible.size/6, collectible.size);
	ellipse(collectible.x_pos,collectible.y_pos, collectible.size , collectible.size/6);
	ellipse(collectible.x_pos,collectible.y_pos, collectible.size/2, collectible.size/2);
	fill(255,215,0);
	ellipse(collectible.x_pos,collectible.y_pos, collectible.size/3, collectible.size/3); 
	
	pop();

	checkCollision_Canyon();
	// Check Falling
	if (gameChar_y < ground_level) {
		isFalling = true;
	} else {isFalling = false}

	if (isPlummeting == true) {
		gameChar_y += 5;
	} 

	//Apply true death wherever character is below ground level to fix the bug where character escape perimeter of the canyon right after falling in and can just walk underground.
	if (gameChar_y > ground_level) {
		gameChar_y +=10;
	}
	

	// Execute Movement
	if (isLeft && isFalling) {
		gameChar_x -= 4;
		gameChar_y += 3;
		isJumpingLeft();

	} else if (isRight && isFalling) {
		gameChar_x += 4;	
		gameChar_y += 3;
		isJumpingRight();

	} else if (isLeft) {
	if(gameChar_x > width * 0.2) {
		gameChar_x -= 5;
	} else { scrollPos += 5;}
		isWalkingLeft();

	} else if (isRight) {
	if(gameChar_x < width * 0.8) {
			gameChar_x  += 5;
	} else { scrollPos -= 5;}
		isWalkingRight();
		
	} else if (isFalling || isPlummeting) {
		gameChar_y += 3;
		isJumping(); 
	} else {// Standing still
		isStanding();
	}
	console.log("gameChar_x: " + gameChar_x);
	console.log("canyons x: " + canyons.canyon_Xpos);
}

function Calculate_Time()
{
	let time = Date.now()/1000
	let duration = dayTime; // Day time
	risetime  = map(sin(time/duration * PI), -1, 1, 0, 1);
}

function getCloudProperties()
{
	for (let i=0; i<clouds.cloud_Xpos.length; i++){
		clouds.cloud_Ypos.push(Math.floor(random(150, 250)));
		clouds.Duration.push(Math.floor(random(5, 10)));
		clouds.Size.push(Math.floor(random(50, 80)));
	}
}

function drawCloud({cloud: {cloudX, cloudXmax, cloudY, cloudYrange, cloudSize, duration}}) 
{
	angleMode(RADIANS);
	noStroke();
	let time = Date.now()/ 1000 //time in seconds
	let t = map(sin(time/duration * PI), -1, 1, 0, 1) //map t so that t in range of 0 and 1. because if t = sin(time/duration * PI) t is in the range of [-1,1]
	cloudX = lerp(cloudX, cloudXmax, t);

	let timeY = Date.now()/ 3000 //time in seconds
	let t2 = sin(timeY/duration/3 *90); //Higher the number equal moving up and down more cos the sin curve is steeper
	cloudY = lerp(cloudY, cloudY + cloudYrange, t2);

	//drawCloud({cloud: {cloudX: 120, cloudXmax: 550, cloudY: 150, cloudYrange: 45, cloudSize: 80, duration: 5}})
	fill(173, 216, 230, 180); // Light Blue
	ellipse(cloudX + cloudSize*0.56, cloudY - cloudSize*0.19, cloudSize*0.5, cloudSize*0.5);
	ellipse(cloudX + cloudSize*0.81, cloudY - cloudSize*0.19, cloudSize*0.3, cloudSize*0.3);
	ellipse(cloudX + cloudSize*0.31, cloudY - cloudSize*0.19, cloudSize*0.3, cloudSize*0.3);

	fill(173, 216, 230, 180); // Light Blue
	ellipse(cloudX - cloudSize*0.5, cloudY - cloudSize*0.12, cloudSize*0.5, cloudSize*0.5);
	ellipse(cloudX - cloudSize*0.75, cloudY - cloudSize*0.12, cloudSize*0.3, cloudSize*0.3);
	ellipse(cloudX - cloudSize*0.25, cloudY - cloudSize*0.12, cloudSize*0.3, cloudSize*0.3);
		
	fill(250, 235, 215); // Antique White
	ellipse(cloudX - cloudSize*0.31, cloudY + cloudSize*0.5, cloudSize*1.05, cloudSize*0.75);
	ellipse(cloudX + cloudSize*0.37, cloudY + cloudSize*0.43, cloudSize*1.05, cloudSize*0.75);

	fill(245, 245, 245); // White Smoke
	ellipse(cloudX, cloudY, cloudSize, cloudSize);
	ellipse(cloudX - cloudSize*0.4, cloudY + cloudSize*0.31, cloudSize*1.2, cloudSize*0.75);
	ellipse(cloudX + cloudSize*0.31, cloudY + cloudSize*0.005, cloudSize*1.05, cloudSize*0.75);
	ellipse(cloudX + cloudSize*0.81, cloudY + cloudSize*0.37, cloudSize*1.3, cloudSize*0.75);
	ellipse(cloudX + cloudSize*0.19, cloudY + cloudSize*0.37, cloudSize*0.5, cloudSize*0.75);
}

function drawGround({upperLayer: {grassDept}}) 
{
	//Upper Layer
	fill(161, 223, 80); //Inchworm
	rect(0, ground_level, width, height); 

	//Middle layer
	fill(47, 79, 79);
	// rect(0, ground_level + grassDept*0.4, width, height - ground_level - grassDept*0.6); 
	rect(0, ground_level + grassDept, width, ground_level - grassDept); 

	//Bottom layer
	fill(51,51,0);
	rect(0, ground_level + grassDept*1.5, width, height - ground_level - grassDept); 
	canyons.dept = grassDept;
}

function drawCanyon(canyon = {Xpos, Size, Dept}) 
{
	noStroke();
	//form of the canyon
	fill(50, 0, 0);
	quad(canyon.Xpos, ground_level, canyon.Xpos + canyon.Size, ground_level, canyon.Xpos + canyon.Size, ground_level + canyon.Dept, canyon.Xpos, ground_level + canyon.Dept);
	fill(50, 0, 0);
	triangle(canyon.Xpos, ground_level+ canyons.dept, canyon.Xpos + canyon.Size, ground_level + canyons.dept, canyon.Xpos + canyon.Size/2, height+200);


	// Let it burn babe!
	for (let k = 0; k < 100; k++) {
		fill(random(175,255), random(0,175), 0, random(0, 30));
		let r1 = random(canyon.Xpos + canyon.Size*0.1, canyon.Xpos+ canyon.Size*0.9);
		let r2 = random(canyon.Xpos + canyon.Size*0.2, canyon.Xpos+ canyon.Size*0.8);
		let r3 = random(canyon.Xpos + canyon.Size*0.3, canyon.Xpos+ canyon.Size*0.7);
		let h = random(ground_level+50, ground_level + 150);
		triangle(r1, height, r2, height, r3, h);
	}
}

function checkCollision_Canyon() {
	for (let i=0; i< canyons.canyon_Xpos.length; i++){
		if (gameChar_x> canyons.canyon_Xpos[i] && gameChar_x < canyons.canyon_Xpos[i] + canyons.canyon_Size[i] && gameChar_y >= ground_level){
			isPlummeting = true;
			return isPlummeting;
		} else {isPlummeting = false};
	}
}

function drawGreenTree({trunk: {trunkX, trunkWidth, trunkHeight}}) 
{
	let treeCenterX = trunkX + trunkWidth/2;
	let treeCenterY = ground_level - trunkHeight;
	let treebough = trunkWidth*1.5;	

	// The trunk
	strokeWeight(1);
	fill(105,75,55);
	triangle(trunkX, ground_level, trunkX + trunkWidth, ground_level, trunkX + trunkWidth/2, treeCenterY);
	stroke(165,99,60);
	ellipse(treeCenterX, ground_level - trunkHeight*0.3, trunkWidth*0.6, trunkHeight*0.5);
	ellipse(treeCenterX, ground_level - trunkHeight*0.3, trunkWidth*0.5, trunkHeight*0.4);
	ellipse(treeCenterX, ground_level - trunkHeight*0.3, trunkWidth*0.3, trunkHeight*0.3);
	noStroke();

	// The Leaves
	fill(88, 169, 30);
	ellipse(treeCenterX - treebough/2, treeCenterY*1.05, treebough*0.5, treebough*0.5);
	ellipse(treeCenterX + treebough/2, treeCenterY*1.05, treebough*0.5, treebough*0.5);
	ellipse(treeCenterX, treeCenterY, treebough, treebough*1.2);

	fill(88, 200, 30, 100);
	ellipse(treeCenterX, treeCenterY*0.995, treebough*0.8, treebough*1);
	fill(88, 200, 30, 150);
	ellipse(treeCenterX, treeCenterY*0.995, treebough*0.5, treebough*0.7);
	ellipse(treeCenterX - treebough/2, treeCenterY*1.05, treebough*0.2, treebough*0.2);
	ellipse(treeCenterX + treebough/2, treeCenterY*1.05, treebough*0.2, treebough*0.2);
}

function drawRedTree({trunk: {trunkX, trunkWidth, trunkHeight}}) 
{
	let treeCenterX = trunkX + trunkWidth/2;
	let treeCenterY = ground_level - trunkHeight;
	let treebough = trunkWidth*1.5;	

	// The trunk
	strokeWeight(1);
	fill(222,184,135);
	triangle(trunkX, ground_level, trunkX + trunkWidth, ground_level, trunkX + trunkWidth/2, treeCenterY);
	stroke(165,99,60);
	ellipse(treeCenterX, ground_level - trunkHeight*0.3, trunkWidth*0.6, trunkHeight*0.5);
	ellipse(treeCenterX, ground_level - trunkHeight*0.3, trunkWidth*0.5, trunkHeight*0.4);
	ellipse(treeCenterX, ground_level - trunkHeight*0.3, trunkWidth*0.3, trunkHeight*0.3);
	noStroke();

	// The Leaves
	fill(123,29,0);
	ellipse(treeCenterX - treebough/2, treeCenterY*1.05, treebough*0.5, treebough*0.5);
	ellipse(treeCenterX + treebough/2, treeCenterY*1.05, treebough*0.5, treebough*0.5);
	ellipse(treeCenterX, treeCenterY, treebough, treebough*1.2);

	fill(213,71,0,100);
	ellipse(treeCenterX, treeCenterY*0.995, treebough*0.8, treebough*1);
	fill(213,71,0,150);
	ellipse(treeCenterX, treeCenterY*0.995, treebough*0.5, treebough*0.7);
	ellipse(treeCenterX - treebough/2, treeCenterY*1.05, treebough*0.2, treebough*0.2);
	ellipse(treeCenterX + treebough/2, treeCenterY*1.05, treebough*0.2, treebough*0.2);
}

function drawTheSun(theSun = {xPos, yPos, size, ray_Angle}) 
{
	angleMode(RADIANS);
	let t = risetime;
	theSun.yPos = lerp(theSun.yPos, height*2, t)

	// draw the sun
	strokeWeight(0);
	fill(255, 253, 55); // sunshine yellow 
	ellipse(theSun.xPos, theSun.yPos, theSun.size); //the core of the sun
	fill(255, 165, 0 , 100); // sun radiance
	ellipse(theSun.xPos, theSun.yPos, theSun.size*1.1);
	
	fill(0); // The sun eyes
	ellipse(theSun.xPos-theSun.size/6, theSun.yPos - theSun.size/12, theSun.size/7);
	ellipse(theSun.xPos+theSun.size/6, theSun.yPos - theSun.size/12, theSun.size/7);

	noFill(); //The sun mouth
	strokeWeight(5);
	stroke(255, 165, 0);
	arc(theSun.xPos, theSun.yPos-theSun.size/50, theSun.size*0.2, theSun.size*0.2, 0.1*PI, 0.9*PI);
	
	// draw the sun particles
	for (let i=0; i<20; i++){
		stroke(250, 250, 210) //LightGoldenRod Yellow
		let k = map(abs(theSun.yPos-height), 0, height, 0.65, 1.2);
		let x1 = theSun.xPos + random(theSun.size*0.5,theSun.size*k)*cos(theSun.ray_Angle);
		let y1 = theSun.yPos + random(theSun.size*0.5,theSun.size*k)*sin(theSun.ray_Angle);
		fill(255, 253, 55);
		ellipse(x1, y1, 10, 10);
		// line(theSun.xPos, theSun.yPos, x1, y1); // old code for sun rays, works fine but not as beautiful.
		theSun.ray_Angle ++;
	}
}

function drawTheMoon(theMoon = {xPos, maxHeight})
{
	//Take risetime from the Sun and reverse it by using map function
	theMoon.yPos = map(risetime, 0, 1, height, theMoon.maxHeight);
	
	// draw the moon
	noStroke();
	fill(254, 252, 215);
	ellipse(theMoon.xPos, theMoon.yPos, theSun.size*0.7, theSun.size*0.7); //Moon has to be smaller than the sun
	for(i = 0; i < theSun.size*0.45; i++){
		fill(254,252,215,2);
	  	ellipse(theMoon.xPos,theMoon.yPos, i*3);
	}
}

function keyPressed()
{
	if(key == 'A' || keyCode == 37) {
		isLeft = true;
	}

	if(key == 'D' || keyCode == 39) {
		isRight = true;
	}
	if (key == " " || keyCode == 32 && gameChar_y == ground_level) {
		gameChar_y -= 150;  //Jump Heigth 150
	}

}

function keyReleased()
{
	if(key == 'A' || keyCode == 37)	{
		isLeft = false;
	}

	if(key == 'D' || keyCode == 39)	{
		isRight = false;
	}
	if (key == " " || keyCode == 32 && gameChar_y < ground_level) {
		isJumping();
	}
}

function isStanding() {
	fill(255,0,0); //body
	rect(gameChar_x - 12, gameChar_y - 50, 26, 40);
	fill(255,120,0); //legs
	rect(gameChar_x + 4, gameChar_y - 10, 10,13);
	rect(gameChar_x - 12, gameChar_y - 10, 10,13);
	stroke(10);//arms
	line(gameChar_x - 12, gameChar_y - 50, gameChar_x - 20, gameChar_y - 24);
	line(gameChar_x + 12, gameChar_y - 50, gameChar_x + 20, gameChar_y - 24);
	fill(255,222,173); //hands
	ellipse(gameChar_x - 20, gameChar_y - 24, 8, 8);
	ellipse(gameChar_x + 20, gameChar_y - 24, 8, 8);
	fill(255,222,173); // head
	noStroke();
	ellipse(gameChar_x, gameChar_y - 55, 20, 20);
	fill(0,0,0) // eyes
	ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
	ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
}

function isWalkingLeft() {
	fill(255,0,0); //body
	rect(gameChar_x - 12, gameChar_y - 50, 26, 40);
	fill(255,120,0); //legs
	rect(gameChar_x + 2, gameChar_y - 10, 10,13);
	rect(gameChar_x - 4, gameChar_y - 10, 10,13);
	stroke(10);//arms
	line(gameChar_x - 12, gameChar_y - 50, gameChar_x, gameChar_y - 24);
	line(gameChar_x + 12, gameChar_y - 50, gameChar_x + 20, gameChar_y - 24);
	fill(255,222,173); //hands
	ellipse(gameChar_x, gameChar_y - 24, 8, 8);
	ellipse(gameChar_x + 20, gameChar_y - 24, 8, 8);
	fill(255,222,173); // head
	noStroke();
	ellipse(gameChar_x, gameChar_y - 55, 20, 20);
	fill(0,0,0) // eyes
	ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
	//ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
}

function isWalkingRight() {
	fill(255,0,0); //body
	rect(gameChar_x - 12, gameChar_y - 50, 26, 40);
	fill(255,120,0); //legs
	rect(gameChar_x - 10, gameChar_y - 10, 10,13);
	rect(gameChar_x - 2, gameChar_y - 10, 10,13);
	stroke(10);//arms
	line(gameChar_x - 12, gameChar_y - 50, gameChar_x - 20, gameChar_y - 24);
	line(gameChar_x + 12, gameChar_y - 50, gameChar_x, gameChar_y - 24);
	fill(255,222,173); //hands
	ellipse(gameChar_x - 20, gameChar_y - 24, 8, 8);
	ellipse(gameChar_x, gameChar_y - 24, 8, 8);
	fill(255,222,173); // head
	noStroke();
	ellipse(gameChar_x, gameChar_y - 55, 20, 20);
	fill(0,0,0) // eyes
	//ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
	ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);	
}

function isJumping() {
	fill(255,0,0); //body
	rect(gameChar_x - 12, gameChar_y - 50, 26, 40);
	fill(255,120,0); //legs
	rect(gameChar_x + 4, gameChar_y - 10, 10,13);
	rect(gameChar_x - 12, gameChar_y - 10, 10,13);
	stroke(10);//arms
	line(gameChar_x - 12, gameChar_y - 40, gameChar_x - 20, gameChar_y - 54);
	line(gameChar_x + 12, gameChar_y - 40, gameChar_x + 20, gameChar_y - 54);
	fill(255,222,173); //hands
	ellipse(gameChar_x - 20, gameChar_y - 54, 8, 8);
	ellipse(gameChar_x + 20, gameChar_y - 54, 8, 8);
	fill(255,222,173); // head
	noStroke();
	ellipse(gameChar_x, gameChar_y - 55, 20, 20);
	fill(0,0,0) // eyes
	ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
	ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
}

function isJumpingRight() {
	fill(255,0,0); //body
	rect(gameChar_x - 12, gameChar_y - 50, 26, 40);
	fill(255,120,0); //legs
	rect(gameChar_x - 10, gameChar_y - 10, 10,13);
	rect(gameChar_x - 2, gameChar_y - 10, 10,13);
	stroke(10);//arms
	line(gameChar_x - 12, gameChar_y - 40, gameChar_x - 20, gameChar_y - 54);
	line(gameChar_x + 12, gameChar_y - 40, gameChar_x, gameChar_y - 14);
	fill(255,222,173); //hands
	ellipse(gameChar_x - 20, gameChar_y - 54, 8, 8);
	ellipse(gameChar_x, gameChar_y - 14, 8, 8);
	fill(255,222,173); // head
	noStroke();
	ellipse(gameChar_x, gameChar_y - 55, 20, 20);
	fill(0,0,0) // eyes
	//ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
	ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
}

function isJumpingLeft() {
	fill(255,0,0); //body
	rect(gameChar_x - 12, gameChar_y - 50, 26, 40);
	fill(255,120,0); //legs
	rect(gameChar_x + 2, gameChar_y - 10, 10,13);
	rect(gameChar_x - 4, gameChar_y - 10, 10,13);
	stroke(10);//arms
	line(gameChar_x - 12, gameChar_y - 40, gameChar_x, gameChar_y - 14);
	line(gameChar_x + 12, gameChar_y - 40, gameChar_x + 20, gameChar_y - 54);
	fill(255,222,173); //hands
	ellipse(gameChar_x, gameChar_y - 14, 8, 8);
	ellipse(gameChar_x + 20, gameChar_y - 54, 8, 8);
	fill(255,222,173); // head
	noStroke();
	ellipse(gameChar_x, gameChar_y - 55, 20, 20);
	fill(0,0,0) // eyes
	ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
	//ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
}



