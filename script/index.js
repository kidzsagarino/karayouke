
import apiHelper from './apihelper.js';
import sngr from './sngr.me.js';

document.querySelector('.search-box').addEventListener('keydown', async function(e){

    
    if(e.keyCode == 13)
    {
        const q = e.target.value;

        if(q){
            loadResult(q);
           
        }
        
    }
});


document.querySelector('.player-btn').addEventListener('click', function(){

  sngr.openPlayer();

});

document.querySelector('.btn-search').addEventListener('click', function(){
    const q = document.querySelector('.search-box').value;
    if(q){
        loadResult(q);
    }

   
});


window.addEventListener('DOMContentLoaded', async function(){

    loadResult('OPM Karaoke');
});



async function loadResult(q){

    
    document.querySelector('.content').appendChild(sngr.startLoader());
    
    let result = await apiHelper.search(q);
    

    document.querySelector('.search-result-container').innerHTML = '';
    document.querySelector('.search-result-container').append(await sngr.resultify(result));

    sngr.stopLoader();
}