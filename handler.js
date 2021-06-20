const http = require("http")

class codeServe{
  constructor(){
    this.routes = {}
    this.setDevRoutes()
  }
  setDevRoutes(){
    this.routes["/"]  = (req, res) =>{
      this.setJSONHead(res)
      return this.sendJSON(res, {name: "nikhil"})
    }
  }
  setJSONHead(res){
    return res.writeHead(200, {"content-type": "application/json"})
  }
  sendJSON(res, payload){
    return res.end(JSON.stringify(payload))
  }
  addRoute(routeName, handler){
    this.routes[routeName] = handler
  }
  mapToRoute(req, res){
    return this.routes[req.url](req, res)
  }
  async mapToRouteAsync(req, res){
    return await this.routes[req.url](req, res)
  }
  serve(req, res){
    let uriPath = req.url
    if(uriPath in this.routes)
      return this.mapToRoute(req, res)
    else
      return this.sendError(req, res, "404")
  }
  sendError(req, res, code){
    res.writeHead(code, {"Content-Type": "application/json"})
    res.end(JSON.stringify({result: http.STATUS_CODES[code]}))
  }
}



module.exports = {
  codeServe
}
