var gameChar_x, gameChar_y;

const collectible = {};
const shared = {
	width: 1300,
	height: 900,
};

const ground_level = shared.height*0.85;

function setup()
{
	createCanvas(shared.width, shared.height);
	gameChar_x = 50;
	gameChar_y = 430;
	frameRate(60);
}

function draw()
{
	//fill the sky blue
	background(100, 155, 255); 

	//draw the sun
	drawTheSun(theSun = {xPos: 300, yPos: height/6, size: 150, ray_Angle: 0}); 

	//The ground, Canyon, Trees and Moutains
	drawGround({upperLayer: {grassDept: 70}}); 	
	drawCanyon({canyon: {canyon_Xpos: 130, canyon_Size: 150}}); 
	drawCloud({cloud: {cloudX: 120, cloudXmax: 550, cloudY: 150, cloudYrange: 45, cloudSize: 80, duration: 5}}); 
	drawCloud({cloud: {cloudX: 450, cloudXmax: 900, cloudY: 120, cloudYrange: 60, cloudSize: 80, duration: 7}});
	drawCloud({cloud: {cloudX: 800, cloudXmax: 1300, cloudY: 160, cloudYrange: 90, cloudSize: 60, duration: 7}});
	drawGreenTree({trunk: {trunkX: 1000, trunkWidth: 70, trunkHeight: 170}});
	drawRedTree({trunk: {trunkX: 600, trunkWidth: 100, trunkHeight: 150}});
	//console.log(drawCloud().cloudX); //How to access object property from inside a function? My return doesnt work


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

	//Character
	push();
	strokeWeight(1);
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
	pop();
}

function drawCanyon({canyon: {canyon_Xpos, canyon_Size}}){
	push();
	noStroke();
	fill(100, 155, 255); //form of the canyon
	triangle(canyon_Xpos, ground_level, canyon_Xpos + canyon_Size, ground_level, canyon_Xpos + canyon_Size/2, height+200);
	fill(100, 155, 255);
	triangle(canyon_Xpos, ground_level+ 50, canyon_Xpos + canyon_Size, ground_level + 50, canyon_Xpos + canyon_Size/2, height+200);

	// Let it burn babe!
	for (let k = 0; k < 100; k++) {
		fill(random(175,255), random(0,175), 0, random(0, 30));
		let r1 = random(canyon_Xpos + canyon_Size*0.1, canyon_Xpos+ canyon_Size*0.9);
		let r2 = random(canyon_Xpos + canyon_Size*0.2, canyon_Xpos+ canyon_Size*0.8);
		let r3 = random(canyon_Xpos + canyon_Size*0.3, canyon_Xpos+ canyon_Size*0.7);
		let h = random(ground_level, ground_level + 50);
		triangle(r1, height, r2, height, r3, h);
	}
	pop();
}

function drawGround({upperLayer: {grassDept}}){
	push();
	noStroke();
	//Upper Layer
	fill(161, 223, 80); //Inchworm
	rect(0, ground_level, width, height - ground_level); 

	//Middle layer
	fill(47, 79, 79);
	rect(0, ground_level + grassDept*0.4, width, height - ground_level - grassDept*0.6); 

	//Bottom layer
	fill(51,51,0);
	rect(0, ground_level + grassDept*1.5, width, height - ground_level - grassDept); 
	pop();
}

function drawCloud({cloud: {cloudX, cloudXmax, cloudY, cloudYrange, cloudSize, duration}}) {
	push();
	angleMode(RADIANS);
	noStroke();
	let time = Date.now()/ 1000 //time in seconds
	let t = map(sin(time/duration * PI), -1, 1, 0, 1) //map t so that t in range of 0 and 1. because if t = sin(time/duration * PI) t is in the range of [-1,1]
	cloudX = lerp(cloudX, cloudXmax, t);

	let timeY = Date.now()/ 3000 //time in seconds
	let t2 = sin(timeY/duration/3 * 90);
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
	pop();
	//return cloud.cloudX ?
}

function drawGreenTree({trunk: {trunkX, trunkWidth, trunkHeight}}){
	push();
	let treeCenterX = trunkX + trunkWidth/2;
	let treeCenterY = ground_level - trunkHeight;
	let treebough = trunkWidth*1.5;	

	// The trunk
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
	pop();

	//return trunk; ?
}

function drawRedTree({trunk: {trunkX, trunkWidth, trunkHeight}}){
	push();
	let treeCenterX = trunkX + trunkWidth/2;
	let treeCenterY = ground_level - trunkHeight;
	let treebough = trunkWidth*1.5;	

	// The trunk
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
	pop();
}

function drawTheSun(theSun = {xPos, yPos, size, ray_Angle}) 
{
	push();
	strokeWeight(1); // draw sun rays
	for (let i=0; i<20; i++){
		stroke(250, 250, 210) //LightGoldenRod Yellow
		let x1 = theSun.xPos + random(theSun.size/2,theSun.size)*cos(theSun.ray_Angle);
		let y1 = theSun.yPos + random(theSun.size/2,theSun.size)*sin(theSun.ray_Angle);
		ellipse(x1, y1, 0.1, 0.1);
		line(theSun.xPos, theSun.yPos, x1, y1);
		theSun.ray_Angle ++;
	}
	
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
	pop();
}

function mousePressed() {
	gameChar_x = mouseX;
	gameChar_y = mouseY;
}


