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
        if(this.y + this.dy < this.radius){
            this.dy = -this.dy;
        }else if(this.y + this.dy > canvas.height - this.radius){
            if(this.x > paddle.x && paddle.x + paddle.width){
                this.dy = -this.dy;
            }else{
               // alert('GAME OVER');
                //document.location.reload();
                //clearInterval(setInterval(draw, 10));
            }
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

class Box{
    constructor(setting){
        this.x = setting.x;
        this.y = setting.y;
        this.w = setting.w;
        this.h = setting.h;
        this.dx = setting.dx;
        this.dy = setting.dy;
        this.isColliding = setting.isColliding || false;
    }
    //
    getBounding(){
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    }
    //
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.isColliding? '#ff8080' : '#0099b0';
        ctx.fillRect(this.x, this.y, this.h, this.h);
        ctx.closePath();
    }
    //
    update(dt){
        console.log('delta time: ', dt)
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

}

//*-------------------------------------------------------------------------------------*//
//*----------------------------------OBJECT DEFINITION----------------------------------*//
//*-------------------------------------------------------------------------------------*//

let ball = null;
let paddle = null;

let boxes = new Array();

boxes.push(new Box({x: 5, y: 5, w: 50, h: 50, dx: 50, dy: 60}));
boxes.push(new Box({x: 510, y: 205, w: 50, h: 50, dx: 60, dy: 75}));
boxes.push(new Box({x: 60, y: 500, w: 50, h: 50, dx: 70, dy: 70}));

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
function update(dt){
    ball.update(dt);
    //
    paddle.update(dt);

    //boxes update
    boxes.forEach((box)=>{
        box.update(dt);
    });

}
//draw game object
function draw(dt){
    //clear canva
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw ball
    ball.draw(ctx);

    //draw paddle
    paddle.draw(ctx);

    //boxes
    boxes.forEach((box)=>{
        box.draw(ctx);
    });
}

let now = 0;
let dt = 0; //delta time
let last = window.performance.now();
let step = 1/60;

//Immediately-Invoked Function Expression (IIFE)
;(()=>{
    function main(){
        now = window.performance.now();
        dt = dt + Math.min(1, (now - last ) / 1000);
        while(dt > step){
            dt = dt - step
            //update
            update(dt)
        }
        //draw
        draw(dt);
        last = now;
        window.requestAnimationFrame(main);
    }
   
    //setInitState
    setInitState();

    main(); //Start the cycle
})();