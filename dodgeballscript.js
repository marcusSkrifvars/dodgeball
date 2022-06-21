const levelWidth = 800;
const levelHeight = 920; //900

const borderAreaWidth = 700;
const borderAreaHeight = levelHeight - 100;
const borderXPos = levelWidth/2 - borderAreaWidth/2;
const borderYPos = levelHeight/2 - borderAreaHeight/2;

const playAreaWidth = borderAreaWidth - 10;
const playAreaHeight = borderAreaHeight - 10;
const playAreaXPos = levelWidth/2.0 - playAreaWidth/2.0;
const playAreaYPos = levelHeight/2.0 - playAreaHeight/2.0;

const walls = ["top", "right", "bottom", "left"];

var boy; //the one visible to player

var boyLeft;
var boyRight;
var boyUp;
var boyDown;
var boyNorthEast;
var boyNorthWest;
var boySouthEast;
var boySouthWest;
var boyDead;


var dead = false;
var gameStarted = false;

var balls = [];
var dodgeball;

var keys = []; //keys pressed

var counter = 0 //new ball every 15
var score = 0;
var highScore = 0;

if (sessionStorage.getItem("dodgeBallHighScore") != null) {
    highScore = sessionStorage.getItem("dodgeBallHighScore");
//sessionStorage.setItem("dodgeBallHighScore", value)
}

var slowMoDivider = 1.0;
var slowMoValue = 1000;
var overHeat = false;
var framesSincePlayerMoved = 0;

var glitched = false; //easter egg kinda

//audio
var muted = false;
var mutedPath = "controls/audio_on.png";
var deathSound = new Audio('sounds/deathsound.wav');
var ballHitSound = new Audio('sounds/ballhitsound.wav');
var whistleSound = new Audio('sounds/whistle.wav');
var enterSlowMo = new Audio('sounds/enterSlowMo.wav');
//var soundtrack1 = new Audio('sounds/progressive.wav');
//var soundtrack2 = new Audio('sounds/gametune2.wav');
var tunes = ['sounds/progressive.wav', 'sounds/gametune2.wav', 'sounds/gametune1.wav'];
var soundtrack = new Audio(tunes[(Math.floor(Math.random() * 3))]);
var playedSlowMoAudio = false;
var zoomedIn = false;
var exitSlowMo = new Audio('sounds/exitSlowMo.wav');
var switchedStates = false;

var decreaseX = 0; //used to slow down dead boy
var decreaseY = 0;

var framesPerBall = 30; //decreases as points increase
var firstGame = true;

/*
Kids work as borders for the game screen
 */

var kids = new Image();
kids.src = 'sprites/kids.png';
kids.style.height = "100 px";
kids.style.width = '1171px';
kids.defaultX = 5;
kids.defaultY = levelHeight - 40;
kids.x= 5;
kids.y = kids.defaultY;
kids.id = 'lol';

var kidsTop = new Image();
kidsTop.src = 'sprites/kids_top.png';
kidsTop.style.height = "100 px";
kidsTop.style.width = '1171px';
kidsTop.defaultX = 5;
kidsTop.defaultY = -65;
kidsTop.x = 5;
kidsTop.y = -65;

var kidsLeft = new Image();
kidsLeft.src = 'sprites/kids_left.png';
kidsLeft.style.height = "1171 px";
kidsLeft.style.width = '100 px';
kidsLeft.defaultX = -65;
kidsLeft.defaultY = 5;
kidsLeft.x = -65;
kidsLeft.y = 5;

var kidsRight = new Image();
kidsRight.src = 'sprites/kids_right.png';
kidsRight.style.height = "1171 px";
kidsRight.style.width = '100 px';
kidsRight.defaultX = levelWidth - 40;
kidsRight.defaultY = 5;
kidsRight.x = levelWidth - 40;
kidsRight.y = 5;

var teacher = new Image();
teacher.src = 'sprites/teacher_silent.png';
teacher.style.height = "300 px";
teacher.style.width = '300px';

