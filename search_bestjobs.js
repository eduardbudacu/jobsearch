const { exec } = require('child_process');

const extractContent = require('./extract_bestjobs')

function search(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let command = `curl 'https://www.bestjobs.eu/ro/locuri-de-munca/relevant/${page}?keyword=${keyword}&location=' -s  -H 'authority: www.bestjobs.eu'   -H 'accept: */*'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.bestjobs.eu/ro/locuri-de-munca?keyword=&location='   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'cookie: hl=ro; _nid=211dudYM8G1w3ySJGAEaCugIMXO9zgpGXr_Vcdd78eQ; disclaimer=true; jl-subscribe=1; jl-top-banner=9bc72f0be4c71b706c2d20c1e7e9c0d9; bestjobs_sid2=1ff4cb9c1712d4bb35b33558cdd47519'   --compressed`
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

    for(var i = 1; i <= 16; i++) {
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
        let res = await Promise.allSettled(chunk.map(el => search(el, keyword)))
        let fullfiled = res.filter(el => el.status == 'fulfilled')
        let rejected = res.filter(el => el.status == 'rejected')
        console.log(rejected.length)
        let parsed = await Promise.allSettled(fullfiled.map(el => extractContent(el.value)))
        parsed.filter(el => el.status == 'fulfilled').map(el => el.value).forEach(element => {
            jobs = jobs.concat(element)
        }); 
      } catch(err) {
        console.log(err)
      }
      
    }

    var end = new Date() - start,
    hrend = process.hrtime(hrstart)

    console.info('Execution time: %dms', end)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    return jobs;
}