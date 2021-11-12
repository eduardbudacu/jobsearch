const { exec } = require('child_process');

let page = 1


function download(page) {
    return new Promise((resolve, reject) => {
        let command = `curl 'https://9cae628214b04e29ba10df6bab6594f3.ent-search.europe-west1.gcp.cloud.es.io/api/as/v1/engines/techleap-talent/search' -o /var/www/jobs/data/techleap/${page}.json   -H 'authority: 9cae628214b04e29ba10df6bab6594f3.ent-search.europe-west1.gcp.cloud.es.io'   -H 'sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"'   -H 'accept: application/json, text/plain, */*'   -H 'authorization: Bearer search-5j4k1kpvkghoh8j5j4xp4dnd'   -H 'sec-ch-ua-mobile: ?0'   -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'   -H 'content-type: application/json'   -H 'origin: https://startupjobs.techleap.nl'   -H 'sec-fetch-site: cross-site'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://startupjobs.techleap.nl/'   -H 'accept-language: en-US,en;q=0.9'   --data-raw '{"page":{"current":${page},"size":39},"facets":{"topics":[{"type":"value","sort":{"count":"desc"},"size":250}],"locations":[{"type":"value","sort":{"count":"desc"},"size":250}],"job_functions":[{"type":"value","sort":{"count":"desc"},"size":15}],"company_name":[{"type":"value","sort":{"count":"desc"},"size":250}]},"filters":{"all":[{"any":[{"locations":["Amsterdam, Netherlands"]}]},{"any":[{"job_functions":["Software Engineering"]}]}]},"query":"","sort":[{"created_at":"desc"}]}'   --compressed`
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}`);
            }
                resolve(`${stdout}`);
        });

    })
}

let websites = []

for(var i = 1; i <= 10; i++) {
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

