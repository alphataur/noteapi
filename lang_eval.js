const cp = require("child_process")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

function execFile(target, fpath){
  return new Promise((resolve, reject)=>{
    const handle = cp.spawn(target, [fpath])
    let res = ""
    handle.stdout.on("data", data => {
      res += data.toString()
    })
    handle.stdout.on("end", ()=>{
      return resolve(res)
    })
    handle.stdout.on("error", err => {
      return reject(err)
    })
  })
}

function hashContents(commands){
  let hasher = crypto.createHash("md5")
  hasher.update(commands)
  return hasher.digest("hex")
}

function flushContents(commands, options){
  var fpath; //seriously whats wrong with me!
  switch(options.language){
    case "python":
      fpath = path.join(__dirname, "sandbox", "python", hashContents(commands)+".py")
      break;
    case "javascript":
      fpath = path.join(__dirname, "sandbox", "js", hashContents(commands)+".js")
      break;
    default:
      return false
  }
  fs.writeFileSync(fpath, commands)
  return fpath
}

async function pyExec(commands){
  let fpath = flushContents(commands, {language: "python"})
  let target = "python"
  try{
    console.log(await execFile(target, fpath))
  }
  catch(e){
    fs.unlinkSync(fpath)
  }
}

async function jsExec(commands){
  let fpath = flushContents(commands, {language: "javascript"})
  let target = "node"
  try{
    console.log(await execFile(target, fpath))
  }
  catch(e){
    fs.unlinkSync(fpath)
  }
}

let commands = `
print(list(map(lambda e: e**2, range(100))))
`

let jsCommands = `
if(Array.prototype.last === undefined){
  Array.prototype.last = function(){
    return this[this.length - 1]
  }
}
var a = [1,2,3,4,5,6,7,8,9]
console.log(a.map(e => e*2))
console.log(a.last())
`

module.exports = {
  jsExec: jsExec,
  pyExec: pyExec
}
