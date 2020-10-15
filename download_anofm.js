const { exec } = require('child_process');

let page = 1


function download(page) {
    return new Promise((resolve, reject) => {
        let limit = 32
        let offset = (page - 1) * limit
        let command = `curl 'https://www.anofm.ro/dmxConnect/api/oferte_bos/oferte_bos_query2L.php?offset=${offset}&cauta=&select=ANOFM&limit=${limit}&localitate=' -s -o /var/www/jobs/data/anofm/${page}.json  -H 'Connection: keep-alive'   -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'   -H 'DNT: 1'   -H 'Accept: */*'   -H 'Sec-Fetch-Site: same-origin'   -H 'Sec-Fetch-Mode: cors'   -H 'Sec-Fetch-Dest: empty'   -H 'Referer: https://www.anofm.ro/lmvw.html?agentie=ANOFM&page=8'   -H 'Accept-Language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'Cookie: PHPSESSID=u1s07imm1056vlno7np2g76767'   --compressed`
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
                resolve(`${stdout}`);
        });

    })
}

let websites = []

for(var i = 1; i <= 196; i++) {
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