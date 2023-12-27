const express = require("express");
const socket = require("socket.io");

const app = express(); //Initialized and server ready

app.use(express.static("public"));

let port = process.env.port || 5000;
let server = app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})

let io = socket(server);

io.on("connection", (socket)=>{
    console.log("Made Socket Connection");

    // Received Data
    socket.on("beginPath", (data)=>{
        // data from frontend user
        // Now transfer data to all connected computers
        io.sockets.emit("beginPath", data); 
    })

    socket.on("drawStroke", (data)=>{
        io.sockets.emit("drawStroke", data);
    })

    socket.on("redoUndo", (data)=>{
        io.sockets.emit("redoUndo", data);
    })
})