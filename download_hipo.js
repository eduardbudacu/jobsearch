const { exec } = require('child_process');

let page = 1


function download(page) {
    return new Promise((resolve, reject) => {
        let command = `curl 'https://www.hipo.ro/locuri-de-munca/cautajob/${page}'  -o /var/www/jobs/data/hipo/${page}.html  -H 'Connection: keep-alive'   -H 'DNT: 1'   -H 'Upgrade-Insecure-Requests: 1'   -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'   -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'   -H 'Sec-Fetch-Site: none'   -H 'Sec-Fetch-Mode: navigate'   -H 'Sec-Fetch-User: ?1'   -H 'Sec-Fetch-Dest: document'   -H 'Accept-Language: en-US,en;q=0.9,ro;q=0.8,co;q=0.7'   -H 'Cookie: ctlyst_hp_sss=vankf4sbolsv12aqq307u78723; cookieconsent_status=dismiss; _fbp=fb.1.1603821261524.2146005761; size=1920; orientation=portrait'   --compressed`
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
                resolve(`${stdout}`);
        });

    })
}

let websites = []

for(var i = 1; i <= 77; i++) {
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