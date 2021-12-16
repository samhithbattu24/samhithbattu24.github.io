const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

const scorePlr = document.querySelector('#scorePlr')
const scoreCpu = document.querySelector('#scoreCpu')

const startGameBtn = document.querySelector('#startGameBtn')
const startGameWBtn = document.querySelector('#startGameWBtn')
const startGameLBtn = document.querySelector('#startGameLBtn')

const setTab = document.querySelector('#setTab')
const winTab = document.querySelector('#winTab')
const loseTab = document.querySelector('#loseTab')

const difficulty = document.querySelector('#difficulty')
const maxPoints = document.querySelector('#maxPoints')

canvas.width = 1000
canvas.height = 600

var speedB = 7
var speedP = 1.6

document.querySelectorAll('.easy').forEach(item => {
    item.addEventListener('click', () => {
        speedB = 7
        speedP = 2.4
        difficulty.innerHTML = 'EASY'
    })
})

document.querySelectorAll('.medium').forEach(item => {
    item.addEventListener('click', () => {
        speedB = 9
        speedP = 1.6+1.6
        difficulty.innerHTML = 'MEDIUM'
    })
})

document.querySelectorAll('.hard').forEach(item => {
    item.addEventListener('click', () => {
        speedB = 9.7
        speedP = 2.4*1.6
        difficulty.innerHTML = 'HARD'
    })
})

var winScore = 3

document.querySelectorAll('.p3').forEach(item => {
    item.addEventListener('click', () => {
        winScore = 3
        maxPoints.innerHTML = winScore
    })
})

document.querySelectorAll('.p5').forEach(item => {
    item.addEventListener('click', () => {
        winScore = 5
        maxPoints.innerHTML = winScore
    })
})

document.querySelectorAll('.p8').forEach(item => {
    item.addEventListener('click', () => {
        winScore = 8
        maxPoints.innerHTML = winScore
    })
})

class Ball{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw(){
        c.beginPath()
        c.fillStyle = this.color
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Paddle{
    constructor(x, y, width, height, color){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }

    draw(){
        c.beginPath()
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, this.width, this.height)
        c.fill()
    }

    update(){
        this.draw()
    }
}

let ball = new Ball(25, canvas.height/2, 5, 'red', {
    x: 0,
    y: 0
})

let paddle1 = new Paddle(5, canvas.height/2-50, 10, 100, 'white')
let paddle2 = new Paddle(canvas.width-15, canvas.height/2-50, 10, 100, 'white')

let animationId
let playerScore = 0
let cpuScore = 0

c.fillStyle = 'rgb(0, 0, 0)'
c.fillRect(0, 0, canvas.width, canvas.height)

function animate(){
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.24)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    for(var i=7; i<canvas.height; i+=24){
        c.fillStyle = 'white'
        c.fillRect(canvas.width/2-0.5, i, 1, 10)
    }

    ball.update()

    if(ball.y>paddle1.y && ball.y<paddle1.y+paddle1.height){
        if(ball.x<20){
            ball.velocity.x = -ball.velocity.x

            var delY = ball.y - paddle1.y - paddle1.height/2
            ball.velocity.y = delY * 0.016 * 6
        }
    }else if(ball.x<10){
        cpuScore++
        scoreCpu.innerHTML = cpuScore
        if(cpuScore==winScore){
            cancelAnimationFrame(animationId)
            loseTab.style.display = 'flex'
        }

        ball.velocity.x = -ball.velocity.x
        ball.velocity.y = ball.velocity.y * 0.24
    }

    if(ball.y>paddle2.y && ball.y<paddle2.y+paddle2.height){
        if(ball.x>canvas.width-20){
            ball.velocity.x = -ball.velocity.x

            var delY = ball.y - paddle2.y - paddle2.height/2
            ball.velocity.y = delY * 0.016 * 6
        }
    }else if(ball.x>canvas.width-10){
        playerScore++
        scorePlr.innerHTML = playerScore
        if(playerScore==winScore){
            cancelAnimationFrame(animationId)
            winTab.style.display = 'flex'
        }

        ball.velocity.x = -ball.velocity.x
    }

    if(ball.y<5){
        ball.velocity.y = -ball.velocity.y
    }

    if(ball.y>canvas.height-5){
        ball.velocity.y = -ball.velocity.y
    }

    paddle1.update()

    paddle2.update()

    if(paddle2.y+paddle2.height/2<ball.y-paddle2.height/4){
        paddle2.y = paddle2.y + speedP
    }else if(paddle2.y+paddle2.height/2>ball.y+paddle2.height/4){
        paddle2.y = paddle2.y - speedP
    }
}

addEventListener('click', ()=>{ 
    if(ball.velocity.x==0 && ball.velocity.y==0){
        ball.velocity.x = speedB
    }
})

addEventListener('mousemove', (event)=>{
    paddle1.y = event.clientY - 50 - paddle1.height/2
})

function initial(){
    ball = new Ball(25, canvas.height/2, 5, 'red', {
        x: 0,
        y: 0
    })
    
    paddle1 = new Paddle(5, canvas.height/2-50, 10, 100, 'white')
    paddle2 = new Paddle(canvas.width-15, canvas.height/2-50, 10, 100, 'white')

    playerScore = 0
    scorePlr.innerHTML = playerScore
    cpuScore = 0
    scoreCpu.innerHTML = cpuScore
}

winTab.style.display = 'none'
loseTab.style.display = 'none'

startGameBtn.addEventListener('click', ()=>{
    setTab.style.display = 'none'
    initial()
    animate()
})

startGameWBtn.addEventListener('click', ()=>{
    winTab.style.display = 'none'
    initial()
    animate()
    clearRadioButtons()
})

startGameLBtn.addEventListener('click', ()=>{
    loseTab.style.display = 'none'
    initial()
    animate()
    clearRadioButtons()
})

function clearRadioButtons(){
    var radioButtonArray = document.querySelectorAll('.btn')
    for (var i=0; i<radioButtonArray.length; i++){
        var radioButton = radioButtonArray[i]
        radioButton.classList.remove('active')
    }
}
