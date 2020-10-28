const fs = require('fs')
const cheerio = require('cheerio');
const { response } = require('express');

function extractNoPages(content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(content);
        var pageResultsSelector = 'a.page-last'

        let pageAnchor = $(pageResultsSelector).attr('href')

        if(pageAnchor == undefined) {
            resolve(1)
        } else {
            resolve(pageAnchor.split('/').pop())
        }
    })
}

module.exports = extractNoPages