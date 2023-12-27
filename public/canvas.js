let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let download = document.querySelector(".fa-download");
let undo = document.querySelector(".fa-rotate-left")
let redo = document.querySelector(".fa-rotate-right")

// let pencilToolCont = document.querySelector(".pencil-tool-cont");
let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let penColor = "blue"; //default color
let eraserColor = "white";

let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

// UNDO-REDO
let undoRedoTracker=[];
let track=0;



// by default 'false', otherwise line will start forming without even clicking mouse button
let mouseDown = false; 

// 'tool' is like a API through which we can access canvas graphic drawing
let tool = canvas.getContext("2d");

tool.strokeStyle=penColor; //color of line
tool.lineWidth=pencilWidth; //width of line

// tool.beginPath(); //to generate a new graphic path
// tool.moveTo(10,10); //start point
// tool.lineTo(100,150); //end point
// tool.stroke(); //fill color in the above formed line

// mousedown->start new path
// mousemove->path fill(graphic)

canvas.addEventListener("mousedown", (e)=>{
    mouseDown = true;
    // beginPath({
    //     x:e.clientX,
    //     y:e.clientY
    // })
    let data = {
        x:e.clientX,
        y:e.clientY
    }
    // send data to server
    socket.emit("beginPath" ,data);
})
canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown){
        let data = {
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag? eraserColor:penColor,
            width: eraserFlag? eraserWidth:pencilWidth
        }
        socket.emit("drawStroke", data);
        // before implementing socket
        // drawStroke({
        //     x:e.clientX,
        //     y:e.clientY,
        //     color: eraserFlag? eraserColor:penColor,
        //     width: eraserFlag? eraserWidth:pencilWidth
        // });
    }
})
canvas.addEventListener("mouseup", (e)=>{
    mouseDown = false;

    // filling the tracker and array with current image data
    // whenever mouse is lifted
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click",(e)=>{
    if(track>0) track--;
    // action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("redoUndo", data);
})
redo.addEventListener("click",(e)=>{
    if(track<undoRedoTracker.length-1) track++;
    // action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("redoUndo", data);
})
// function to draw image acc. to undo.redo action
function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = (e) =>{
        tool.drawImage(img,0,0, canvas.width, canvas.height);
    }
}

// --------------Graphic draw--------------
function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}
function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColors.forEach((colorElem) => {
    colorElem.addEventListener('click', (e)=> {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

// changing width of pencil and eraser
pencilWidthElem.addEventListener("change", (e)=>{
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})
eraserWidthElem.addEventListener("change", (e)=>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

// apply eraser props when clicked
eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = pencilWidth;
    }
})

// download functionality
download.addEventListener("click", (e)=>{
    let url = canvas.toDataURL();
    let a = document.createElement("a");

    a.href = url;
    a.download = "Board.jpg";
    a.click();
})

socket.on("beginPath", (data)=>{
    // data from server
    beginPath(data);
})

socket.on("drawStroke", (data)=>{
    drawStroke(data);
})

socket.on("redoUndo", (data)=>{
    undoRedoCanvas(data);
})