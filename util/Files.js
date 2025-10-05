let fs = require("fs")
// let os = require("os")
// let _ = require("lodash")
// console.log("hello form serve ")

// var user = os.userInfo()
// console.log(user)

// fs.appendFile('greeting.txt' , 'hi ' + user.username + '! \n' , ()=> { console.log("file is created")}) 
// let data = [ 1,2, 4,6,3,2,1 ,6,4,7,8,0]
// let unique = _.uniq(data)
// console.log(unique)


//Sync writing
fs.writeFileSync("./output.txt" ,"Hey there" )

//async writing
// fs.writeFile("./output.txt" ,"Hey there asynchronous" , (err)=> {})


//Sync reading 
// const content  = fs.readFileSync("./output.txt" , 'utf-8')
// console.log(content)

///async reading 
fs.readFile("./output.txt" , 'utf-8' , (err , result)=>{
    if(err){
        console.log("Error :- " , err)
    }else{
        console.log(result)
    }
})

fs.cpSync("./output.txt" , "./output(copy_1).txt")
fs.unlinkSync("./output.txt" )

