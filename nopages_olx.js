const fs = require('fs')
const cheerio = require('cheerio');
const { response } = require('express');

function extractNoPages(content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(content);
        var pageResultsSelector = '.pager span.item'

        let pageAnchor = 1
        $(pageResultsSelector).each(function(i, elem) {
            pageAnchor = $(this).text().trim()
        })

        if(pageAnchor == undefined) {
            resolve(1)
        } else {
            resolve(pageAnchor)
        }
    })
}

module.exports = extractNoPages