var teacherSound = new Image();
teacherSound.src = 'sprites/teacher.png';
teacherSound.style.height = "300 px";
teacherSound.style.width = '300px';

var teacherX = -50;

var buttonVisible = false;
var buttonRect = {
    x: 0.42 * levelWidth,
    y:550,
    width:120,
    height:50
};

function updateMuted(){
    if(muted){
        document.getElementById("muteIcon").src = "controls/audio_on.png"
        if (!dead)
            soundtrack.volume = 1;
//mutedPath = "controls/audio_on.png";
    }
    else{
//mutedPath = "controls/audio_off.png";
        document.getElementById("muteIcon").src = "controls/audio_off.png"
        soundtrack.volume = 0;
    }
    muted = !muted;

}

function checkPoints() {

//doubt you can even get this far hehe
    if (score > 300) {
        framesPerBall = 1;
    }
    if (score > 200) {
        framesPerBall = 2;
    }
    else if (score > 150) {
        framesPerBall = 4;
    }
    else if (score > 125) {
        framesPerBall = 6;
    }
    else if (score > 100) {
        framesPerBall = 8;
    }
    else if (score > 75) {
        framesPerBall = 10;
    }
    else if (score > 50) {
        framesPerBall = 12;
    }
    else if (score > 30) {
        framesPerBall = 15;
    }
    else if (score > 20) {
        framesPerBall = 20;
    }
    else if (score > 10) {
        framesPerBall = 25;
    }

}

function playStart(){

    document.getElementById('controlsDiv').style.display = "none";
}

function moveToBox2(){
    document.getElementById('startBox1').style.display = "none";
    document.getElementById('startBox2').style.display = "inherit";
}

function playAnimation(ready){
    document.getElementById('hand').className = "movingHand";

    document.getElementById('readyQuestion').style.display = "none";
    document.getElementById('readyButtons').style.display = "none";

    document.getElementById('finalText').style.display = "inherit";
    if (ready == true){
        document.getElementById('positiveResponse').style.display = "inherit";
    }
    else{
        document.getElementById('negativeResponse').style.display = "inherit";
    }

    whistleSound.play();

    setTimeout(function(){
        document.getElementById('startBox2').style.display = "none";
        document.getElementById('startScreen').style.display = "none";
        document.getElementById('controlsDiv').style.display = "inherit";

        startGame();
    }, 1200);
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
//this.caller.setAttribute("id", "test");
    }
    this.width = width;
    this.height = height;
    this.speedX = 0.0;
    this.speedY = 0.0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.invisiblePlayerCanvas.getContext("2d");//GetElementInsideContainer("wrapperDiv", "playerLayer").getContext("2d");//myGameArea.context20;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX / slowMoDivider;
        this.y += this.speedY / slowMoDivider;
    }
}

function startGame() {
//boy is the visible component, copies the value from one of the other versions when input(s) is detected
//simply changing image source causes flicker

    boy = new component(50, 50, "sprites/boy_down.png", 340, 445, "image");
    boyLeft = new component(50, 50, "sprites/boy_left.png", 340, 445, "image");
    boyRight = new component(50, 50, "sprites/boy_right.png", 340, 445, "image");
    boyUp = new component(50, 50, "sprites/boy_up.png", 340, 445, "image");
    boyDown = new component(50, 50, "sprites/boy_down.png", 340, 445, "image");
    boySouthEast = new component(50, 50, "sprites/boy_southeast.png", 340, 445, "image");
    boySouthWest = new component(50, 50, "sprites/boy_southwest.png", 340, 445, "image");
    boyNorthEast = new component(50, 50, "sprites/boy_northeast.png", 340, 445, "image");
    boyNorthWest = new component(50, 50, "sprites/boy_northwest.png", 340, 445, "image");
    boyDead = new component(70, 70, "sprites/boy_dead.png", 340, 445, "image");
    boy.onload = function() {
// add it to the canvas
        const ctx = myGameArea.playerCanvas.getContext("2d");//GetElementInsideContainer("wrapperDiv", "playerLayer").getContext("2d");//myGameArea.context20;
        ctx.drawImage(boy.image,
            boy.x,
            boy.y,
            boy.width, boy.height);
    };
    myGameArea.start();
}

