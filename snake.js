let snake = null;
let pomme = null;
let key = -1;
let dir = 3;
let end = false;
let inter = null;
let score = 0;
let isPommeSpeciale = false;
let countPomme = 0;
let pommeSpecialeUnable = false;
const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const fontColor = ["#FFFFFF", "#000000"];
const snakeColor = ["#000000", "#FFFFFF"];
const pommeColor = ["#FF0000", "#FF0000"];
const pommeSpecialeColor = ["#00FF00","#00FF00"];
let theme = 0;

function changeTheme(){
    //console.log('change');
    if(theme === 0){
        theme = 1;
        document.getElementById("body").className = "black";
    }
    else{
        theme = 0;
        document.getElementById("body").className = "white";
    }
    if(snake !== null) draw();
}

function randomPos(){
    let x = Math.round(Math.random()*25)+1;
    let y = Math.round(Math.random()*28)+1;
    return [x, y];
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
        ctx.fillStyle = fontColor[theme];
        for(let i = 0; i < 30; i++){
            for(let j = 0; j < 30; j++){
                if(contains(snake, [i, j])){
                    ctx.fillStyle = snakeColor[theme];
                }
                else if(pomme[0] === i && pomme[1] === j){
                  if(isPommeSpeciale){
                    ctx.fillStyle = pommeSpecialeColor[theme];
                  } else{
                    ctx.fillStyle = pommeColor[theme];
                  }
                }
                else{
                    ctx.fillStyle = fontColor[theme];
                }
                ctx.fillRect(i*10, j*10, i*10+10, j*10+10);
            }
        }
    }
}

window.onkeypress = function(e){
    key = e.keyCode ? e.keyCode : e.which;
    if(!end && inter === null && (key === 37 || key === 113 || key === 38 || key === 122 || key === 39 || key === 100 || key === 40 || key === 115)){
        let sp = document.getElementById("dif");
        let time = sp.value;
        inter = setInterval(function (){
            //console.log('boucle');
            if(!boucle()) clearTimeout(inter);
        }, time);
    }
    // console.log(key);
}

function validateTerms(){
  var c=document.getElementById('termsCheckbox');
  if (c.checked) {
    return true;
  } else {
    return false;
  }
}

function boucle(){
  pommeSpecialeUnable=validateTerms();
    if(key === 37 || key === 113){ // gauche
        if(dir === 0 || dir === 2) dir =3;
    } else if(key === 38 || key === 122){ // haut
        if(dir === 1 || dir === 3) dir=0;
    } else if(key === 39 || key === 100){ // droite
        if(dir === 0 || dir === 2) dir =1;
    } else if(key === 40 || key === 115){ // bas
        if(dir === 1 || dir === 3) dir =2;
    }
    key = -1;

    //console.log(snake);
    let newPos = [snake[0][0]+dirs[dir][0], snake[0][1]+dirs[dir][1]];
    //console.log(newPos);
    snake.unshift(newPos);
    //console.log(snake);
    if(contains(snake, pomme)){
      if(isPommeSpeciale){
        countPomme+=3;
      }
        while(contains(snake, pomme)){
            pomme = randomPos();
            if(pommeSpecialeUnable && Math.random() < 0.1){
              isPommeSpeciale = true;
            }else{
              isPommeSpeciale=false;
            }
        }

        score++;
        document.getElementById('score').innerHTML="Score: "+score;


    }else if(countPomme>0){
      countPomme--;
      score++;
      document.getElementById('score').innerHTML="Score: "+score;
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
        document.getElementById('canvas').className = "loose";
        end = true;
        // console.log("end");
        return false;
    }

    draw();
    return true;
}

async function run(){
    if(inter !== null){
        clearTimeout(inter);
        inter = null;
    }
    end = false;
    document.getElementById('canvas').className = 'border';
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
}
