const { exec } = require('child_process');

let page = 1


function download(page) {
    return new Promise((resolve, reject) => {
        let command = `curl 'https://www.undelucram.ro/locuri-de-munca?search=&save-search-name=&search_city=&opened-filter=&page=${page}&external_page='  -o /var/www/jobs/data/undelucram/${page}.html   -H 'authority: www.undelucram.ro'   -H 'upgrade-insecure-requests: 1'   -H 'dnt: 1'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'   -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: navigate'   -H 'sec-fetch-user: ?1'   -H 'sec-fetch-dest: document'   -H 'referer: https://www.undelucram.ro/locuri-de-munca?search=&save-search-name=&search_city=&opened-filter=&page=3&external_page='   -H 'accept-language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'  --compressed`
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
                resolve(`${stdout}`);
        });

    })
}

let websites = []

for(var i = 1; i <= 161; i++) {
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