function resetGame(){
    myGameArea.clear();
    clearInterval(myGameArea.interval);
    framesPerBall = 25
    framesSincePlayerMoved = 0;
    dead = false;
    score = 0;
    counter = 0
    balls = [];
    glitched = false;
    teacherX = -50;

//reset image
    boy = boyDown;

//reset size
    boy.height = 50;
    boy.width = 50;

//reset position
    boy.x = 340;
    boy.y = 445;

//reset speed;
    boy.speedX = 0;
    boy.speedY = 0

//reset key presses
    keys = [];

//change song (or restart current song)
    soundtrack = new Audio(tunes[(Math.floor(Math.random() * 3))]);

//reset slowmo meter
    slowMoValue = 1000;
    firstGame = false;

    document.getElementById('playAgain').style.display = "none";

    myGameArea.start();
}


var myGameArea = {
    canvas: document.createElement("canvas"), //temp?
    invisiblePlayerCanvas: document.createElement("canvas"),
    div: document.getElementById('wrapperDiv'),
    playerCanvas: GetElementInsideContainer("wrapperDiv", "playerLayer"),

    start: function () {
        this.canvas.width = levelWidth;
        this.canvas.height = levelHeight;

        //invisible canvas where everything is updated first, later copied over to visible canvas
        this.invisiblePlayerCanvas.width = GetElementInsideContainer("wrapperDiv", "playerLayer").width;
        this.invisiblePlayerCanvas.height = GetElementInsideContainer("wrapperDiv", "playerLayer").height;

        let wrapperCanvas = GetElementInsideContainer("wrapperDiv", "playerLayer");
        this.wrapperContext = wrapperCanvas.getContext("2d");
        this.context = this.canvas.getContext("2d");
        this.context.canvas.style.zIndex = "2";

//drawing stuff
        let grd = this.context.createRadialGradient(425, 500, 5, 600, 200, 1000);
        grd.addColorStop(0, "#f29038"); //f19b4f f29038
        grd.addColorStop(1, "#edb17b"); //edb17b

        this.context.fillStyle = playedSlowMoAudio ? "#b4ae92" : grd;
        this.context.fillRect(5, 5, levelWidth, levelHeight);
        this.context.canvas.style.backgroundColor = playedSlowMoAudio ? "#b4ae92" : "#f19b4f";
        this.context.fillStyle = "#ffffff";
        this.context.fillRect(borderXPos, borderYPos, borderAreaWidth, borderAreaHeight);
        this.context.fillStyle = playedSlowMoAudio ? "#b4ae92" : "#f19b4f";
        this.context.fillRect(playAreaXPos, playAreaYPos, playAreaWidth, playAreaHeight);

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 18);//20

        this.context.save();
        this.wrapperContext.save();

        this.div.appendChild(this.canvas)

//kids
        let canvas3 = GetElementInsideContainer("wrapperDiv", "kidsLayer");
        this.context3 = canvas3.getContext("2d");
        let canvas4 = GetElementInsideContainer("wrapperDiv", "kidsLayer2");
        this.context4 = canvas4.getContext("2d");
        let canvas5 = GetElementInsideContainer("wrapperDiv", "kidsLayer3");
        this.context5 = canvas5.getContext("2d");
        let canvas6 = GetElementInsideContainer("wrapperDiv", "kidsLayer4");
        this.context6 = canvas6.getContext("2d");

        let topCanvas = GetElementInsideContainer("wrapperDiv", "topLayer");
        this.topContext = topCanvas.getContext("2d");

        this.context3.drawImage(kidsTop, -5, -38);
        this.context4.drawImage(kids, -5, 880);
        this.context5.drawImage(kidsLeft, -45, 5);
        this.context6.drawImage(kidsRight, levelWidth - 45, 5);
    },

    clear: function () {

        let wrapperCanvas = GetElementInsideContainer("wrapperDiv", "playerLayer");

        this.invisibleContext =  myGameArea.invisiblePlayerCanvas.getContext("2d")
        this.wrapperContext = wrapperCanvas.getContext("2d");

        requestAnimationFrame(() => this.wrapperContext.clearRect(0, 0, this.canvas.width, this.canvas.height));

        this.invisibleContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.topContext.clearRect(0, 0, this.canvas.width, this.canvas.height)

//drawing stuff
        if (switchedStates) {
            let grd = this.context.createRadialGradient(425, 500, 5, 600, 200, 1000);
            grd.addColorStop(0, "#f29038"); //f19b4f f29038
            grd.addColorStop(1, "#edb17b"); //edb17b

            this.context.fillStyle = playedSlowMoAudio ? "#b4ae92" : grd;
            this.context.fillRect(5, 5, levelWidth, levelHeight);

            this.context.canvas.style.backgroundColor = playedSlowMoAudio ? "#b4ae92" : "#f19b4f";

            this.context.fillStyle = "#ffffff";
            this.context.fillRect(borderXPos, borderYPos, borderAreaWidth, borderAreaHeight);

            this.context.fillStyle = playedSlowMoAudio ? "#b4ae92" : "#f19b4f";
            this.context.fillRect(playAreaXPos, playAreaYPos, playAreaWidth, playAreaHeight);
        }

        if (playedSlowMoAudio) {
            this.id = "slowMo"
        }

        this.topContext.fillStyle = "#000000";
        this.topContext.font = "32px Impact";
        this.topContext.fillText("Score: " + score, 0.1 * levelWidth, 50);

        requestAnimationFrame(() => copyInvCanvasToVisible());
    },
    stop: function () {
        let wrapperCanvas = GetElementInsideContainer("wrapperDiv", "playerLayer");

        this.invisibleContext =  myGameArea.invisiblePlayerCanvas.getContext("2d")
        this.wrapperContext = wrapperCanvas.getContext("2d");

        requestAnimationFrame(() => this.wrapperContext.clearRect(0, 0, this.canvas.width, this.canvas.height));
        requestAnimationFrame(() => copyInvCanvasToVisible());

        let topCanvas = GetElementInsideContainer("wrapperDiv", "topLayer");
        this.topContext = topCanvas.getContext("2d");
        this.topContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (teacherX >= 300) {
            var newRecord = false;

            if (score > highScore) {
                highScore = score;
                sessionStorage.setItem("dodgeBallHighScore", highScore)
                newRecord = true
            }
            this.topContext.drawImage(teacherSound, teacherX, 250, 200, 200)

            this.topContext.fillStyle = "#ff190c";
            this.topContext.font = "40px Impact";
            this.topContext.fillText("Final Score: " + score + (newRecord ? " (NEW RECORD)" : ""), 0.25 * levelWidth, 500);

            this.topContext.font = "20px Impact";
            if (glitched == false) {
                this.topContext.fillText("Try harder son", 0.42 * levelWidth, 525);
            } else {
                this.topContext.fillText("No glitching allowed in school! Principal's office. Now.", 0.24 * levelWidth, 525);
            }

            this.topContext.fillStyle = "#ff190c";
            this.topContext.font = "40px Impact";
            this.topContext.fillText("High score: " + highScore, 0.4 * levelWidth, 650);

            document.getElementById('playAgain').style.display = "initial";
            clearInterval(this.interval);
        }
        else {
            teacherX = teacherX + 25;
            this.topContext.drawImage(teacher, teacherX, 250, 200, 200)
        }
    }
}

