import sngr from './sngr.me.js';

let prepNextSong;

window.onstorage = function(){

   
    let hasIFrame = document.querySelector('iframe');

    displayList();

    if(!hasIFrame){
        play();
    }

    updateSongStatus();

}


window.addEventListener('load', function(){

    displayList();

    play();
    
  
})


function displayList(){

    const songs = JSON.parse(window.localStorage.getItem('KaraokeList')) || [];

    let songList = document.querySelector('.song-list');

    songList.innerHTML = '';

    songList.appendChild(sngr.displayReservedSongs(songs, function(){
        
        clearTimeout(prepNextSong);

        let songs = JSON.parse(window.localStorage.getItem('KaraokeList'));
                            
        songs.splice(0, 1);
    
        window.localStorage.setItem('KaraokeList', JSON.stringify(songs));

        displayList();
        play();
    }));
  
}

function play(){
   
    let songs = JSON.parse(window.localStorage.getItem('KaraokeList')) || [];

    if(songs.length === 0)
    {
       
        updateSongStatus(songs);

        return;

    }


    document.querySelector('.player-con').innerHTML = `<iframe src="https://www.youtube.com/embed/${songs[0].id}?autoplay=1&mute=0&start=0&controls=0" allow="autoplay"></iframe>`;
    
    updateSongStatus(songs);
    
    prepNextSong = setTimeout(nextSong, convertDuration(songs[0].duration));
    
    
}

function nextSong(){

    let songs = JSON.parse(window.localStorage.getItem('KaraokeList'));
    songs.splice(0, 1);

    window.localStorage.setItem('KaraokeList', JSON.stringify(songs));

    displayList();
    play();
}

function convertDuration(duration){


    return parseInt(eval(duration.replace('PT', '').replace('H', '*3600+').replace('M', '*60+').replace('S', '+').slice(0, -1))) * 1000;

}

function updateSongStatus(){

    let songs = JSON.parse(window.localStorage.getItem('KaraokeList')) || [];

    document.querySelector('.currentSong').textContent = songs[0] ? songs[0].title : 'Current Song is empty.';
    document.querySelector('.nextSong').textContent = songs[1] ? songs[1].title : 'Next Song is empty.';
}
