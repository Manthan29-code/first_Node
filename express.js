const express = require('express')
const app = express()
const port = 3000

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
  console.log(`Example app listening on port ${port}`)
})