const http=require('http')
const api=require('./game.api')
const io=require('socket.io')
const server=http.Server(api)
const room=require('./Model/Rooms.model')

server.listen(3003,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
console.log("server started")
const socket=io(server)
socket.on('connection',(sock)=>{
    console.log(`User Connected`)
    sock.on('start',(name,player)=>{
        if(!room.checkRoom(name,player)){
            room.addRoom(name)
            sock.join(name)
            room.addplayer(name,player)
            socket.in(name).emit('playerjoined',room.getplayers(name))            
        }            
    })
    sock.on('playerjoined',(name,player)=>{
        room.addplayer(name,player)
        sock.join(name)
        socket.in(name).emit('playerjoined',room.getplayers(name))
    })
})