//separate function for testing, leaving here for now
function copyInvCanvasToVisible(){
    const playercontext = GetElementInsideContainer("wrapperDiv", "playerLayer").getContext("2d");
    playercontext.drawImage(myGameArea.invisiblePlayerCanvas,0,0)
}

//check if any dodgeball hit the player the current frame
function checkCollision(rect1, rect2, speedX, speedY, index) {
//models are round, so use circles
    if (!muted) {
        soundtrack.play();
    }
//hitboxes
    var circle1 = {radius: 22, x: rect1.x + 25, y: rect1.y + 25};
    var circle2 = {radius: rect2.width / 2 - 2, x: rect2.x + 15, y: rect2.y + 15};

    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    //if dodgeball is within hitbox radius
    if (distance < circle1.radius + circle2.radius) {
        if (!muted) {
            ballHitSound.play();
            deathSound.play();
            soundtrack.pause();
        }

//set boy speed to same as ball
        boy.speedX = speedX;
        boy.speedY = speedY;
        decreaseX = Math.abs(boy.speedX / 40.0);
        decreaseY = Math.abs(boy.speedY / 40.0);

        //switch to boyDead component
        boyDead.x = boy.x;
        boyDead.y = boy.y;
        boyDead.speedX = boy.speedX;
        boyDead.speedY = boy.speedY;
        boy = boyDead;

        dead = true;
        enterSlowMo.pause();

//change ball direction
        balls[index].speedX = -speedX / 5;
        balls[index].speedY = -speedY / 5;

    }
}

