let options = document.querySelector('#options'),
bachiller = document.querySelector('#bachiller'),
season_placeholder = document.querySelector('#season');

options.addEventListener('click', ()=>{
    if(bachiller.checked){
        season_placeholder.max = 5
        season_placeholder.placeholder = "Año";
    }else{
        season_placeholder.max = 10
        season_placeholder.placeholder = "Semestre";
    }
});