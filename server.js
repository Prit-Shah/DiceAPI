const http=require('http');
const api=require('./game.api');
const io=require('socket.io');
const server=http.Server(api);
const room=require('./Model/Rooms.model');
let ROLLING_DICE='Rolling... 🎲️';
const PORT = process.env.PORT || 3003;
server.listen(PORT,{ 
    cors: { 
      origin: '*',
      methods: ['GET', 'POST']
    }  
  })
console.log(`server started at ${PORT} ...`)
const socket=io(server)
socket.on('connection',(sock)=>{
    //sock.on('disconnecting',()=>{
       // if(Array.from(sock.rooms.values())[1]){        
        //    socket.to(Array.from(sock.rooms.values())[1]).emit('someoneleft',true);}
   // })
    sock.on('start',(name,player)=>{
        if(!room.checkRoom(name)){
            room.addRoom(name)
            sock.join(name)
            room.addplayer(name,player)
            socket.in(name).emit('playerjoined',room.getplayers(name))
            socket.in(name).emit('iscreater',true)            
        }        
        else{
            sock.emit('roomexists',name)
        }         
    }) 
    sock.on('playerjoined',(name,player)=>{
        if(room.checkRoom(name)){
            room.addplayer(name,player)
            sock.join(name)
            socket.in(name).emit('playerjoined',room.getplayers(name))
        }
        else{
            sock.emit('roomnotexists',true)
        }               
    })
    sock.on('gamestarted',(name)=>{        
        sock.join(name)
        socket.in(name).emit('gamestarted',true)        
    })
    sock.on('rollingdice',(name)=>{        
        sock.join(name)
        socket.in(name).emit('rollingdice',ROLLING_DICE)        
    }) 
    sock.on('dicenumber',(name,number)=>{        
        sock.join(name)
        socket.in(name).emit('dicenumber',number)        
    })
    sock.on('hold',(name,pls)=>{
        sock.join(name)
        socket.in(name).emit('hold',pls)
    }) 
    sock.on('setme',(name)=>{
        sock.join(name)
         socket.in(name).emit('setme',room.getplayers(name).length)       
    })
    sock.on('reset',(name)=>{
        sock.join(name)
        socket.in(name).emit('reset',room.getplayers(name))
    })
    sock.on('exitroom',(name)=>{
        sock.join(name)
        socket.in(name).emit('exitroom',true)
    })
})

