const http=require('http')
const api=require('./game.api')

const server=http.createServer(api)

server.listen(3003)

console.log("server started")