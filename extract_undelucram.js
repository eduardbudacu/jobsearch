const fs = require('fs')
const cheerio = require('cheerio');

function extractFile(file) {
    return extractContent(fs.readFileSync(file))
}

function getText(selector, targetElement, $) {
    return $(selector, targetElement).text().trim()
}

function getHref(selector, targetElement, $) {
    return $(selector, targetElement).attr('href')
}

function extractContent(content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(content);
        jobs = []
        var titleSelector = 'div.all-jobs-job-title a'
        var companySelector = 'h3'
        var locationSelector = 'div.details-and-action-container > div.row.m-b.mb-3.details > div:nth-child(1) > p:nth-child(2) > small > a'
        var urlSelector = 'h2 > a'

        $('.all-jobs-list').each(function(i, elem) {
            jobs.push({title: getText(titleSelector, this, $), company: getText(companySelector, this, $), location: getText(locationSelector, this, $), url: getHref(urlSelector, this, $), provider: 'bestjobs'})
        })
        resolve(jobs);
    })
}

extractFile('/var/www/jobs/data/undelucram/1.html').then(result => console.log(result))

module.exports = extractContent