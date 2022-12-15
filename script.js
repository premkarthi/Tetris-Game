
const SHAPES = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ]

]

const COLORS = [
    '#f4f4f4',
    '#9b5fe0',
    '#16a4d8',
    '#8bd346',
    '#efdf48',
    '#f9a52c',
    '#d64e12',
    '#d64912',
]

const ROWS = 20;
const COLS = 10;


let canvas = document.querySelector('#tetris')
let ScoreDom = document.querySelector('.score')

let score = 0

let ctx = canvas.getContext("2d")
ctx.scale(30,30)

function generateRandomPiece() {
    let random = Math.floor(Math.random()*7)
    let piece = SHAPES[random]
    let colorIndex = random + 1
    let x = 4
    let y = 0
    return {piece, x, y, colorIndex}
}
let pieceObject = null
let grid = generateGrid()

setInterval(gameStart, 500)

function gameStart(){
    checkGrid()
    if(pieceObject == null){
        pieceObject = generateRandomPiece()
        renderPiece()
    }
    moveDown()
}

function checkGrid() {
    let count = 0
    for (let i = 0; i < grid.length; i++) {
        let allFilled = true
        for (let j = 0; j < grid[i].length; j++) {
            if( grid[i][j] == 0){
                allFilled = false
            }
        }
        if (allFilled){
            grid.splice(i, 1)
            grid.unshift([0,0,0,0,0,0,0,0,0,0])
            count++
        }
    }
    if (count == 1){
        score += 10
    }
    ScoreDom.innerHTML = score
}

function renderPiece() {
    if (pieceObject != null){
        let piece = pieceObject.piece
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j <= piece[i].length; j++) {
                if(piece[i][j] == 1){
                    ctx.fillStyle = COLORS[pieceObject.colorIndex]
                    ctx.fillRect(pieceObject.x + j,pieceObject.y + i, 1,1)
                }
            }        
        }
    }
}

function generateGrid(){
    let grid = []
    for (let i = 0; i < ROWS; i++) {
        grid.push([])
        for (let j = 0; j < COLS; j++) {
            grid[i].push(0)
        }
    }
    return grid
}

function renderGrid(){
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = COLORS[grid[i][j]]
            ctx.fillRect(j,i,1,1)
        }
    }
    renderPiece()
}

function moveDown(){
    if (pieceObject != null){
        if(!collision(pieceObject.x, pieceObject.y+1))
            pieceObject.y += 1
        else{
            let piece = pieceObject.piece
            for (let i = 0; i < piece.length; i++) {
                for (let j = 0; j < piece[i].length; j++) {
                    if(piece[i][j] == 1){
                        let p = pieceObject.x + j
                        let q = pieceObject.y + i
                        grid[q][p] = pieceObject.colorIndex
                    }
                }
            }
            if (pieceObject.y == 0) {
                alert("Game Over and you score " + score)
                grid = generateGrid()
                score = 0
            }
            pieceObject = null
        }
        renderGrid()
    }
 }
function moveLeft(){
    if (pieceObject != null){
        if(!collision(pieceObject.x-1, pieceObject.y)){
            pieceObject.x-= 1
        }
        renderGrid()
    }
}

function moveRight(){
    if (pieceObject != null){
        if(!collision(pieceObject.x+1, pieceObject.y)){
            pieceObject.x+= 1
        }
        renderGrid()
    }
}

function rotate() {
    if (pieceObject != null){
    let piece = pieceObject.piece
    let rotatePiece = []
    for (let i = 0; i < piece.length; i++) {
        rotatePiece.push([])
            for (let j = 0; j < piece[i].length; j++) {
                rotatePiece[i].push(0)
            }
        }

        for (let i = 0; i < piece.length; i++) {
            rotatePiece.push([])
            for (let j = 0; j < piece[i].length; j++) {
                rotatePiece[i][j] = piece[j][i]
            }
            rotatePiece[i].reverse()
        }

        if(!collision(pieceObject.x, pieceObject.y, rotatePiece)){
            pieceObject.piece = rotatePiece
        }
    renderGrid()
    }
}

function collision(x, y, rotatePiece){
    let piece = pieceObject.piece || rotatePiece
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if(piece[i][j] == 1){
               let p = x + j;
               let q = y + i;
               if(p>=0 && p<COLS && q >= 0 && q<ROWS){
                    if (grid[q][p] > 0){
                        return true
                    }
               }
               else{
                   return true
               }
            }
        }        
    }
    return false
}
document.addEventListener('keydown', function(e) {
    let key = e.code
    if (key == 'ArrowUp'){
        rotate()
    }
    else if(key == 'ArrowDown'){
        moveDown()
    }
    else if(key == 'ArrowLeft'){
        moveLeft()
    }
    else if(key == 'ArrowRight'){
        moveRight()
    }
}) 