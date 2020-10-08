const express = require('express')

const app = express()

app.use('/', express.static('frontend'))

const bestjobs = require('./bestjobs_download')

app.use('/bestjobs', async (req, res) => {
    let jobs = await bestjobs(req.query.query)
    res.status(200).send(jobs)
})

app.listen(3001)