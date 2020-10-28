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
        var titleSelector = 'td:nth-child(1) > a'
        var companySelector = 'td:nth-child(2)'
        var locationSelector = 'td:nth-child(3)'
        var urlSelector = 'td:nth-child(1) > a'

        $('tr[itemtype="http://schema.org/JobPosting"]').each(function(i, elem) {
            jobs.push({title: getText(titleSelector, this, $), company: getText(companySelector, this, $), location: getText(locationSelector, this, $), url: getHref(urlSelector, this, $), provider: 'hipo'})
        })
        resolve(jobs);
    })
}


module.exports = extractContent