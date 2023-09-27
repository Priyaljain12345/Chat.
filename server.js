const http=require("http"); //http require
const express=require("express");  //express require 

const app=express(); //app bnaya

const server=http.createServer(app); //app
const port=process.env.PORT || 3000;  //3000 port pe kiya

app.use(express.static(__dirname+'/public')); //directory public acces hue

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html') //indexhtml direname
})

//Socket.io Setup

const io=require("socket.io")(server);
var users={};

io.on("connection",(socket)=>{
    // console.log(socket.id);  //only for check tym ki socket connection bna h ki nhi
    socket.on("new-user-joined",(username)=>{
      users[socket.id]=username; //user ka name store ho jayega uski value ho jayegi
      // console.log(users);
      socket.broadcast.emit('user-connected',username); //jo join hua uske alava sabko bta do kon join hua
      io.emit("user-list",users);
    })

    socket.on("disconnect",()=>{
      socket.broadcast.emit('user-disconnected',user=users[socket.id])
      delete users[socket.id];
      io.emit("user-list",users);
    })

    socket.on('message',(data)=>{
      socket.broadcast.emit("message",{user:data.user,msg:data.msg})
    })

  })



server.listen(port,()=>{
    console.log("Server started at"+port); //port ko call krne ke liey bnaya
});
