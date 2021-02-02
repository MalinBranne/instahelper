const tfi = require('tools-for-instagram');
const db = require('../db/me.inaminute_eu.json');
const getUserLikers = require('../src/getUserLikers.js')

// hashtags on which we are going to act
const hashtags = [
    /* 'beauty',
    
    'moisturising', 
    'facial', 
    'facemask',
    'sheetmask', 
    'hydration', 
    'biocellulose', 
    'hyaluronicacid', 
     */
    'beautytip', 
    'sthmlbeauty',
    'copenhagenbeauty',
    'beautyclinic',
    'skincaretips',
    'beautyjunkie', 
    'antiaging',
    'glow',
    'skönhet',
    'beautybloggers',
    'beautypro',
    /*
    'stockholm',
    'copenhagen',
   
    'plasticsurgeon',
    'chemicalpeel',
    'skincare',
    'antiaging'
    'skincaretips', 
    'dailyskincare', 
    'acne', 
    'hydration', 
    'antiwrinkles', 
    'facialmask', 
    'sensitiveskin', 
    'cosmetics', 
     
    'hydrafacial', 
    'facialtreatment', 
    'kbeauty', 
    'giveaway', 
    'sydney', 
    'australia',
    'postworkout', 
    'aftersuncare',
    'Skincaretips',
    'skincareroutine',
    'dailyskincare',
    'beautyfridge',
    'selfcare',
    'summeressentials',
    'porecare',
    'laser',
  
    'sheetmaskaddict',
    'coconutbiocellulose',
    'hydrationtreatment',
    'fillers',
    'cosmeticinjections',
    'selfcaretips',
    'beautyjunkie',
    'ausbeautyblogger',
    'texture',
    'chemicalpeel',
    'beautybloggersweden',
    'mua',
    'makeupartist',
    'makeupartiststockholm',
    'makeupbyme',
    'bridalmakeup',
    'freelancemakeupartist',
    'freelancemua',
    'softsmokeyeye',
    'makeupinspo',
    'stockholmmakeupartists',
    'dewyskin',
    'stockholmmua',
    'stockholmmakeupartist',
    'макияж',
    'makeupgoals',
    'inbeautmag',
*/
]

//We create schedules in which our bot will have activity
const intervals = {
    schedulesOfTheDay: [
        {startHour: 8, startMinute: 10, action: "likes"},
        {startHour: 9, startMinute: 40, action: "likes"},
        {startHour: 9, startMinute: 15, action: "likes"},
        {startHour: 9, startMinute: 30, action: "comment"},
        {startHour: 9, startMinute: 43, action: "likes"},
        {startHour: 10, startMinute: 00, action: "likes"},
        {startHour: 10, startMinute: 30, action: "comment"},
        {startHour: 11, startMinute: 00, action: "follow"},
        {startHour: 11, startMinute: 25, action: "likes"},
        {startHour: 11, startMinute: 50, action: "likes"},
        {startHour: 12, startMinute: 12, action: "comment"},
        {startHour: 12, startMinute: 42, action: "likes"},
        {startHour: 13, startMinute: 00, action: "likes"},
        {startHour: 14, startMinute: 00, action: "likes"},
        {startHour: 14, startMinute: 17, action: "likes"},
        {startHour: 14, startMinute: 47, action: "likes"},
        {startHour: 15, startMinute: 13, action: "likes"},
        {startHour: 15, startMinute: 33, action: "likes"},
        {startHour: 16, startMinute: 00, action: "likes"},
        {startHour: 16, startMinute: 32, action: "likes"},
        {startHour: 17, startMinute: 00, action: "likes"},
        {startHour: 17, startMinute: 30, action: "likes"},
        {startHour: 18, startMinute: 17, action: "likeLocation"},
        {startHour: 16, startMinute: 00, action: "unfollow"}
    ]
}
//we create a function to get all the hashtags we want
async function getPostsFromHashtags(ig,arrayOfHashtags){
    //Create an empty array to store all hashtags
    let allPosts = []

    //We go through the entire list of hashtags and add it to our empty array
    for(let i = 0 ; i < arrayOfHashtags.length ; i++){
        let hashtagActual = await recentHashtagList(ig,arrayOfHashtags[i])
        allPosts.push(hashtagActual)
    }

    //This line of code aligns all the elements in the same array
    return [].concat.apply([], allPosts)
}

