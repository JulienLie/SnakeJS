let snake;
let pomme;
let key;
let dir;
const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function randomPos(){
    let x = Math.round(Math.random()*26);
    let y = Math.round(Math.random()*29);
    return [x, y];
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function contains(list, pos){
    for(let i = 0; i < list.length; i++){
        if(list[i][0] === pos[0] && list[i][1] === pos[1]) return true;
    }
    return false;
}

async function draw(){
    //console.log('draw');
    let canvas = document.getElementById("canvas");
    if(canvas !== null){
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        for(let i = 0; i < 30; i++){
            for(let j = 0; j < 30; j++){
                if(contains(snake, [i, j])){
                    ctx.fillStyle = "#000000";
                }
                else if(pomme[0] === i && pomme[1] === j){
                    ctx.fillStyle = "#FF0000";
                }
                else{
                    ctx.fillStyle = "#FFFFFF"
                }
                ctx.fillRect(i*10, j*10, i*10+10, j*10+10);
            }
        }
    }
}

window.onkeypress = function(e){
    key = e.keyCode ? e.keyCode : e.which;
    //console.log(key);
}

function boucle(){
    if(key === 100){ // d
        dir++;
        if(dir === 4) dir = 0;
    }
    else if(key === 113){ // q
        dir--;
        if(dir === -1) dir = 3;
    }
    key = -1;

    //console.log(snake);
    let newPos = [snake[0][0]+dirs[dir][0], snake[0][1]+dirs[dir][1]];
    //console.log(newPos);
    snake.unshift(newPos);
    //console.log(snake);
    if(contains(snake, pomme)){
        while(contains(snake, pomme)){
            pomme = randomPos();
        }
    }
    else{
        snake.pop();
    }

    if(contains(snake.slice(1, snake.length-2), snake[0]) 
        || snake[0][0] === -1 
        || snake[0][1] === -1 
        || snake[0][0] === 30 
        || snake[0][1] === 30
        ){
        console.log("end");
        return false;
    }

    draw();
    return true;
}

async function run(){
    snake = [];
    snake.push(randomPos());
    snake.push([snake[0][0]+1, snake[0][1]]);
    snake.push([snake[1][0]+1, snake[1][1]]);
    pomme = randomPos();
    while(contains(snake, pomme)){
        pomme = randomPos();
    }
    key = -1;
    dir = 3;
    draw();
    
    let inter = setInterval(function (){
        //console.log('boucle');
        if(!boucle(true)) clearTimeout(inter);
    }, 200);
}