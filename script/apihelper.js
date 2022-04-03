import sngr from './sngr.me.js'

const apiKey = "AIzaSyB3TULQ3VALh7ugd-wamkIKQSo1oNcg5tc"; //window.localStorage.getItem('YDAPIKey');

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

         return await fetchDataGet(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${q.replace('karaoke', '') + ' karaoke'}&type=video&videoEmbeddable=true&key=${apiKey}`);
   
      
    },
    video: async function(id){
        return await fetchDataGet(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=contentDetails&key=${apiKey}`).catch(function(err){
            console.log(err);
           
        });

    }
    
}