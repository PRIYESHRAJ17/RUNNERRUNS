var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bg;
var bgImage;
var levels1,levels2,levels3,levels4,levels5,wins;
var player, player_running,player_collided;
var ground, invisibleGround, groundImage;
var water,waterGroup;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;


var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var score;

function preload(){
  player_running = loadAnimation("image/r1.png","image/r2.png","image/r3.png","image/r4.png","image/r5.png","image/r6.png","image/r7.png","image/r8.png");
  player_collided = loadAnimation("image/rd.png");
  bgImage = loadImage("image/bg.png")
  groundImage = loadImage("image/race.png");
  levels1=loadImage("image/download.png");
  levels2=loadImage("image/images.png");
  levels3=loadImage("image/image.png");
  levels4=loadImage("image/Level-4.png");
  levels5=loadImage("image/level-5.png");
  waters=loadImage("image/water.png")
  cloudImage = loadImage("image/Png.png");
  obstacle1 = loadImage("image/h1.png");
  obstacle2 = loadImage("image/h2.png");
  obstacle3 = loadImage("image/h3.png");
  obstacle4 = loadImage("image/h4.png");
  obstacle5 = loadImage("image/h2.png");
  obstacle6 = loadImage("image/h1.png");
  
  restartImg = loadImage("image/reset.png")
  gameOverImg = loadImage("image/im.png")
  wins=loadImage("image/win.jpg");
  jumpSound = loadSound("sound/jump.mp3")
  dieSound = loadSound("sound/die.mp3")
  checkPointSound = loadSound("sound/checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  
  bg = createSprite(width/2,height/2,width,height);
  player = createSprite(60,height-100);
  level1 = createSprite(200,80);
  level2 = createSprite(200,80);
  level3 = createSprite(200,80);
  level4 = createSprite(200,80);
  level5 = createSprite(200,80);
  
  
  player.addAnimation("running", player_running);
  player.addAnimation("collided", player_collided);
  bg.addImage("bg",bgImage)
  bg.scale = 4
level1.addImage("level1",levels1);
level2.addImage("level2",levels2);
level3.addImage("level3",levels3);
level4.addImage("level4",levels4);
level5.addImage("level5",levels5);


  player.scale = 0.5;
  level4.scale=0.3;
  level5.scale=0.3;
  ground = createSprite(width/2,height-20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=1.8
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2-120);
  restart.addImage(restartImg);
  win = createSprite(width/2,height/2-200);
  win.addImage("win",wins);
  win.scale=0.5;
  gameOver.scale = 1;
  restart.scale = 0.5;
 
  
  invisibleGround = createSprite(60,height-20);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  waterGroup=createGroup();
 
  
  player.setCollider("rectangle",0,0,100,300);
  score = 0;
  
      level2.visible=false;
    level3.visible=false;
    level4.visible=false;
    level5.visible=false;
    win.visible=false;
    
  
}

function draw() {
  
  background("white");
  fill("black")

  
  
  if(gameState === PLAY){
    
    if(player.isTouching(waterGroup)){
      score+=100;
      waterGroup.destroyEach();
    }
    if(score>=700&&score<1200){
      level1.visible=false;
      level2.visible=true;

    }
     else if(score>=1200&&score<1800){
      level2.visible=false;
      level3.visible=true;}
    else if(score>=1800&&score<2400){
      level3.visible=false;
      level4.visible=true;
    }
    else if(score>=2400&&score<4000){
      level4.visible=false;
      level5.visible=true;
      level1.visible=false;
      waterbottle();
    }
    else if(score>=4000){
     level5.visible=true;
      win.visible=true;
    level1.visible=false;
      gameState=END ;

    }

    gameOver.visible = false;
    restart.visible = false;
    
    
    ground.velocityX = -(4 + 3* score/100)
    score = score + Math.round(frameRate()/30);
 
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    
 
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    player.depth = ground.depth+1
    
    if((touches.length>0||keyDown("space"))&& player.y >= 470) {
        player.velocityY = -15;
        jumpSound.play();
    }

    player.velocityY =player.velocityY + 0.8

    spawnClouds();

    spawnObstacles();
    
    if(obstaclesGroup.isTouching(player)){
      
        jumpSound.play();
        gameState = END;
        dieSound.play();
        player.x = player.x+70;
        player.y = player.y+70;
    }
    
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
    
      player.changeAnimation("collided", player_collided);
    
    
  
     
      ground.velocityX = 0;
      player.velocityY = 0

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  
  player.collide(invisibleGround);
  
  if((touches.length>0||mousePressedOver(restart))&&gameState === END) {
      gameState = PLAY
      level1.visible=true;
     obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);
    score = 0;
    player.x = 60;
    player.y = height-100;
     player.changeAnimation("running", player_running);
     level2.visible=false;
     level3.visible=false;
     level4.visible=false;
     level5.visible=false;
     win.visible=false;

    }

  drawSprites();
  textSize(40)
  text("Score: "+ score,width/2,50);
}

function reset(){
  

}

function waterbottle(){
  if(score===2400){
  water = createSprite(width+10,player.y-100);
  water.addImage("water",waters);
  water.scale=0.2;
  water.velocityX = -3;
  waterGroup.add(water);
  water.lifetime = width/3}
}
function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(width/2,height-100,10,40);
   obstacle.velocityX = -(6 + score/50);

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
        
    obstacle.scale = 0.15;
    obstacle.lifetime = width/6

   obstacle.setCollider("rectangle",0,0,200,400)

    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {

  if (frameCount % 150 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;

    cloud.lifetime = width/3
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
 
    cloudsGroup.add(cloud);
  }
}

