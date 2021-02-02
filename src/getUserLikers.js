const getUserRecentPosts = require("tools-for-instagram/src/getUserRecentPosts");
const axios = require('axios');

async function getUserLikers(ig, username, maxUsers = undefined, proxyConfig = undefined) {
   
    const lastPost = await getUserRecentPosts(ig, username)
    .then((res) => res[0])
    .catch((err) => console.log(`Could not get recent posts. Error: ${err}`.red.bold))
    
   // let lastPost =  userInfo.lastFeedPosts && userInfo.lastFeedPosts[0] ? userInfo.lastFeedPosts[0] : null;
     
    if (lastPost) {
        console.log('inside lastPost ');
        let urlSegment = parser.instagramIdToUrlSegment(Number(lastPost.id));
        let results = [];
        try {
            
            let url = null;
            let nextCursor = null;
            let hasMoreUsers = false;
            do {
                let proxy = null;
                if(proxyConfig != undefined) {
                    proxy = proxyConfig;
                }
    
                //console.log("Continue");
                if(nextCursor) {
                    url = 'https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={"shortcode":"'+urlSegment+'","include_reel":true,"first":50, "after": "'+nextCursor+'"}';
                } else {
                    url = 'https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={"shortcode":"'+urlSegment+'","include_reel":true,"first":50}';
                }

                const config = {
                    url: url,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36' },
                    proxy: proxy
                }

                let info;
                for (let i; i < 1; i++) {
                    
                    await axios.get(config)
                    .then((res) => {
                        console.log(`RES getUserLikers:  ${res}`.red.bold.underline);
                        info = res.data;

                        console.log('INFO ', info);
                    
                        let parsedData = info.data.shortcode_media.edge_liked_by;
                        hasMoreUsers = parsedData.page_info.has_next_page;
                        nextCursor = parsedData.page_info.end_cursor;
                
                        let receivedUsers = parsedData.edges;
                        let users = receivedUsers.map(({node}) => node);
                        results.push(...users);
                        if(!hasMoreUsers) {
                            console.log("Received users: " + results.length);
                        } else {
                            process.stdout.clearLine();
                            process.stdout.cursorTo(0);
                            process.stdout.write("Received users: " + results.length);
                        }
                        if(maxUsers!= undefined && results.length >= maxUsers) {
                            console.log("\nMax users signal received!".cyan);
                            return;
                        }
                    })
                    .catch((err) => console.log(`Error: ${err}`));
                }
            
                    if(results.length%8000 == 0) {
                        await sleep(60*15);
                 } 
            } while(hasMoreUsers);
    
    
        } catch (error) {
            console.log('getUserLikers failed: ', error)
        }

        console.log("Received getUserLikers: " + results);
        return results;
    }
    return [];
    
}

module.exports = getUserLikers;