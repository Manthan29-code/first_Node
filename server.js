let fs = require("fs")
let os = require("os")
let _ = require("lodash")
console.log("hello form serve ")

var user = os.userInfo()
console.log(user)

// fs.appendFile('greeting.txt' , 'hi ' + user.username + '! \n' , ()=> { console.log("file is created")}) 
let data = [ 1,2, 4,6,3,2,1 ,6,4,7,8,0]
let unique = _.uniq(data)
console.log(unique)

