const { exec } = require('child_process');

const DEBUG = false

function search(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let limit = 32
        let offset = (page - 1) * limit
        let command = `curl 'https://www.anofm.ro/dmxConnect/api/oferte_bos/oferte_bos_query2L.php?offset=${offset}&cauta=${keyword}&select=ANOFM&limit=${limit}&localitate=' -s -H 'Connection: keep-alive'   -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'DNT: 1'   -H 'Accept: */*'   -H 'Sec-Fetch-Site: same-origin'   -H 'Sec-Fetch-Mode: cors'   -H 'Sec-Fetch-Dest: empty'   -H 'Referer: https://www.anofm.ro/lmvw.html?agentie=ANOFM&page=8'   -H 'Accept-Language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'Cookie: PHPSESSID=u1s07imm1056vlno7np2g76767'   --compressed`
        
        if(DEBUG)
            console.log(command)

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
            resolve(JSON.parse(stdout));
        });

    })
}

function extractJobDetailsAnofm(job) {
    return {title:job.OCCUPATION.trim(), company: 'N/A', location: job.ADRESA_LOCALITATEA.trim(), provider: "anofm"}
}

module.exports = async (keyword) => {
    let websites = []

    let firstPage = await search(1, keyword)
    let totalJobs = firstPage['lmv']['total']
    const JOBS_PER_PAGE = 32
    let pages = parseInt(totalJobs / JOBS_PER_PAGE) + 1

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
      try {
        let res = await Promise.allSettled(chunk.map(el => search(el, keyword)))
        res.filter(el => el.status == 'fulfilled').map(el => el.value).forEach(element => {
            jobs = jobs.concat(element['lmv']['data'].map(extractJobDetailsAnofm))
        }); 
      } catch(err) {
        console.log(err)
      }
      
    }

    var end = new Date() - start,
    hrend = process.hrtime(hrstart)

        
    console.info('Execution time (anofm): %dms', end)
    console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
    console.info('Results: %d', jobs.length)
    return jobs;
}