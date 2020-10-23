const express = require('express')
const app = express()
const port = 5000

app.use(express.json())

app.use('/laptop', require('./routes/laptop'))
app.use('/client', require('./routes/client'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => console.log(`port ${port} is in the air`))