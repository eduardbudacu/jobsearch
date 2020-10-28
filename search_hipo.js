const { exec } = require('child_process');

const DEBUG = false

const extractContent = require('./extract_hipo')
const extractNoPages = require('./nopages_hipo')

function search(page, keyword) {
    return new Promise((resolve, reject) => {
        keyword = encodeURIComponent(keyword)
        let command = `curl 'https://www.hipo.ro/locuri-de-munca/cautajob/Toate-Domeniile/Toate-Orasele/${keyword}/${page}' -L -s -H 'Connection: keep-alive'   -H 'DNT: 1'   -H 'Upgrade-Insecure-Requests: 1'   -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'   -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'   -H 'Sec-Fetch-Site: none'   -H 'Sec-Fetch-Mode: navigate'   -H 'Sec-Fetch-User: ?1'   -H 'Sec-Fetch-Dest: document'   -H 'Accept-Language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'Cookie: cookieconsent_status=dismiss; _fbp=fb.1.1603821261524.2146005761; ctlyst_hp_sss=3rhk255crs0jn7soq3l4gb3s10; size=1920; orientation=landscape; _ga=GA1.2.1595240245.1603879413; _gid=GA1.2.661662668.1603879413; _gat=1'   --compressed`
        
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

    console.info('Execution time (hipo): %dms', end)
    console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000)
    console.info('Results: %d', jobs.length)
    return jobs;
}