/*
  This function generates a random number between a minimum and a maximum
  including the extremes within the returned range
*/
function randomIntInc(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function wait() {
    return sleep(randomIntInc(3,220));
}

setTimeout(async() => {
    try {
        //login in instagram
        let acc = loadConfig('meinaminute');
        let ig = await login(acc);


    //We start our interval
        setInterval(async() => {
            try {
                //Every time our interval is executed we get the hour and minute
                let currentDate = new Date();
                let getHour = currentDate.getHours();
                let getMinutes = currentDate.getMinutes();
                let minutes = getMinutes < 10 ? '0' + getMinutes : getMinutes;

                console.log(`\n -- Getting time: ${getHour}:${minutes} -- \n`.yellow.bold.underline);

                let noOfInteractions = 20;
                intervals.schedulesOfTheDay.forEach(async (time) => {
                    if (getHour == time.startHour && getMinutes == time.startMinute) {
                        let allPosts = await getPostsFromHashtags(ig, hashtags)
                        .catch((err) => {
                            console.log(`Could not fetch posts: ${err}`.red.bold.underline);
                            console.log('Will retry in 1 minute'.bold);
                        });

                        if (allPosts) {
                        
                            console.log(`\n -- Getting posts from hashtags, no of posts: ${Object.entries(allPosts).length} -- \n`.yellow.bold.underline);
                            
                            /* 
                                We check the list of our schedules and compare
                                it with the current time, if our schedule and
                                the current time is the same we execute the action
                            */
            
                            // Not working
                            if(time.action == 'getFollowers') {
                                for(let i = 0 ; i < noOfInteractions; i++) {
                                    await wait();
                                    getUserLikers(ig, 'me.inaminute_eu')
                                    .catch((err) => console.log('ERR ', err))    
                                }
                            }
        
                            if (time.action == 'likeLocation') {
                                let allLocationPosts = await topLocationList(ig, 'Stockholm');
                                let randomLocationNumber = randomIntInc(0, allLocationPosts.length);
                                let randomLocationPost = allLocationPosts[randomLocationNumber];
                                let randomLocationPostUser = randomLocationPost ? randomLocationPost.user : null;
        
        
                                for(let i = 0 ; i < noOfInteractions; i++) {
                                    await wait();
                                    if(randomLocationPost) {
                                        likeMediaId(ig, randomLocationPost.pk)
                                        .catch((err) => console.log(`Kunde inte gilla location post, ${err}`.red.bold));
                                    }
                        
                                    if(randomLocationPostUser) {
                                        await wait();
                                        followUser(ig, randomLocationPostUser.username)
                                        .catch((err) => console.log(`Kunde inte följa användare, ${err}`.red.bold));
                                    }
                                }
        
                            }
        
                            if (time.action == "likes") {
                                /*
                                We go through the entire array to find photos
                                randomly and also like with an irregular interval
                                between 3 seconds and 220 seconds
                                */
                                for(let i = 0 ; i < noOfInteractions; i++) {
                                    await wait()
                                    let randomNumber = randomIntInc(0,allPosts.length);
                                    let randomPost = allPosts[randomNumber];
                                    let randomUser = randomPost ? randomPost.user : null;
                                
                                    if(randomPost) {
                                        likeMediaId(ig, randomPost.pk)
                                        .catch((err) => console.log(`Kunde inte gilla, ${err}`.red.bold))
                                    }
        
                                    if(randomUser) {
                                        await wait();
                                        followUser(ig, randomUser.username)
                                        .catch((err) => console.log(`Kunde inte följa användare, ${err}`.red.bold));
                                        
                                    }
                                }
                            }
                            
                            if (time.action == 'comment') {
                                for(let i = 0 ; i < noOfInteractions; i++) {
                                    let randomPost = allPosts[randomIntInc(0, allPosts.length)];
                                    let comments = ["❤️", "Nice! :)", "😍😍"];
                                    let randomComment = comments[randomIntInc(0, comments.length)];

                                    await wait();
                                   
                                    if (randomPost) {
                                        likeMediaId(ig, randomPost.pk)
                                        .catch((err) => console.log(`Kunde inte gilla, ${err}`.red.bold));

                                        commentPost(ig, randomPost, randomComment)
                                        .catch((err) => console.log(`Could not comment. Error: ${err}`));
                                    }
                                }
                            }
        
                            if (time.action == "follow") {
                            /*
                                We go through the entire array to users
                                randomly and also follow with an irregular interval
                                between 3 seconds and 220 seconds
                                */
                                for(let i = 0 ; i < noOfInteractions; i++){
                                    let randomNumber = randomIntInc(0,allPosts.length);
                                    let randomPost = allPosts[randomNumber];
                                    let randomUser = randomPost ? randomPost.user : null;
                                    if (randomUser) {
                                        await wait();
                                        likeMediaId(ig, randomPost.pk)
                                        .catch((err) => console.log(`Kunde inte gilla, ${err}`.red.bold));

                                        followUser(ig, randomUser.username)
                                        .catch((err) => console.log(`Kunde inte följa användare, ${err}`.red.bold));
                                    }
                                }
                            }
        
                            if (db.follows.length > 0 && time.action == "unfollow") {
                                await sleep(randomIntInc(3,220));
                                db.follows.map(u => {
                                    if (!u.unfollowed_at) {
                                        setTimeout(() => {
                                            unfollowById(ig, u.user_id)
                                            .catch((err) => console.log(`Could not unfollow user. Error: ${err}`));
                                        }, 3000)
                                    }    
                                })
                            }
                        }

                        console.log('END OF INTERVAL'.red.bold.underline);
                    }
                });
            }
            // Edits: added try catch inside interval to try avoid bot crashing. If it works add to other bots aswell.
            catch {
                console.log('Bot interval error')
            }
        
        //This is the parameter of our interval, which is at 60000ms ( 1 minutes )
        }, 60000);


    }
    catch {
        console.log('Något gick fel')
    }

}, 400);