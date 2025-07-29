const express = require('express')
const app = express()
const db = require('./db')
const PersonRoute = require('./routes/personRoute')
const menuRoute = require('./routes/menuRoute')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.json())


const port = process.env.PORT || 3000
app.get('/', (req, res) => {
  res.send('Hello World! \nHow can i help you ??')
})

app.get('/manthan', (req, res) => {
  res.send('Hello World! \nHow can i help manthan ??')
})

app.post('/postData' , (req , res) =>{
        res.send(" response received ")
})

app.listen(port, () => {
  console.log(`dbOperation app listening on port ${port}`)
})

// Person //
app.use('/person' , PersonRoute)

// Menu //
app.use('/addMenu' , menuRoute)





