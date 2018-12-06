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
let canSpeedUp = true;
const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const fontColor = ["#FFFFFF", "#000000"];
const snakeColor = ["#000000", "#FFFFFF"];
const pommeColor = ["#FF0000", "#FF0000"];
const pommeSpecialeColor = ["#00FF00", "#00FF00"];
let dif = 200;
const scoreMult = {
    400:1,
    200:2,
    100:4,
    50:6,
    30:10
}
let theme = 0;

function changeTheme() {
    //console.log('change');
    if (theme === 0) {
        theme = 1;
        document.getElementById("body").className = "black";
    }
    else {
        theme = 0;
        document.getElementById("body").className = "white";
    }
    if (snake !== null) draw();
}

function randomPos() {
    let x = Math.round(Math.random() * 25) + 1;
    let y = Math.round(Math.random() * 28) + 1;
    return [x, y];
}

function contains(list, pos) {
    for (let i = 0; i < list.length; i++) {
        if (list[i][0] === pos[0] && list[i][1] === pos[1]) return true;
    }
    return false;
}

async function draw() {
    //console.log('draw');
    let canvas = document.getElementById("canvas");
    if (canvas === null) return;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = fontColor[theme];
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            if (contains(snake, [i, j])) {
                ctx.fillStyle = snakeColor[theme];
            }
            else if (pomme[0] === i && pomme[1] === j) {
                if (isPommeSpeciale) {
                    ctx.fillStyle = pommeSpecialeColor[theme];
                } else {
                    ctx.fillStyle = pommeColor[theme];
                }
            }
            else {
                ctx.fillStyle = fontColor[theme];
            }
            ctx.fillRect(i * 10, j * 10, i * 10 + 10, j * 10 + 10);
        }
    }
}

window.onkeypress = function (e) {
    key = e.keyCode ? e.keyCode : e.which;
    if (key === 114) { // reset si R
        run();
    }
    if (!end && inter === null && (key === 37 || key === 113 || key === 38 || key === 122 || key === 39 || key === 100 || key === 40 || key === 115)) {
        interval(dif);
    }
    // console.log(key);
}

function interval(time) {
    inter = setInterval(() => {
        if (!boucle()) clearInterval(inter);
        else if ((score+1) % (10*scoreMult[dif]) === 0 && canSpeedUp && time > 30) {
            clearInterval(inter);
            canSpeedUp = false;
            interval(time-10);
        }
    }, time)
}

function validateTerms() {
    var c = document.getElementById('termsCheckbox');
    if (c.checked) {
        return true;
    } else {
        return false;
    }
}

function boucle() {
    pommeSpecialeUnable = validateTerms();
    if (key === 37 || key === 113) { // gauche && Q
        if (dir === 0 || dir === 2) dir = 3;
    } else if (key === 38 || key === 122) { // haut && Z
        if (dir === 1 || dir === 3) dir = 0;
    } else if (key === 39 || key === 100) { // droite && D
        if (dir === 0 || dir === 2) dir = 1;
    } else if (key === 40 || key === 115) { // bas && S
        if (dir === 1 || dir === 3) dir = 2;
    }
    key = -1;

    //console.log(snake);
    let newPos = [snake[0][0] + dirs[dir][0], snake[0][1] + dirs[dir][1]];
    //console.log(newPos);
    snake.unshift(newPos);
    //console.log(snake);
    if (contains(snake, pomme)) {
        if (isPommeSpeciale) {
            countPomme += 3;
        }
        while (contains(snake, pomme)) {
            pomme = randomPos();
            if (pommeSpecialeUnable && Math.random() < 0.1) {
                isPommeSpeciale = true;
            } else {
                isPommeSpeciale = false;
            }
        }

        score += scoreMult[dif];
        document.getElementById('score').innerHTML = "Score: " + score;

        canSpeedUp = true;

    } else if (countPomme > 0) {
        countPomme--;
        score += scoreMult[dif];
        document.getElementById('score').innerHTML = "Score: " + score;
    }
    else {
        snake.pop();
    }

    if (contains(snake.slice(1, snake.length), snake[0])
        || snake[0][0] === -1
        || snake[0][1] === -1
        || snake[0][0] === 30
        || snake[0][1] === 30
    ) {
        document.getElementById('canvas').className = "loose";
        end = true;
        // console.log("end");
        return false;
    }

    draw();
    return true;
}

async function run() {
    if (inter !== null) {
        clearTimeout(inter);
        inter = null;
    }
    end = false;
    document.getElementById('canvas').className = 'border';
    snake = [];
    snake.push(randomPos());
    snake.push([snake[0][0] + 1, snake[0][1]]);
    snake.push([snake[1][0] + 1, snake[1][1]]);
    pomme = randomPos();
    score = 0;
    document.getElementById('score').innerHTML = "Score: " + score;
    while (contains(snake, pomme)) {
        pomme = randomPos();
    }
    key = -1;
    dir = 3;
    dif = document.getElementById("dif").value;
    draw();
}
