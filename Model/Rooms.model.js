const Rooms=[];

const Room=function(name){
    this.name=name,
    this.players=new Array()
}

function addRoom(name){
    Rooms.push(new Room(name))
}

function checkRoom(name){
    return Rooms.some(r=>{
        return r.name===name
    })
}

function addplayer(name,pl){
   Rooms.forEach(r=>{
    if(r.name===name){
        r.players.push({ name:pl,score:0 })
    }
   })
}

function getplayers(name){
    let players;
    Rooms.forEach(r=>{  
        if(r.name===name) {                     
           players =  r.players
        } 
    })   
    return players;
}
module.exports={    
    addRoom,
    checkRoom,
    addplayer,
    getplayers
}
