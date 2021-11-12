const { exec } = require('child_process');
const axios = require('axios')

const config = require('./config.json')

const DEBUG = config.debug

function search(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let command = `curl --location --request POST 'https://www.anofm.ro/dmxConnect/api/api/export.php' --form 'search="${keyword}"'`
        axios.post('https://www.anofm.ro/dmxConnect/api/api/export.php', {search: keyword}).then(res => {
            resolve(res.data);
        }).catch((err) => {
            reject(err)
        })
    })
}

function extractJobDetailsAnofm(job) {
    return {title:job.OCCUPATION.trim(), company: job.angajator, location: job.localitatea.trim(), provider: "anofm"}
}

module.exports = async (keyword) => {
    let websites = []

    var start = new Date()
    var hrstart = process.hrtime()

    let results = await search(1, keyword)
    let totalJobs = results['exportANOFM'].length
    let jobs = results['exportANOFM'].map(extractJobDetailsAnofm)

    var end = new Date() - start,
    hrend = process.hrtime(hrstart)

        
    console.info('Execution time (anofm): %dms', end)
    console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
    console.info('Results: %d', jobs.length)
    return jobs;
}