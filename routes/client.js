const router = require('express').Router()
const fs = require('fs')
const uuid = require('uuid')
const root = "C:/Users/97250/Desktop/JohnBryce Homework/express-backend/database"

router.get('/', (req, res) => {
    const {clientName, laptopID} = req.query
    if (!clientName || !laptopID) return res.sendFile('client.json', {root: root})
    fs.readFile(`${root}/laptop.json`, "utf8", (err, laptops) => {
        if (err) return res.sendStatus(500)
        laptops = JSON.parse(laptops)
        const computer = laptops.find(laptop => laptop.id == laptopID)
        if (!computer) return res.json({err: "missing details", massage: 'Check ID or Client name.'})
        fs.readFile(`${root}/client.json`, 'utf8', (err, clients) => {
            if (err) return res.sendStatus(500)
            clients = JSON.parse(clients)
            const client = clients.find(client => client.name == clientName)
            if (!client) return res.json({err: 'User Name is not existed'})
            client.amount = client.amount - computer.price
            fs.writeFile(`${root}/client.json`, JSON.stringify(clients), err => {
                if (err) return res.sendStatus(500)
                res.json(client)
            })
        })
    })
})

router.post('/newClient', (req, res) => {
    const newClient = req.body
    newClient.id = uuid.v4()
    fs.readFile(`${root}/client.json`, 'utf8', (err, clients) => {
        clients = JSON.parse(clients)
        clients.push(newClient)
        fs.writeFile(`${root}/client.json`, JSON.stringify(clients), err => {
            if (err) return res.sendStatus(500)
            res.sendStatus(201)
        })
    })
})

router.put('/change/:parameter/:id', (req, res) => {
    const {value} = req.body
    const {parameter, id} = req.params
    fs.readFile(`${root}/client.json`, 'utf8', (err, clients) => {
        if (err) return res.sendStatus(500)
        clients = JSON.parse(clients)
        const targetClient = clients.find(client => client.id == id)
        if (!targetClient) return res.json({massage: 'client ID not found'})
        targetClient[parameter] = value
        fs.writeFile(`${root}/client.json`, JSON.stringify(clients), err => {
            if (err) return res.sendStatus(500)
            res.sendStatus(202)
        })
    })
})

router.delete('/delete/:id', (req, res) => {
    const {id} = req.params
    fs.readFile(`${root}/client.json`, 'utf8', (err, clients) => {
        if (err) return res.sendStatus(500)
        let newArry = JSON.parse(clients)
        const checker = newArry.length
        newArry = newArry.filter(client => client.id != id)
        if (checker == newArry.length) return res.json({massage: `${id} ID is not found`})
        fs.writeFile(`${root}/client.json`, JSON.stringify(newArry), err => {
            if (err) return res.json({err: err, massage: 'something went wrong...'})
            res.sendStatus(202)
        } )
    })
})


module.exports = router