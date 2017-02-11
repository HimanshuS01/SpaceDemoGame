/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * <pre>
 * (x * 255).clamp(0, 255)
 * </pre>
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
 FPS = 30;
 playerBullets = [];

 function loadImages(){
 	playerImage = new Image();
 	enemyImage = new Image();
    bullet = new Image();

    playerImage.src = 'images/player.png';

    enemyImage.src = 'images/enemy.png';

    bullet.src='images/bullet.png';

}

function init(){

  canvas = document.getElementById('mycanvas');
  pen = canvas.getContext('2d');

  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  GAME_OVER = false;
  console.log("Inside init()");

  textX = 50;
  textY = 50;
  pen.fillStyle = "#fcf";  
  pen.font = "30px Arial" ; 
  pen.fillText ("Space Demo", textX, textY);  

  player = {
     color: "#00A",
     x:220,
     y:465,
     w:32,
     h:32,
     speed:5,
     moving:false,

     draw: function(){
        pen.fillStyle = this.color;
        // pen.fillRect(0,0,100,100);
        pen.drawImage(playerImage,player.x,player.y,player.w,player.h);
        
    },

    shoot:function(){
        console.log("shooting");
        bulletposition=this.midpoint();
        console.log(bulletposition);
        playerBullets.push(Bullet({
            speed:5,
            x: bulletposition.x,
            y: bulletposition.y,

        }));
        console.log(playerBullets);
    },	

    midpoint:function(){
        return{
            x: this.x + WIDTH/2,
            y: this.y + HEIGHT/2
        };
    }

};



document.addEventListener('keydown',function(e){

    if(e.key==" "){
        console.log("space pressed")
        player.shoot();
    }
    if(e.key=="ArrowRight"){
       player.x += player.speed;

   }
   if(e.key=="ArrowLeft"){
       player.x -= player.speed;
   }

   player.x = player.x.clamp(0, WIDTH - player.w);

});
}

function Bullet(I){
	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3; 
	I.color = "#000";

	I.inBounds = function(){
		return I.x >=0 && I.x <= WIDTH && I.y >=0 && I.y <= HEIGHT;
	};

	I.draw = function(){
		// pen.fillStyle = this.color;
        pen.fillStyle = "#000";
        pen.fillRect = (220,465 , this.width, this.height);
    };

    I.update = function(){
      I.x += I.xVelocity;
      I.y += I.yVelocity;
      I.active = I.active && I.inBounds();
  };

  return I;
}

function update(){
 // textX += 1;
 // textY += 1;
 playerBullets.forEach(function(bullet){
    bullet.update();
});

 playerBullets=playerBullets.filter(function(bullet){
    return bullet.active;
});

}
// myVar = setInterval(function(){
// 	console.log("jhfdshd");
// 	update();
// 	draw();

// }, 1000/FPS);

function draw(){
    //Erase the old screen
    pen.clearRect(0,0,WIDTH,HEIGHT);
    player.draw();
    // pen.fillText = ("set up",50,50);

    playerBullets.forEach(function(bullet){
        bullet.draw();
    });
}

function render(){
    draw();
    update();

    // console.log("In Render");
    if(GAME_OVER==false){
        window.requestAnimationFrame(render);
    }
    else{
        startGame();
    }
}

loadImages();
function startGame(){
    console.log("In the startGame function");
    init();
    render();
}
startGame();

Number.prototype.clamp = function(min, max) {
	return Math.min(Math.max(this, min), max);
};
