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
        var titleSelector = '.title'
        var companySelector = 'h3'
        var locationSelector = '.location'
        var urlSelector = 'h2 > a'

        $('#list_cart_wrapper .item_cart').each(function(i, elem) {
            jobs.push({title: getText(titleSelector, this, $), company: '', location: getText(locationSelector, this, $), url: $(this).attr('href'), provider: 'jobzz'})
        })
        resolve(jobs);
    })
}

module.exports = extractContent