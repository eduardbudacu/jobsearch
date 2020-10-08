const { exec } = require('child_process');

let page = 1


function download(page) {
    return new Promise((resolve, reject) => {
        let command = `curl 'https://www.ejobs.ro/locuri-de-munca/pagina${page}/' -o /var/www/jobs/ejobs/${page}.json  -H 'authority: www.ejobs.ro'   -H 'accept: application/json, text/javascript, */*; q=0.01'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'content-type: application/x-www-form-urlencoded; charset=UTF-8'   -H 'origin: https://www.ejobs.ro'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.ejobs.ro/locuri-de-munca/pagina2/'   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'cookie: __cfduid=d923be0fcd80f101854f9b51e8df7773c1600941141; PHPSESSID=cac428ebed8375fda18d5f6702138e6f; show-popup-20=true; eloader=showed'   --data-raw 'output=js&language=ro'   --compressed`
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
                resolve(`${stdout}`);
        });

    })
}

let websites = []

for(var i = 1; i <= 139; i++) {
    websites.push(i)
}

(async () => {
    var len = websites.length
    var index = 0
    var chunk_size = 16
    for (index = 0; index < len; index += chunk_size) {
      chunk = websites.slice(index, index+chunk_size);
      // Do something if you want with the group
      try {
        let res = await Promise.allSettled(chunk.map(el => download(el)))
        console.log(res)
      } catch(err) {
        console.log(err)
      }
      
    }
    
})()