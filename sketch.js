var dog,dogImg, happyDog, database, foodS, foodA, foodStock,foodAdd,bottleMilk;
var start, startImg;
var milk,milkImg;
var bg,bg2;
var bark;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var feedThePet,addFood;
var fedTime,lastFed;
var foodObj;
var dogAreaImg;
var click;

function preload()
{
  //load images here
  bg = loadImage("images/dog_house.jpg");
  bg2 = loadImage("images/bg2.jpg");
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  startImg = loadImage("images/start_icon.png");
  milkImg = loadImage("images/milk_bowl.png");
  bark = loadSound("bark.mp3");
  dogAreaImg = loadImage("images/Dog_Area.jpg");
  bottleMilk = loadImage("images/Milk.png");
  click = loadSound("click.wav");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);

  foodObj = new Food();

  start = createSprite(250,250,50,50);
  start.addImage(startImg);
  start.scale = 0.3;

  milk = createSprite(650,650,20,20);
  milk.addImage(bottleMilk);
  milk.scale = 0.04;

  dog = createSprite(400,400,20,30);
  dog.addImage(dogImg);
  dog.scale=0.2;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed To Ramesh");
  feed.position(370,80);
  feed.mousePressed(feedDog);

  foodAdd = createButton("Add Milk");
  foodAdd.position(500,80);
  foodAdd.mousePressed(addFood);
}

function draw() {
  background("orange");

  if (gameState === PLAY){
    background(bg2);
    start.visible = true;
    dog.visible = false;
    milk.visible = false;
    bottleMilk.visible = false;
    feed.hide();
    foodAdd.hide();

    textSize(19);
    fill("black");
    strokeWeight("2");
    stroke("grey");
    text("HELLO! This is Ramesh Shuturmurgh",90,40);
    text("I am hungry and I need some milk",90,70);
    // text("You can use the Up Arrow key to feed me",90,100);
    text("Ramesh is waiting for you to get some milk",80,160);
  
    if (mousePressedOver(start)){
      gameState=END;
    }
  }

  if (gameState === END){
    background(dogAreaImg);
    start.visible = false;
    dog.visible = true;
    milk.visible = true;
    bottleMilk.visible = true;
    foodAdd.show();
    feed.show();

    textSize(20);
    fill("black");
    strokeWeight("2");
    stroke("grey");
    text("Milk Left: "+foodS + "/20",320,70);

    fedTime = database.ref('FedTime');
    fedTime.on("value",function(data){
      lastFed = data.val();
      console.log(lastFed);
    });
      // console.log("4M");

      console.log(lastFed);

    fill(255,255,254);
    textSize(15);
    if (lastFed>=12){
      text("LastFed: "+lastFed%12 +" PM",300,30);
      // console.log("1M");
    }else if(lastFed==0){
      text("Last Feed: 12 AM",300,30);
      // console.log("2M");
    }else{
      text("Last Feed: "+lastFed +" AM",300,30);
      // console.log("3M");
    }
    

    // if (keyWentDown(UP_ARROW)) {
    //   writeStock(foodS);
    //   dog.addImage(happyDog);
    //   bark.play();
    //   milk.visible = true;
    //   dog.addImage(dogImg);

    // }
    // else if (keyWentUp(UP_ARROW)){
    //   dog.addImage(dogImg);
    //   milk.visible = false;
    // }
    drawSprites();
  }

  if (foodS<=0 && gameState === END){
    dog.visible = false;
    feed.hide();
    // bottleMil.visible = false;

    bark.pause();

    textSize(25);
    fill("black");
    strokeWeight("2");
    stroke("grey");
    text("Ops!! There is no more milk left",70,490);
    drawSprites();
  }

  if (foodS >= 21){
    writeStock(foodS);
  }

  foodObj.display();
  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {
  if (x<=0) {
    x=0
  } else {
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })

}

function addFood(){
  click.play();
  foodS = foodS + 1;
  database.ref('/').update({
    Food:foodS
  })
}

async function feedDog(){ 
  // dog.addImage(happyDog);
  dog.visible = true; 
  writeStock(foodS);
  await dog.addImage(happyDog);

  bark.play();
  milk.visible = true;

  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({
    Food:foodObj.getFooodStock(),
    FeedTime:hour()
  })

}