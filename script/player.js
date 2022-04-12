import sngr from './sngr.me.js';
import apiHelper from './apihelper.js';

let prepNextSong;

window.onstorage = function(){

   
    startPlayer();

}

function startPlayer(){
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
    
  
});



document.querySelector('.toggle-search-btn').addEventListener('click', function(){
    const searchBox = document.createElement('DIV');
    searchBox.classList.add('search-box');
    
    const searchBoxContent = `
                <div class="controls-top">
                    <div class="close-con">
                        <button class="close-btn"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="toggle-search-icon" fill="#fff"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"/></svg></button>
                    </div>
                    <div class="input-con">
                        <input type="text" name="input-search" autocomplete="off" placeholder="search song / artist"/>
                    </div>
                </div>
                <div class="controls-bottom">
                    <div class="search-result-container">
                    <p>Search result is empty! </p>
                    <p>Type something on the search box then press enter key.</p>
                </div>`;

    searchBox.innerHTML = searchBoxContent;

    searchBox.classList.add('search-box-transition');

    document.body.appendChild(searchBox);

    document.querySelector('.close-btn').addEventListener('click', function(){

        document.querySelector('.search-box').remove();

    });

   
    document.querySelector('input[name=input-search]').addEventListener('keydown', function(e){
 
       
        if(e.keyCode == 13)
        {
            document.querySelector('.search-result-container').innerHTML = '';

            const q = e.target.value;
    
            if(q){
                loadResult(q);
               
            }
            
        }
    })
});


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
        document.querySelector('.player-con').innerHTML='';
        updateSongStatus(songs);

        return;

    }

    //console.log(player);

    document.querySelector('.player-con').innerHTML = `<iframe src="https://www.youtube.com/embed/${songs[0].id}?autoplay=1&mute=0&start=0" allow="autoplay"></iframe>`;
    
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


async function loadResult(q){

    document.querySelector('.search-box').appendChild(sngr.startLoader());
    let result = await apiHelper.search(q);
    

    document.querySelector('.search-result-container').innerHTML = '';
    document.querySelector('.search-result-container').append(await sngr.resultify(result, function(){
        startPlayer();
    }));

    sngr.stopLoader();
}