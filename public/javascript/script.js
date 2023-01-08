const socket=io('https://dice-api.onrender.com/')
let room;
let iscreater=false;
let gameStarted=false;
let rollingdice;
let me=0;
let turn=1;
let playername="Player";

function createuser(){
    const creatediv = document.getElementById("createuser");
    creatediv.insertAdjacentHTML("beforeend",'<div class="row" id="newplayer"><div class="col-4"><input class=" form-control mt-3 w-1" type="text" id="plname"></insert><button class="btn btn-light mt-1 text-right" onclick="addplayer()">Add</button></div></div>');
}
const player=function(n){
    this.name=n,
    this.score=0
};

const Room=function(n){
    this.name=n
};

let players=new Array();
// function addplayer(){
//     const newplayer = new player(document.getElementById("plname").value);
//     players.push(newplayer);
//     const creatediv = document.getElementById("createuser");
//     creatediv.removeChild(document.getElementById("newplayer"));
//     console.log(totalplayers(players));
//     displayplayers(players);
// }
function load(){
    if(playername==="Player"){
        document.getElementById('addbtn').disabled=true;
        document.getElementById('startbtn').disabled=true
}
}

function Changename(){
    playername=document.getElementById("plname").value;
    console.log(document.getElementById("plname").value,playername)
    document.getElementById('addbtn').disabled=false;
    document.getElementById('startbtn').disabled=false
        document.getElementById('plnamebtn').disabled=true
        playername=document.getElementById("plname").readOnly=true;
}
function totalplayers(arrplayers){
    const total = arrplayers.reduce((total)=>total+=1,0);
    return total;
}

function displayplayers(arrplayers){
    const playing = document.getElementById("playersplaying");
    playing.innerHTML="";
    let i=1;
    arrplayers.forEach(player => {                
        playing.insertAdjacentHTML("beforeend",`<div class="container mt-3" id="player${i}" style="margin:10px;"> ${player.name} Score : ${player.score}</div>`);
        i++;
    });
    if(iscreater)
        totalplayers(arrplayers)>1 && document.getElementById('startbtndiv').classList.remove('hide');
}

function start(){
    if(totalplayers(players)<2){
        alert('Add atleast 2 player');
    }
    else{
        document.getElementById("startbtndiv").classList.add('hide');
        if(iscreater)
            socket.emit('gamestarted',room)
        // const creatediv = document.getElementById("createuser");
        // creatediv.innerHTML="";        
    }  
}

function changeplaying(){
    if(me==turn){
        const playingplayer=document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");       
        document.getElementById("btnroll").classList.remove('hide');
        document.getElementById("btnhold").classList.remove('hide');
        document.getElementById("divscorecount").classList.remove('hide');
    }
    else{
        const playingplayer=document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("btnroll").classList.add('hide');
        document.getElementById("btnhold").classList.add('hide');
        document.getElementById("divscorecount").classList.add('hide');
    }
}
let dicenumber;
let scorecount=0;
async function play(){     
        let audio=new Audio('../audio/gamemisc_dice-roll-on-wood_jaku5-37414.mp3') 
        audio.play()
        socket.emit('dicenumber',room,await rolldice())        
        socket.emit('rollingdice',room)
                                     
}
function dispscores(){
    setTimeout(()=>{       
        document.getElementById('dice').innerHTML=dicenumber;
        if(dicenumber>1){
            scorecount+=dicenumber;
            document.getElementById("scorecount").innerHTML= scorecount;           
        }
        else
        {
            scorecount=0;   
            document.getElementById("scorecount").innerHTML= scorecount; 
            if(me==turn)        
                hold();
        }},1000);
    document.getElementById('dice').innerHTML=rollingdice;
}

function rolldice(){
    return Math.ceil(Math.random() * 6);
}

function hold(){
     players[turn-1].score+=scorecount;             
     socket.emit('hold',room,players)
}
function changeonhold(){
    if(turn<totalplayers(players)){
        var playingplayer=document.getElementById(`player${turn}`);
        playingplayer.classList.remove("playing");
        turn+=1;        
        var playingplayer=document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("scorecount").innerHTML=scorecount;
    }
    else{
        var playingplayer=document.getElementById(`player${turn}`);
        playingplayer.classList.remove("playing");
        turn=1;
        var playingplayer=document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("scorecount").innerHTML=scorecount;
    }
}
function addroom(){
    
   
    room = document.getElementById("roomname").value;
    // socket.emit('checkroom',room)
    // iscreater=true;
    socket.emit('start',room,document.getElementById("plname").value)           
}

function joinroom(){
    room = document.getElementById("roomname").value;
    socket.emit('playerjoined',room,document.getElementById("plname").value)                 
}
        

    
socket.on('playerjoined',(pls)=>{
        players = pls;
        // console.log('player joined',pls)
        displayplayers(pls)
        socket.emit('setme',room)

})   

socket.on('gamestarted',(val)=>{
    gameStarted=val;
    if(gameStarted){ start();changeplaying();}
})

socket.on('rollingdice',(val)=>{
    rollingdice=val 
    // dispscores()   
})

socket.on('dicenumber',(val)=>{
    dicenumber=val    
    dispscores()
})

socket.on('hold',(pls)=>{
    players=pls   
    scorecount=0;
    displayplayers(pls)    
    changeonhold()
    changeplaying()
})

socket.on('setme',(me1)=>{
    if(me===0) me=me1;
})

socket.on('roomexists',(r)=>{
    document.getElementById('message').innerHTML="Room exists"
})

socket.on('roomnotexists',(r)=>{
    document.getElementById('message').innerHTML="Room doesn't exists"
})

socket.on('iscreater',(val)=>{
    iscreater=val
})