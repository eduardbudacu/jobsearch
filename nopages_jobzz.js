const fs = require('fs')
const cheerio = require('cheerio');
const { response } = require('express');

function extractNoPages(content) {
    return new Promise((resolve, reject) => {
        const $ = cheerio.load(content);
        var pageResultsSelector = '.pagination ul li'
        
        let pages = []

        $(pageResultsSelector).each((i, el) => {
            pages.push(el)
        });

        pages.pop()
        let result = pages.pop()
        resolve($(result).text())
    })
}

module.exports = extractNoPages