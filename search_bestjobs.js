const { exec } = require('child_process');
const axios = require('axios')
const config = require('./config.json')

const DEBUG = config.debug

const extractContent = require('./extract_bestjobs')
const extractNoPages = require('./nopages_bestjobs');
const { url } = require('inspector');

function search_curl(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let command = ''
        if(page == 1) {
            command = `curl 'https://www.bestjobs.eu/ro/locuri-de-munca?keyword=${keyword}&location='   -H 'authority: www.bestjobs.eu'   -H 'cache-control: max-age=0'   -H 'dnt: 1'   -H 'upgrade-insecure-requests: 1'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'   -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'   -H 'sec-fetch-site: none'   -H 'sec-fetch-mode: navigate'   -H 'sec-fetch-user: ?1'   -H 'sec-fetch-dest: document'   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'cookie: hl=ro; _nid=211dudYM8G1w3ySJGAEaCugIMXO9zgpGXr_Vcdd78eQ; disclaimer=true; jl-top-banner=9bc72f0be4c71b706c2d20c1e7e9c0d9; bestjobs_sid2=484315c68f49a8e2a986eaad634d64b9; jl-subscribe=1'   --compressed`
        } else {
            command = `curl 'https://www.bestjobs.eu/ro/locuri-de-munca/relevant/${page}?keyword=${keyword}&location=' -s  -H 'authority: www.bestjobs.eu'   -H 'accept: */*'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.bestjobs.eu/ro/locuri-de-munca?keyword=&location='   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'cookie: hl=ro; _nid=211dudYM8G1w3ySJGAEaCugIMXO9zgpGXr_Vcdd78eQ; disclaimer=true; jl-subscribe=1; jl-top-banner=9bc72f0be4c71b706c2d20c1e7e9c0d9; bestjobs_sid2=1ff4cb9c1712d4bb35b33558cdd47519'   --compressed`
        }

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

function search(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let url = ''
        let headers = {
            authority: 'www.bestjobs.eu',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9,ro;q=0.8,co;q=0.7'
        }

        if(page == 1) {
            url = `https://www.bestjobs.eu/ro/locuri-de-munca?keyword=${keyword}&location=`
        } else {
            url = `https://www.bestjobs.eu/ro/locuri-de-munca/relevant/${page}?keyword=${keyword}&location=`
            headers['x-requested-with'] = 'XMLHttpRequest'
        }

        if(DEBUG)
            console.log(url)

        axios.get(url, {
            headers: headers
        }).then((res) => {
            resolve(res.data)
        }).catch((err) => {

        })
    })
}

module.exports = async (keyword) => {

    let websites = []

    var start = new Date()
    var hrstart = process.hrtime()
    if(config.max_pages > 1) {
        let content = await search(1, keyword)
        let totalJobs = await extractNoPages(content)
        var jobs = await extractContent(content)
        const JOBS_PER_PAGE = 24
        let pages = parseInt(totalJobs / JOBS_PER_PAGE) + 1

        if(pages > config.max_pages) {
            pages = config.max_pages
        }

        for(var i = 2; i <= pages; i++) {
            websites.push(i)
        }

        var len = websites.length
        var index = 0
        var chunk_size = config.parallel_requests
        
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
    } else {
       var jobs = await search(1, keyword).then(el => extractContent(el))
    }

    var end = new Date() - start,
    hrend = process.hrtime(hrstart)

    console.info('Execution time (bestjobs): %dms', end)
    console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
    console.info('Results: %d', jobs.length)
    return jobs;
}