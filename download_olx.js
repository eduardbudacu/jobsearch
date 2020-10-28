const { exec } = require('child_process');

let page = 1


function download(page) {
    return new Promise((resolve, reject) => {
        let command = `curl 'https://www.olx.ro/ajax/search/list/' -o /var/www/jobs/data/olx/${page}.html   -H 'authority: www.olx.ro'   -H 'accept: */*'   -H 'dnt: 1'   -H 'x-requested-with: XMLHttpRequest'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'   -H 'content-type: application/x-www-form-urlencoded'   -H 'origin: https://www.olx.ro'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://www.olx.ro/locuri-de-munca/?page=2'   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   --data-raw 'view=&min_id=&q=&search%5Bcity_id%5D=&search%5Bregion_id%5D=&search%5Bdistrict_id%5D=0&search%5Bdist%5D=0&search%5Bcategory_id%5D=4&page=${page}'   --compressed`
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
                resolve(`${stdout}`);
        });

    })
}

let websites = []

for(var i = 1; i <= 25; i++) {
    websites.push(i)
}

(async () => {
    var len = websites.length
    var index = 0
    var chunk_size = 8
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