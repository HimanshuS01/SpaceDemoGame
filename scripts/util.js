// /**
//  * Returns a number whose value is limited to the given range.
//  *
//  * Example: limit the output of this computation to between 0 and 255
//  * <pre>
//  * (x * 255).clamp(0, 255)
//  * </pre>
//  *
//  * @param {Number} min The lower boundary of the output range
//  * @param {Number} max The upper boundary of the output range
//  * @returns A number in the range [min, max]
//  * @type Number
//  */


var SpaceShooter = {};



SpaceShooter.init = function(){
    this.canvas = document.getElementById('mycanvas');
    this.pen = this.canvas.getContext('2d');
    this.W = this.canvas.width;
    this.H = this.canvas.height;
    
    this.game_over = false;
    
    this.enemyImg = new Image();
    this.enemyImg.src = "images/enemy.png";
    
    
    this.playerImg = new Image();
    this.playerImg.src = "images/player.png";
    
       //Create the Player Object
    this.player = {
      x: this.W/2,
      y: this.H - 100,
      w: 50,
      h:50,
      speedX  :0,
      playerBullets:[],
        
      getBullet:function(){
        //Same as filtering
          
          this.playerBullets.forEach(function(bullet){
                if(bullet.active==false){
                    bullet.active = true;
                    //bullet.y = this.y; 
                    return bullet;
                } 
          },this);
          return null;
      },  
      
      draw:function(x,y){
            this.pen.drawImage(SpaceShooter.playerImg,this.x,this.y,this.w,this.h);        
      },
      shoot:function(){
            console.log("Shooting a bullet");  
            var bullet = this.getBullet();
            
            if(!bullet){
             bullet =    new SpaceShooter.bullet(this.x,this.y,10);
            this.playerBullets.push(bullet);
            }
           
          console.log("Player Bullets "+this.playerBullets.length);
      },
    };
    var self = this;
    
    function keyPressed(e){
        
        if(e.key==" "){
            console.log("Shoot");
            self.player.shoot();
        }
        else if(e.key=="ArrowLeft"){
            console.log("Moving left");
           self.player.speedX =-10;
            
        }
        else if(e.key=="ArrowRight"){
            console.log("Moving Right");
            self.player.speedX =+10;
            
        }
        
        
    }
    
    function keyReleased(e){
        
        if(e.key=="ArrowLeft"||e.key=="ArrowRight"){
           self.player.speedX = 0;
        }    
    }
    
    //Event Listeners
    document.addEventListener('keydown',keyPressed);
    document.addEventListener('keyup',keyReleased);
    
    this.enemies = [];
    var s  = new SpaceShooter.enemy(100,100,3,4);
    this.enemies.push(s);
 
   
},
    
SpaceShooter.draw = function(){
    
   this.pen.clearRect(0,0,this.W,this.H);
   
    this.pen.drawImage(this.playerImg,this.player.x,this.player.y,this.player.w,this.player.h);
    
    ///Draw the bullets
     this.player.playerBullets.forEach(function(bullet){
            bullet.draw();
    },this);
    
    //Draw the enemies
    this.enemies.forEach(function(enemy){
            enemy.draw();
    },this);
    
    
    
    
}

SpaceShooter.update = function(){
    //Update Player
    if(this.player.speedX!=0){
        this.player.x += this.player.speedX;
    }
    if(this.player.x >= this.W-50){
        this.player.x = this.W - 50;
    }
    else if(this.player.x<=0){
        this.player.x = 0;
    }
    //Update Player Bullets
    this.player.playerBullets.forEach(function(bullet){
            bullet.update();
    },this);
    
    //Update Enemies
    this.enemies.forEach(function(enemy){
            enemy.update();
    },this);
    
    //Check for  Enemies and player collision
    this.enemies.forEach(function(enemy){
            if(this.isColliding(this.player,enemy)){
            
                alert("Game Over");
                this.game_over = true;
            }
    },this);
    
    
    // this.player.playerBullets.forEach(function(bullet){
    //  this.enemies.forEach(function(enemy){
    //    if(this.collides(bullet, enemy)){
    //      alert("game_over");
    //      this.game_over = true;
    //    }
    //  },this);
    // },this);

    var r = Math.random();
    if(r<0.03){
        var e = this.enemyCreator();
        this.enemies.push(e);
    }    
}

