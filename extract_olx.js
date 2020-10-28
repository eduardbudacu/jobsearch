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
        var titleSelector = 'h3 > a'
        var companySelector = '.offer-logo'
        var locationSelector = 'tr:nth-child(2) p small:nth-child(1)'
        var urlSelector = 'h3 > a'

        $('td.offer-job').each(function(i, elem) {
            jobs.push({title: getText(titleSelector, this, $), company: getText(companySelector, this, $), location: getText(locationSelector, this, $), url: getHref(urlSelector, this, $), provider: 'olx'})
        })
        resolve(jobs);
    })
}

module.exports = extractContent