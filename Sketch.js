var gameChar_x, gameChar_y;

const collectable = {};
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
	background(100, 155, 255); //fill the sky blue

	drawGround({upperLayer: {grassDept: 70}}); 	
	drawCanyon({canyon: {canyon_Xpos: 130, canyon_Size: 150}}); 
	drawCloud({cloud: {cloudX: 120, cloudXmax: 550, cloudY: 150, cloudYrange: 45, cloudSize: 80, duration: 5}}); 
	drawCloud({cloud: {cloudX: 450, cloudXmax: 900, cloudY: 120, cloudYrange: 60, cloudSize: 80, duration: 7}});
	drawGreenTree({trunk: {trunkX: 1000, trunkWidth: 70, trunkHeight: 170}});
	drawRedTree({trunk: {trunkX: 600, trunkWidth: 100, trunkHeight: 150}});
	//console.log(drawCloud().cloudX); //How to access object property from inside a function? My return doesnt work


	//a collectable token
	collectable.x_pos = 520;
	collectable.y_pos = 700;
	collectable.size = 60;

	fill(255,255,255);
	ellipse(collectable.x_pos,collectable.y_pos, collectable.size/6, collectable.size);
	ellipse(collectable.x_pos,collectable.y_pos, collectable.size , collectable.size/6);
	ellipse(collectable.x_pos,collectable.y_pos, collectable.size/2, collectable.size/2);
	fill(255,215,0);
	ellipse(collectable.x_pos,collectable.y_pos, collectable.size/3, collectable.size/3); 

	//Character
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
	noStroke();
}

function drawCanyon({canyon: {canyon_Xpos, canyon_Size}}){
	fill(100, 155, 255); //form of the canyon
	triangle(canyon_Xpos, ground_level, canyon_Xpos + canyon_Size, ground_level, canyon_Xpos + canyon_Size/2, height+200);
	fill(100, 155, 255);
	triangle(canyon_Xpos, ground_level+ 50, canyon_Xpos + canyon_Size, ground_level + 50, canyon_Xpos + canyon_Size/2, height+200);

	// Let it burns babe
	for (let k = 0; k < 100; k++) {
		noStroke();
		fill(random(175,255), random(0,175), 0, random(0, 30));
		let r1 = random(canyon_Xpos+canyon_Size*0.1, canyon_Xpos+canyon_Size-20);
		let r2 = random(canyon_Xpos+canyon_Size*0.2, canyon_Xpos+canyon_Size-30);
		let r3 = random(canyon_Xpos+canyon_Size*0.3, canyon_Xpos+canyon_Size-40);
		let h = random(ground_level, ground_level + 50);
		triangle(r1, height, r2, height, r3, h);
	}
	noStroke();
}

function drawGround({upperLayer: {grassDept}}){
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
	
}

function drawCloud({cloud: {cloudX, cloudXmax, cloudY, cloudYrange, cloudSize, duration}}) {
	angleMode(RADIANS);
	noStroke();
	let time = Date.now()/ 1000 //time in seconds
	let t = map(sin(time/duration * PI), -1, 1, 0, 1) //map t so that t in range of 0 and 1. because if t = sin(time/duration * PI) t is in the range of [-1,1]
	cloudX = lerp(cloudX, cloudXmax, t);

	let timeY = Date.now()/ 3000 //time in seconds
	let t2 = sin(timeY/duration/3 * 90);
	cloudY = lerp(cloudY, cloudY + cloudYrange, t2);

	fill(173, 216, 230, 180); // Light Blue
	ellipse(cloudX + 45, cloudY-15, cloudSize*0.5, cloudSize*0.5);
	ellipse(cloudX + 65, cloudY-15, cloudSize*0.3, cloudSize*0.3);
	ellipse(cloudX + 25, cloudY-15, cloudSize*0.3, cloudSize*0.3);

	fill(173, 216, 230, 180); // Light Blue
	ellipse(cloudX - 40, cloudY-10, cloudSize*0.5, cloudSize*0.5);
	ellipse(cloudX - 60, cloudY-10, cloudSize*0.3, cloudSize*0.3);
	ellipse(cloudX - 20, cloudY-10, cloudSize*0.3, cloudSize*0.3);
		
	fill(250, 235, 215); // Antique White
	ellipse(cloudX - 25, cloudY + 40, cloudSize*1.05, cloudSize*0.75);
	ellipse(cloudX + 30, cloudY + 35, cloudSize*1.05, cloudSize*0.75);

	fill(245, 245, 245); // White Smoke
	ellipse(cloudX, cloudY, cloudSize, cloudSize);
	ellipse(cloudX - 35, cloudY + 25, cloudSize*1.2, cloudSize*0.75);
	ellipse(cloudX + 25, cloudY + 5, cloudSize*1.05, cloudSize*0.75);
	ellipse(cloudX + 65, cloudY + 30, cloudSize*1.3, cloudSize*0.75);
	ellipse(cloudX + 15, cloudY + 30, cloudSize*0.5, cloudSize*0.75);

	//return cloud.cloudX ?
}

function drawGreenTree({trunk: {trunkX, trunkWidth, trunkHeight}}){
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
	noStroke();

	//return trunk; ?
}

function drawRedTree({trunk: {trunkX, trunkWidth, trunkHeight}}){
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
	noStroke();
}

function mousePressed() {
	gameChar_x = mouseX;
	gameChar_y = mouseY;
}


