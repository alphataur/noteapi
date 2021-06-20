const http = require("http")
const httpHandler = require("./handler").codeServe

const handle = new httpHandler()




http.createServer((req, res)=>{
    return handle.serve(req, res)
  })
  .listen(7000, ()=>{
    console.log("server running at 7000!")
  })