SpaceShooter.enemyCreator = function(){
    var x = Math.random()*SpaceShooter.W;
    var y = Math.random()*50;
    var speedX = -5 + 10*Math.random();
    var speedY = Math.ceil(5*Math.random());
    
    var enemy = new SpaceShooter.enemy(x,y,speedX,speedY);
    return enemy;
    
}

SpaceShooter.render = function(){
    SpaceShooter.draw();
    SpaceShooter.update();
    if(SpaceShooter.game_over==false){
        window.requestAnimationFrame(SpaceShooter.render);
    }
    else{
        SpaceShooter.start();
    }
}

////Implement the bullet class
SpaceShooter.bullet = function(x,y,speed){
      this.active = true;
      this.x = x;
      this.y = y;
      this.speed = speed;
    
      this.draw = function(){
            SpaceShooter.pen.fillStyle = "red";
            SpaceShooter.pen.fillRect(this.x,this.y,4,10);
      },
      
      this.update = function(){
            this.y -= this.speed;
            if(this.y <=0){
                this.active = false;
            }
      }
    
};

SpaceShooter.enemy = function(x,y,speedX,speedY){
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 32;
        this.speedX = 1;
        this.speedY = speedY;
    
        this.draw = function(){
            SpaceShooter.pen.drawImage(SpaceShooter.enemyImg,this.x,this.y);   
        },
            
        this.update = function(){
            this.y += this.speedY;
            this.x += this.speedX;
            if(this.x>=SpaceShooter.W - 50|| this.x<=0){
                this.speedX *= -1;
            }   
        }
};

SpaceShooter.isColliding = function(s1,s2){
    var firstCond = (Math.abs(s1.x-s2.x)<=Math.max(s1.w,s1.w));
    
    var secondCond = Math.abs(s1.y - s2.y)<=Math.max(s2.h,s1.h);
                      
    return firstCond && secondCond;
};
// SpaceShooter.collides = function(a,b){
//  return a.x < b.x + b.width &&
//  a.x + a.width > b.x &&
//  a.y < b.y + b.height &&
//  a.y + a.height > b.y;
// }
    

SpaceShooter.start = function(){
    SpaceShooter.init();
    SpaceShooter.render();    
}

SpaceShooter.start();



        
        
   
























//  FPS = 30;
//  playerBullets = [];
//  enemies = [];

//  function loadImages(){
//  	playerImage = new Image();
//  	enemyImage = new Image();
//   bulletImage = new Image();

//   playerImage.src = 'images/player.png';

//   enemyImage.src = 'images/enemy.png';

//   bulletImage.src='images/bullet.png';

// }

// function init(){

//   canvas = document.getElementById('mycanvas');
//   pen = canvas.getContext('2d');

//   WIDTH = canvas.width;
//   HEIGHT = canvas.height;
//   GAME_OVER = false;
//   console.log("Inside init()");

//   textX = 50;
//   textY = 50;
//   pen.fillStyle = "#fcf";  
//   pen.font = "30px Arial" ; 
//   pen.fillText ("Space Demo", textX, textY);  

//   player = {
//    color: "#00A",
//    x:220,
//    y:465,
//    w:32,
//    h:32,
//    speed:5,
//    moving:false,
//    bulletsArray:[],

//    draw: function(){
//     pen.fillStyle = this.color;
//         // pen.fillRect(0,0,100,100);
//         pen.drawImage(playerImage,player.x,player.y,player.w,player.h);
//         pen.drawImage(bulletImage,150,50);

//       },

//       shoot:function(){
//         console.log("shooting");
//         Sound.play("shoot");
//         bulletposition=this.midpoint();
//         console.log(" Manisha " + bulletposition.x + " " + bulletposition.y);
//         pen.drawImage(bulletImage,160,50);
//         playerBullets.push(Bullet({
//           speed:2,
//           x: bulletposition.x,
//           y: bulletposition.y,
//         // console.log(x + " " + y);
//       }));
//         console.log("here"+playerBullets);
        
//       },	

//       midpoint:function(){
//         return{
//           x: this.x + this.w/2,
//           y: this.y + this.h/2,
//         };
//         // return{
//         //   x: this.x + WIDTH/2,
//         //   y: this.y + HEIGHT/2,
//         // };
//       },

//       explode: function(){
//         this.active = false;
//       },
// 
//     };

//  document.addEventListener('keydown',function(e){

//    if(e.key==" "){
//     console.log("space pressed");
//     player.shoot();
//     }
//      if(e.key=="ArrowRight"){
//      player.x += 2;

