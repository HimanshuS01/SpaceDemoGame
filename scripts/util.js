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
 function init(){
     canvas = document.getElementById('mycanvas');


     pen = canvas.getContext('2d');

     WIDTH = canvas.width;
     HEIGHT = canvas.height;
     GAME_OVER = false;

    pen.fillStyle = "#fcf";
}

function draw(){
    //Erase the old screen
    pen.clearRect(0,0,WIDTH,HEIGHT);
    pen.fillStyle = "#000";
    pen.fillText = ("set up");
    }

function update(){
}

function render(){
    draw();
    update();
   
   console.log("In Render");
    if(GAME_OVER==false){
        window.requestAnimationFrame(render);
    }
    else{
        startGame();
    }
}

function startGame(){
    init();
    render();
}
startGame();

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
