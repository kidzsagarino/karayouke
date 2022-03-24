import sngr from './sngr.me.js'

async function fetchDataGet(url){
    return await fetch(url,{
        headers: {
            "Accept-Encoding" : "gzip"
        }
    }).then(function(data){

        if(data.ok){
            return data.json();
        }else if(data.status == 403 || data.status == 400){
            sngr.promptAPIKey();
            return;
        }
       
    }).catch(function(err){
       console.log(err);
    });
}

export default {
    search: async function(q){

         return await fetchDataGet(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${q.replace('karaoke', '') + ' karaoke'}&type=video&videoEmbeddable=true&key=${window.localStorage.getItem('YDAPIKey')}`);
   
      
    },
    video: async function(id){
        return await fetchDataGet(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=${window.localStorage.getItem('YDAPIKey')}`).catch(function(err){
            console.log(err);
           
        });

    }
    
}