function updateGameArea() {
    myGameArea.clear();
    checkPoints();

    if (dead == false) {
        executeMoves();
        framesSincePlayerMoved++;
    }

//if dead, decrease speed each frame
    if (dead == true) {

        if (Math.abs(boy.speedX) <= 0.2 && Math.abs(boy.speedY) <= 0.2) {
            myGameArea.stop();
            if (!muted)
                whistleSound.play();
        }

        if (Math.abs(boy.speedX) > 0.2) {
            if (boy.speedX > 0) {
                boy.speedX = boy.speedX - decreaseX;
            } else {
                boy.speedX = boy.speedX + decreaseX;
            }
        }

        if (Math.abs(boy.speedY) > 0.2)
            if (boy.speedY > 0) {
                boy.speedY = boy.speedY - decreaseY;
            } else {
                boy.speedY = boy.speedY + decreaseY;
            }
    }
    boy.x += boy.speedX;
    boy.y += boy.speedY;

// prevent boy from going through walls
    if (boy.x < borderXPos && dead == false) {
        boy.x = borderXPos
    } else if (boy.x + boy.width > levelWidth - borderXPos && dead == false) {
        boy.x = levelWidth - borderXPos * 2;
    } else if (boy.y < borderYPos && dead == false) {
        boy.y = borderYPos;
    } else if (boy.y + boy.height > levelHeight - borderYPos && dead == false) {
        boy.y = levelHeight - borderYPos * 2;
    }

//end game if boy glitches out (dirty fix)
    if ((boy.y < 2 || boy.y > levelHeight) && dead == false) {
        glitched = true;
        if (!muted)
            whistleSound.play();
        score = 0;
        myGameArea.stop();
    }
    boy.update();

    counter++;

    if (counter >= framesPerBall * slowMoDivider && dead == false) {
        counter = 0;

        addDodgeBall();
    }
    //penalize player if he does not move with a ball aimed directly at boy
    if (framesSincePlayerMoved >= 100) {
        framesSincePlayerMoved = 0;

        addSpecialBall();
    }

    balls.forEach((ball, index) => {
        if (dead == false) {
            checkCollision(boy, ball, ball.speedX, ball.speedY, index);
        }
        //if ball is outside of screen, remove it
        if (ball.x < 0 || ball.x > 1400 || ball.y < 0 || ball.y > 1500) {
            console.log("outside")
            balls.splice(index, 1);
        }

        ball.newPos();
        ball.update();

    })
}

