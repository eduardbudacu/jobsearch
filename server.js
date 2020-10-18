const express = require('express')

const app = express()

app.use('/', express.static('frontend'))

const bestjobs = require('./search_bestjobs')
const ejobs = require('./search_ejobs')
const anofm = require('./search_anofm')

app.get('/anofm', async (req, res) => {
    let jobs = await anofm(req.query.query)
    res.status(200).send(jobs)
})

app.get('/bestjobs', async (req, res) => {
    let jobs = await bestjobs(req.query.query)
    res.status(200).send(jobs)
})

app.get('/ejobs', async (req, res) => {
    let jobs = await ejobs(req.query.query)
    res.status(200).send(jobs)
})

app.listen(3001)