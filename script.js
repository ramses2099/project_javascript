//canvas element
/** @type {HTMLCanvasElement} */
const canvas =  document.getElementById('canvas1');
//canvas api
/** @type {CanvasRenderingContext2D} */ 
const ctx = canvas.getContext('2d');

//width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//add event
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//*-------------------------------------------------------------------------------------*//
//*----------------------------------CLASS AND OBJECT-----------------------------------*//
//*-------------------------------------------------------------------------------------*//

class Ball{
    constructor(setting){
        this.x = setting.x;
        this.y = setting.y;
        this.radius = setting.radius;
        this.startAngle = setting.startAngle;
        this.endAngle = setting.endAngle;
        this.counterclockwise = setting.counterclockwise || undefined;
        this.dx = 2;
        this.dy = -2;
    }
    //draw object
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.startAngle,this.endAngle, this.counterclockwise);
        ctx.fillStyle = "#0099DD";
        ctx.fill();
        ctx.closePath();
    }
    //update object
    update(tFrame){
        //box left
        if(this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius){
            this.dx = -this.dx;
        }
        //box right
        if(this.y + this.dy > canvas.height -this.radius || this.y + this.dy < this.radius){
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        
    }
}

class Paddle{
    constructor(setting ) {
        this.width = setting.width;
        this.height = setting.height;
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height);
        this.speed = 7;
        this.rightPressed = false;
        this.leftPressed = false;
    }
    //
    setRightPressed(b){
        this.rightPressed = b;
    }
    setLeftPressed(b){
        this.leftPressed = b;
    }
    //draw object
    draw(ctx){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#0099DD";
        ctx.fill();
        ctx.closePath();
    }
    //update object
    update(tFrame){
        if(this.rightPressed){
            this.x += this.speed;
            if(this.x + this.width > canvas.width){
                this.x = canvas.width -this.width;
            }
        }else if(this.leftPressed){
            this.x -= this.speed
            if(this.x < 0){
                this.x = 0;
            }
            
        }
       

    }
}


//*-------------------------------------------------------------------------------------*//
//*----------------------------------OBJECT DEFINITION----------------------------------*//
//*-------------------------------------------------------------------------------------*//

let ball = null;
let paddle = null;


//*-------------------------------------------------------------------------------------*//
//*----------------------------------EVENT LISTENER-------------------------------------*//
//*-------------------------------------------------------------------------------------*//
window.addEventListener('keydown',(e)=>{
    if(e.key ==="Right" || e.key === "ArrowRight"){
        paddle.setRightPressed(true);
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        paddle.setLeftPressed(true);
    }

},false);

window.addEventListener('keyup',(e)=>{
    if(e.key ==="Right" || e.key === "ArrowRight"){
        paddle.setRightPressed(false);
    }else if(e.key === "Left" || e.key === "ArrowLeft"){
        paddle.setLeftPressed(false);
    }

},false);



//*-------------------------------------------------------------------------------------*//
//*----------------------------------GAME LOOP------------------------------------------*//
//*-------------------------------------------------------------------------------------*//

//setinitialState
function setInitState(){
    ball = new Ball({x:canvas.width/2,y:canvas.height -30,
                        radius:20,startAngle:0, 
                        endAngle:Math.PI *2,counterclockwise:false});

    paddle = new Paddle({width:75, height:10});
}

//update game logic
function update(tFrame){
    ball.update(tFrame);
    //
    paddle.update(tFrame);
}
//draw game object
function draw(tFrame){
    //clear canva
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw ball
    ball.draw(ctx);

    //draw paddle
    paddle.draw(ctx);
}

let stopMain = null;
let lastTick = 0;
let lastRender = 0;
let tickLength = 0;

//Immediately-Invoked Function Expression (IIFE)
;(()=>{
    function main(tFrame){
        stopMain = window.requestAnimationFrame(main);
        const nextTick = lastTick + tickLength;
        let numTicks = 0; 

        if(tFrame > nextTick){
            const timeSinceTick = tFrame - lastTick;
            numTicks = Math.floor(timeSinceTick / tickLength);
        }
        //update
        queueUpdate(numTicks);
        //draw
        draw(numTicks);

        lastRender = tFrame; 

    }
    // queueUpdate
    function queueUpdate(numTicks){
        for (let i = 0; i < numTicks; i++) {
            lastTick += tickLength;
            update(lastTick);            
        }
    }

    lastTick = window.performance.now();
    lastRender = lastTick;
    tickLength = 60;

    //setInitState
    setInitState();

    main(window.performance.now()); //Start the cycle
})();