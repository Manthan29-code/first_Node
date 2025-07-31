const express = require('express')
const app = express()
const db = require('./db')
const PersonRoute = require('./routes/personRoute')
const menuRoute = require('./routes/menuRoute')
const bodyParser = require('body-parser')
require('dotenv').config()
// const passport = require("./auth")

app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        bodyParser.json()(req, res, next);
    } else {
        next();
    }
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON syntax' });
    }
    next();
});


const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World! \nHow can i help you ??')
})

// middleware function 
const logRequest =( req  , res  , next)=>{
  console.log(`${new Date().toLocaleString()} Request Made to : ${req.originalUrl}`);
  next()
}

// app.use(passport.initialize())
// const localAuthMiddleware= passport.authenticate( 'local' , { session : false})

app.get('/manthan', (req, res) => {
  console.log("responce header" , req.headers)
  res.send('Hello World! \nHow can i help manthan ??')
})

app.post('/postData'  , (req , res) =>{
    res.send(" response received ")
  
})

app.listen(port, () => {
  console.log(`dbOperation app listening on port ${port}`)
})

// Person //
app.use('/person' , PersonRoute)

// Menu //
app.use('/addMenu' , menuRoute)