function addDodgeBall() {

    var wall = walls[Math.floor(Math.random() * 3) + 0];

    if (wall == "top") {
        dodgeball = new component(30, 30, "sprites/ball.png", (Math.random() * levelWidth) + 10, 2, "image");

        dodgeball.speedX = Math.floor(((Math.random() * 6) + 2) * (Math.round(Math.random()) ? 1 : -1));
        dodgeball.speedY = Math.floor((Math.random() * 15) + 8);

        balls.push(dodgeball);
    } else if (wall == "right") {
        dodgeball = new component(30, 30, "sprites/ball.png", levelWidth, (Math.random() * levelHeight) + 10, "image");

        dodgeball.speedX = Math.floor((Math.random() * 15) + 8) * -1;
        dodgeball.speedY = Math.floor(((Math.random() * 6) + 2) * (Math.round(Math.random()) ? 1 : -1));

        balls.push(dodgeball);
    } else if (wall == "bottom") {
        dodgeball = new component(30, 30, "sprites/ball.png", (Math.random() * levelWidth) + 10, levelHeight, "image");

        dodgeball.speedX = Math.floor(((Math.random() * 6) + 2) * (Math.round(Math.random()) ? 1 : -1));
        dodgeball.speedY = Math.floor((Math.random() * 15) + 8) * -1;

        balls.push(dodgeball);
    } else {
        dodgeball = new component(30, 30, "sprites/ball.png", 2, (Math.random() * levelHeight) + 10, "image");

        dodgeball.speedX = Math.floor((Math.random() * 15) + 8);
        dodgeball.speedY = Math.floor(((Math.random() * 6) + 2) * (Math.round(Math.random()) ? 1 : -1));

        balls.push(dodgeball);
    }
    score++;
}

//penalize standing still
function addSpecialBall() {

    var edgeX = levelWidth - 4;
    var edgeY = levelHeight - 2;
    var yDiff = edgeY - boy.y;
    var xDiff = edgeX - boy.x;

    dodgeball = new component(30, 30, "sprites/ballSpecial.png", edgeX, edgeY, "image");

    dodgeball.speedX = -(0.02 * xDiff);
    dodgeball.speedY = -(0.02 * yDiff);

    balls.push(dodgeball);

    score++;
}

function getNumberArray(arr) {
    var newArr = new Array();
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] == "number") {
            newArr[newArr.length] = arr[i];
        }
    }
    return newArr;
}

//thanks stackoverlflow
function GetElementInsideContainer(containerID, childID) {
    var elm = document.getElementById(childID);
    var parent = elm ? elm.parentNode : {};
    return (parent.id && parent.id === containerID) ? elm : {};
}

//can these be removed?

document.addEventListener('keydown', function (e) {
    keys[e.keyCode] = e.keyCode;
});

// listen to keyboard events to stop the boy if key is released
document.addEventListener('keyup', function (e) {

    if (dead == false) {
        keys[e.keyCode] = false;

        if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 68 || e.keyCode === 65) {
            boy.speedX = 0;
        } else if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 87 || e.keyCode === 83) {
            boy.speedY = 0;
        }

        if (e.keyCode === 32) {
            playedSlowMoAudio = false;
            if (!muted)
                exitSlowMo.play();
        }
    }
});

