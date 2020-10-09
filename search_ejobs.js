const { exec } = require('child_process');

function search(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let command = ''
        if(page == 1) {
            command = `curl 'https://www.ejobs.ro/locuri-de-munca/'  -s -H 'authority: www.ejobs.ro'   -H 'accept: application/json, text/javascript, */*; q=0.01'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8'   -H 'origin: https://www.ejobs.ro'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.ejobs.ro/locuri-de-munca/?cauta=php'   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'cookie: __cfduid=d923be0fcd80f101854f9b51e8df7773c1600941141; PHPSESSID=cac428ebed8375fda18d5f6702138e6f; show-popup-20=true; eloader=showed; __zlcmid=10ajUtLupcD9usT'   --data-raw 'output=js&language=ro&cauta=${keyword}'   --compressed`
        } else {
            command = `curl 'https://www.ejobs.ro/locuri-de-munca/pagina${page}/' -s  -H 'authority: www.ejobs.ro'   -H 'accept: application/json, text/javascript, */*; q=0.01'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8'   -H 'origin: https://www.ejobs.ro'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.ejobs.ro/locuri-de-munca/pagina2/?cauta=php'   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'cookie: __cfduid=d923be0fcd80f101854f9b51e8df7773c1600941141; PHPSESSID=cac428ebed8375fda18d5f6702138e6f; show-popup-20=true; eloader=showed; __zlcmid=10ajUtLupcD9usT'   --data-raw 'output=js&language=ro&cauta=${keyword}'   --compressed`
        }
        console.log(command)
        exec(command, (error, stdout, stderr) => {
            if (error) {

                reject(`${error}`);
            }
            resolve(JSON.parse(stdout));
        });
    })
}



module.exports = async (keyword) => {

    let websites = []

    let firstPage = await search(1, keyword)
    console.log(firstPage['total_pages'])
    for(var i = 1; i <= firstPage['total_pages']; i++) {
        websites.push(i)
    }

    var start = new Date()
    var hrstart = process.hrtime()

    var len = websites.length
    var index = 0
    var chunk_size = 2
    var jobs = []
    for (index = 0; index < len; index += chunk_size) {
      chunk = websites.slice(index, index+chunk_size);
      // Do something if you want with the group
      try {
        let res = await Promise.allSettled(chunk.map(el => search(el, keyword)))
        let fullfiled = res.filter(el => el.status == 'fulfilled')
        let rejected = res.filter(el => el.status == 'rejected')
        console.log(rejected.length)
        fullfiled.forEach(page => {
            if(page.value['jobs'] != undefined) {
                page.value['jobs'].forEach(job => {
                    jobs.push({title:job.title, company: job.company.name, location: job.cities})
                })
            }
        })
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