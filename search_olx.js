const { exec } = require('child_process');

const DEBUG = false

const extractContent = require('./extract_olx')
const extractNoPages = require('./nopages_olx')

function search(page, keyword) {
    return new Promise((resolve, reject) => {
       // keyword = encodeURIComponent(keyword.split(' ').join('+'))
        let command = `curl 'https://www.olx.ro/ajax/search/list/' -L -s   -H 'authority: www.olx.ro'   -H 'accept: */*'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'   -H 'content-type: application/x-www-form-urlencoded'   -H 'origin: https://www.olx.ro'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.olx.ro/locuri-de-munca/?page=2'   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   --data-raw 'view=&min_id=&q=${keyword}&search%5Bcity_id%5D=&search%5Bregion_id%5D=&search%5Bdistrict_id%5D=0&search%5Bdist%5D=0&search%5Bcategory_id%5D=4&page=${page}'   --compressed`

        if(DEBUG)
            console.log(command)

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
            resolve(`${stdout}`);
        });
    })
}

module.exports = async (keyword) => {

    let websites = []

    let pages = await search(1, keyword).then(el => extractNoPages(el))

    if(pages > 200) {
        pages = 200
    }

    for(var i = 1; i <= pages; i++) {
        websites.push(i)
    }

    var start = new Date()
    var hrstart = process.hrtime()

    var len = websites.length
    var index = 0
    var chunk_size = 8
    var jobs = []
    for (index = 0; index < len; index += chunk_size) {
      chunk = websites.slice(index, index+chunk_size);
      // Do something if you want with the group
      try {
        let res = await Promise.allSettled(chunk.map(el => search(el, keyword).then(el => extractContent(el))))
        res.filter(el => el.status == 'fulfilled').map(el => el.value).forEach(element => {
            jobs = jobs.concat(element)
        }); 
      } catch(err) {
        console.log(err)
      }
      
    }

    var end = new Date() - start,
    hrend = process.hrtime(hrstart)

    console.info('Execution time (olx): %dms', end)
    console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
    console.info('Results: %d', jobs.length)
    return jobs;
}