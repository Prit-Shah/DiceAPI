const socket = io();
let room;
let iscreater = false;
let gameStarted = false;
let rollingdice = 'Rolling... 🎲️';
let me = 0;
let turn = 1;
let playername = "Player";
let MAX_SCORE = 100;
const rollsound = new Audio("../audio/gamemisc_dice-roll-on-wood_jaku5-37414.mp3");
const holdsound = new Audio('../audio/Ohno.mp3')
function createuser() {
    const creatediv = document.getElementById("createuser");
    creatediv.insertAdjacentHTML(
        "beforeend",
        '<div class="row" id="newplayer"><div class="col-4"><input class=" form-control mt-3 w-1" type="text" id="plname"></insert><button class="btn btn-light mt-1 text-right" onclick="addplayer()">Add</button></div></div>'
    );
}
const Room = function (n) {
    this.name = n;
};
let players = new Array();
function load() {
    if (playername === "Player") {
        document.getElementById("addbtn").disabled = true;
        document.getElementById("startbtn").disabled = true;
    }
}
function Changename() {
    playername = document.getElementById("plname").value;
    document.getElementById("addbtn").disabled = false;
    document.getElementById("startbtn").disabled = false;
    document.getElementById("plnamebtn").disabled = true;
    playername = document.getElementById("plname").readOnly = true;
}
function displayplayers() {
    const playing = document.getElementById("playersplaying");
    playing.innerHTML = "";
    let i = 1;
    players.forEach((player) => {
        playing.insertAdjacentHTML(
            "beforeend",
            `<div class="container mt-3" id="player${i}" style="margin:10px;"> ${player.name} Score : ${player.score}</div>`
        );
        i++;
    });
}
function start() {
    if (players.length < 2) alert("Add atleast 2 player");
 else {
        document.getElementById("startbtndiv").classList.add("hide");
        if (iscreater) socket.emit("gamestarted", room);
    }
}
function changeplaying() {
    if (me == turn) {
        const playingplayer = document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("btnroll").classList.remove("hide");
        document.getElementById("btnhold").classList.remove("hide");
        document.getElementById("divscorecount").classList.remove("hide");
    } else {
        const playingplayer = document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("btnroll").classList.add("hide");
        document.getElementById("btnhold").classList.add("hide");
        document.getElementById("divscorecount").classList.add("hide");
    }
}
let dicenumber;
let scorecount = 0;
async function play() {
    rollsound.play();
    document.getElementById("btnroll").disabled = true;
    document.getElementById("btnhold").disabled = true;
    socket.emit("dicenumber", room, await rolldice());
    socket.emit("rollingdice", room);
}
function dispscores() {
    setTimeout(() => {
        document.getElementById("dice").innerHTML = dicenumber;       
        if (dicenumber > 1) {
            scorecount += dicenumber;
            document.getElementById("scorecount").innerHTML = scorecount;
            
        } else {
            holdsound.play();
            if (me == turn) {
                scorecount = 0;
                hold();
            }
        }        
    }, 1000);
    setTimeout(()=>{
        document.getElementById("btnroll").disabled = false;
        document.getElementById("btnhold").disabled = false;
    },1200);
    document.getElementById("dice").innerHTML = rollingdice;
}
function rolldice() {
    return Math.ceil(Math.random() * 6);
}
function hold() {
    players[turn - 1].score += scorecount;
    socket.emit("hold", room, players);
}
function changeonhold() {
    if (turn < players.length) {
        var playingplayer = document.getElementById(`player${turn}`);
        playingplayer.classList.remove("playing");
        turn += 1;
        var playingplayer = document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("scorecount").innerHTML = scorecount;
    } else {
        var playingplayer = document.getElementById(`player${turn}`);
        playingplayer.classList.remove("playing");
        turn = 1;
        var playingplayer = document.getElementById(`player${turn}`);
        playingplayer.classList.add("playing");
        document.getElementById("scorecount").innerHTML = scorecount;
    }
}
function addroom() {
    room = document.getElementById("roomname").value;
    document.getElementById("roomname").disabled = true;
    socket.emit("start", room, document.getElementById("plname").value);
}
function joinroom() {
    room = document.getElementById("roomname").value;
    document.getElementById("roomname").disabled = true;
    socket.emit("playerjoined", room, document.getElementById("plname").value);
}
function checkwin() {
    return players.find((p) => {
        return p.score >= MAX_SCORE;
    });
}
socket.on("playerjoined", (pls) => {
    players = pls;
    displayplayers();
    if (iscreater)
        players.length > 1 && document.getElementById("startbtndiv").classList.remove("hide");
    socket.emit("setme", room);
});
socket.on("gamestarted", (val) => {
    gameStarted = val;
    if (gameStarted) {
        start();
        changeplaying();
        document.getElementById("message").innerHTML = ""
        document.getElementById("addbtn").disabled = true;
        document.getElementById("startbtn").disabled = true;
    }
});
socket.on("rollingdice", (val) => {
    rollingdice = val;
});
socket.on("dicenumber", (val) => {
    dicenumber = val;
    dispscores();
});
socket.on("hold", async (pls) => {
    players = pls;
    scorecount = 0;
    await displayplayers();
    await changeonhold();
    await changeplaying();
    if (checkwin()) {
        alert(`${checkwin().name} has won 🎉`);
        if (iscreater) {
            if (confirm("want to restart?")) {
                socket.emit("reset", room);
            }
        }
    }
});
socket.on("setme", (me1) => {
    if (me === 0) me = me1;
});
socket.on("roomexists", (r) => {
    document.getElementById("message").innerHTML = "Room exists";
});
socket.on("roomnotexists", (r) => {
    document.getElementById("message").innerHTML = "Room doesn't exists";
});
socket.on("iscreater", (val) => {
    iscreater = val;
});
socket.on("reset", (pls) => {
    players = pls;
    displayplayers();
});

socket.on("someoneleft",(val)=>{
    if(val){
        if(confirm("someoneleft")) window.location=window.location;
        else  window.location=window.location;      
    }
})