//    }
//    if(e.key=="ArrowLeft"){
//      player.x -= 2;
//    }

//    player.x = player.x.clamp(0, WIDTH - player.w);
//   });

//   };

//   function draw(){
//     //Erase the old screen
//     pen.clearRect(0,0,WIDTH,HEIGHT);
//     pen.fillStyle = "#E5B7E5";
//     player.draw();
//     // pen.drawImage(playerImage,player.x,player.y,player.w,player.h);
//     // pen.fillText = ("sup bro", textX, textY);
//     playerBullets.forEach(function(bullet){
//     	bullet.draw();
//     });

//     enemies.forEach(function(enemy){
//     	enemy.draw();
//     });
//   }

//   function update(){
//    textX += 1;
//    textY += 1;

//     playerBullets.forEach(function(bullet){
//       bullet.update();
//     });

//     playerBullets = playerBullets.filter(function(bullet){
//       return bullet.active;
//     });

//     enemies.forEach(function(enemy){
//       enemy.update();
//     });

//     enemies = enemies.filter(function(enemy){
//       return enemy.active;
//     });
//     if(Math.random() <1.2){
//       enemies.push(Enemy());
//     }
//   }

//   function Enemy(I){

// 	//console.log("Inside Enemy");
// 	I = I || {};

// 	I.active = true;
// 	I.age = Math.floor(Math.random()*128);
// 	I.color = "#A2B";
// 	I.x = WIDTH/4 + Math.random() * WIDTH/2;
// 	I.y = 0;
// 	I.xVelocity = 0;
// 	I.yVelocity = 2;
// 	I.width = 32;
// 	I.height = 32;
// 	I.inBounds = function(){
// 		return I.x >=0 && I.x <= WIDTH && I.y >=0 && I.y <= HEIGHT;
// 	};
// 	I.draw = function(){
// 		pen.fillStyle = "#A2F";
// 		pen.drawImage(enemyImage,20,40, I.width, I.height);
// 	};
// 	I.update = function(){
// 		I.x += I.xVelocity;
// 		I.y += I.yVelocity;
// 		I.xVelocity = 3*Math.sin(I.age ^ Math.PI/64);
// 		I.age++;
// 		I.active = I.active && I.inBounds();
// 	};
// 	I.explode = function(){
//     Sound.play("explode");
//     this.active = false;
//   };
//   return I;
// }


// function Bullet(I){
// 	I.active = true;
// 	I.xVelocity = 0;
// 	I.yVelocity = -I.speed;
// 	I.width = 3;
// 	I.height = 3; 
// 	I.color = "#ff0";

// 	I.inBounds = function(){
// 		return I.x >=0 && I.x <= WIDTH && I.y >=0 && I.y <= HEIGHT;
// 	};

//  I.draw = function(){
// 		// pen.fillStyle = this.color;
//     pen.fillStyle = "#0cf";
//     // pen.drawImage(bulletImage,220, 400, 32, 32 );
//     pen.fillRect(220,465,I.width, I.height);
//   };

//   I.update = function(){
//     I.x += I.xVelocity;
//     I.y += I.yVelocity;
//     console.log(I.x +" "+I.y);
//     I.active = I.active && I.inBounds();
//   };
//   return I;
// }



// // myVar = setInterval(function(){
// // 	console.log("jhfdshd");
// // 	update();
// // 	draw();

// // }, 1000/FPS);



// function render(){
//   draw();
//   update();

//   //console.log("In Render");
//   if(GAME_OVER==false){
//     window.requestAnimationFrame(render);
//   }
//   else{
//     startGame();
//   }
// }

// function collides (a,b){
//  return a.x < b.x + b.width &&
//  a.x + a.width > b.x &&
//  a.y < b.y + b.height &&
//  a.y + a.height > b.y;
// }

// function handleCollisions(){
//  playerBullets.forEach(function(bullet){
//   enemies.forEach(function(enemy){
//    if (collides(bullet, enemy)){
//     enemy.explode();
//     bullet.active = false;
//   }
// });
// });
//  enemies.forEach(function(enemy){
//   if(collides(enemy,player)){
//    enemy.explode();
//    player.explode();
//  }
// });

// }

// loadImages();
// function startGame(){
//   console.log("In the startGame function");
//   init();
//   render();
// }
// startGame();


// Number.prototype.clamp = function(min, max) {
// 	return Math.min(Math.max(this, min), max);
// };