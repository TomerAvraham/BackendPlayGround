const router = require('express').Router()
const fs = require('fs')
const root = "C:/Users/97250/Desktop/JohnBryce Homework/express-backend/database"

router.get('/', (req, res) => {
    const {name} = req.query
    if (!name) return res.sendFile("laptop.json", {root: root})
    fs.readFile(`${root}/laptop.json`, 'utf8', (err, laptops) => {
        if (err) res.sendStatus(500)
        laptops = JSON.parse(laptops)
        const filterLaptops = laptops.filter(laptop => laptop.name.toUpperCase().includes(name.toUpperCase()))
        if (!filterLaptops.length) {
            res.status(400).json({massage: `There is no laptop with key: ${name}`})
        }else{
            res.send(JSON.stringify(filterLaptops))
        }
    })
})

router.get('/screen/:size', (req, res) => {
    fs.readFile(`${root}/laptop.json`, 'utf8', (err, laptops) => {
        if (err) return res.sendStatus(500)
        laptops = JSON.parse(laptops)
        const filterLaptops = laptops.filter(laptop => laptop.screen == req.params.size)
        if (!filterLaptops.length) {
            res.status(400).json({massage: "There is no laptop at this size"})
        }else{
            res.send(JSON.stringify(filterLaptops))
        }
    })
})

router.post('/add', (req, res) => {
    fs.readFile(`${root}/laptop.json`, 'utf8', (err, laptops) => {
        if (err) return res.sendStatus(500)
        laptops = JSON.parse(laptops)
        laptops.push(req.body)
        fs.writeFile(`${root}/laptop.json`, JSON.stringify(laptops), err => {
            if (err) return res.sendStatus(500)
            res.sendStatus(201)
        })
    })
})

router.put('/discount/:id', (req, res) => {
    const keys = ["KUF-123", "RPP-481", "ZZZ-479"]
    const key = req.query.key
    const id = req.params.id
    if (!key) return res.status(400).json()
    if (!keys.includes(key)) return res.status(400).json({key: key, massage: "you don't have the correct key"})
    fs.readFile(`${root}/laptop.json`, 'utf8', (err, laptops) => {
        if (err) return res.sendStatus(500)
        laptops = JSON.parse(laptops)
        const discountLaptop = laptops.find(laptop => laptop.id == id)
        if (!discountLaptop) return res.json({err:404, massage:`laptop id- ${id} not found`})
        discountLaptop.price = discountLaptop.price * 0.9
        fs.writeFile(`${root}/laptop.json`, JSON.stringify(laptops), err => {
            if (err) return res.sendStatus(500)
            res.sendStatus(202)
        }) 
    })
})

router.delete('/delete/:id', (req, res) => {
    fs.readFile(`${root}/laptop.json`, 'utf8', (err, laptops) => {
        if (err) return res.sendStatus(500)
        laptops = JSON.parse(laptops)
        const index = laptops.findIndex(laptop => laptop.id == req.params.id)
        index > -1 ? laptops.splice(index, 1) : res.json({massage: `id- ${req.params.id} not found`})
        fs.writeFile(`${root}/laptop.json`, JSON.stringify(laptops), err => {
            if (err) return res.sendStatus(500)
            res.sendStatus(202)
        })         
    })
})

module.exports = router