function executeMoves() {

    array = getNumberArray(keys)

    if (dead == false) {
//first multikey combos
// left&up
        if (array.includes(37) && array.includes(38) || (array.includes(65) && array.includes(87))) {
//boy.image.src = "sprites/boy_northwest.png";
            boy.speedX = -3.53;
            boy.speedY = -3.53;
            framesSincePlayerMoved = 0;

            boyNorthWest.x = boy.x;
            boyNorthWest.y = boy.y;
            boyNorthWest.speedX = boy.speedX;
            boyNorthWest.speedY = boy.speedY;
            boy = boyNorthWest;
        }

// left&down
        else if (array.includes(37) && array.includes(40) || (array.includes(65) && array.includes(83))) {
            boy.speedX = -3.53;
            boy.speedY = 3.53;
            framesSincePlayerMoved = 0;

            boySouthWest.x = boy.x;
            boySouthWest.y = boy.y;
            boySouthWest.speedX = boy.speedX;
            boySouthWest.speedY = boy.speedY;
            boy = boySouthWest;
        }

// right&up
        else if (array.includes(39) && array.includes(38) || (array.includes(68) && array.includes(87))) {
            boy.speedX = 3.53;
            boy.speedY = -3.53;
            framesSincePlayerMoved = 0;

            boyNorthEast.x = boy.x;
            boyNorthEast.y = boy.y;
            boyNorthEast.speedX = boy.speedX;
            boyNorthEast.speedY = boy.speedY;
            boy = boyNorthEast;
        }

// right&down
        else if (array.includes(39) && array.includes(40) || (array.includes(68) && array.includes(83))) {
            boy.speedX = 3.53;
            boy.speedY = 3.53;
            framesSincePlayerMoved = 0;

            boySouthEast.x = boy.x;
            boySouthEast.y = boy.y;
            boySouthEast.speedX = boy.speedX;
            boySouthEast.speedY = boy.speedY;
            boy = boySouthEast;
        }

// left arrow key
        else if (array.includes(37) || array.includes(65)) {
            boyLeft.x = boy.x;
            boyLeft.y = boy.y;
            boyLeft.speedX = boy.speedX;
            boyLeft.speedY = boy.speedY;
            boy = boyLeft;

            boy.speedX = -5;
            framesSincePlayerMoved = 0;
        }
// right arrow key
        else if (array.includes(39) || array.includes(68)) {
            boyRight.x = boy.x;
            boyRight.y = boy.y;
            boyRight.speedX = boy.speedX;
            boyRight.speedY = boy.speedY;
            boy = boyRight;

            boy.speedX = 5;
            framesSincePlayerMoved = 0;
        }
//up
        else if (array.includes(38) || array.includes(87)) {
            boyUp.x = boy.x;
            boyUp.y = boy.y;
            boyUp.speedX = boy.speedX;
            boyUp.speedY = boy.speedY;
            boy = boyUp;

            boy.speedY = -5;
            framesSincePlayerMoved = 0;
        }
//down
        else if (array.includes(40) || array.includes(83)) {
            boyDown.x = boy.x;
            boyDown.y = boy.y;
            boyDown.speedX = boy.speedX;
            boyDown.speedY = boy.speedY;
            boy = boyDown;

            boy.speedY = 5;
            framesSincePlayerMoved = 0;
        }

//Check for slowMo
        if (array.includes(32) && overHeat == false) {
            slowMoDivider = 3.0;
            if (playedSlowMoAudio == false) {
                if (!muted)
                    enterSlowMo.play();
                playedSlowMoAudio = true;
                switchedStates = true;
            }
            slowMoValue = slowMoValue - 10;

            let d = GetElementInsideContainer("slowmoDiv", "slowmoMeter");
            d.setAttribute("value", slowMoValue.toString());
            if (slowMoValue <= 0) {
                overHeat = true;
                d.setAttribute("class", "red");
                if (!muted)
                    exitSlowMo.play();
                playedSlowMoAudio = false;
                switchedStates = true;
            }
        } else {
            slowMoDivider = 1.0;
            switchedStates = false;
            if (slowMoValue < 1000) {
                slowMoValue += 2;
            }

            let slowmoDiv = GetElementInsideContainer("slowmoDiv", "slowmoMeter");
            slowmoDiv.setAttribute("value", slowMoValue.toString());

            if (slowMoValue == 1000) {
                overHeat = false;
                slowmoDiv.setAttribute("class", "green");
            }
        }
        executeMoves;
    }
}

