const fs = require('fs')
const cheerio = require('cheerio');

function extractNoPages(content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(content);
        var pageResultsSelector = 'h1'

        resolve($(pageResultsSelector).text().trim().split(' ')[0])
    })
}

module.exports = extractNoPages