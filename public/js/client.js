//socket ki jo coding hongi client ke liye vo karenge

const socket=io(); //io ko call kiya

var username;
var chats=document.querySelector(".chats");
var users_list=document.querySelector(".users-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg")

do{
    username=prompt("Enter your name: ");
}while(!username);

//it will be called when user will join
socket.emit("new-user-joined",username); //req jayegi server pe ki user join hua h

//notifying that user is join
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');  //socket se jo name aaya usko pass krdena
})

//function to create joined/left status div
function userJoinLeft(name,status){   // jo join hua vo pop up hona chaiye
 let div=document.createElement("div");  //ek div bna liya
 div.classList.add('user-join');  //sari styling aa jayegi div ki
 let content=`<p><b> ${name}</b>${status} the chat</p>`;
 div.innerHTML=content;
 chats.appendChild(div);
 chats.scrollTop=chats.scrollHeight;
}

//notifying that user has left
socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'Left')    //left krne ke liye
});

//for updating users list and  user counts
socket.on('user-list',(users)=>{
 users_list.innerHTML="";
 users_arr=Object.values(users);
 for(i=0;i<users_arr.length;i++){
    let p=document.createElement('p');
    p.innerText=users_arr[i];
    users_list.appendChild(p); //user list append ho jayegi

 }
  users_count.innerHTML=users_arr.length;
});

//for sending message
msg_send.addEventListener('click',()=>{
    let data={
        user:username,
        msg:user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        user_msg.value="";
    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming')
})