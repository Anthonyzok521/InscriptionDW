let options = document.querySelector('#options'),
bachiller = document.querySelector('#bachiller'),
student = document.querySelector('#student'),
season_placeholder = document.querySelector('#season');

options.addEventListener('click', ()=>{
    if(bachiller.checked){
        season_placeholder.max = 5
        season_placeholder.placeholder = "Año";
        student.value = "Bachiller";
    }else{
        season_placeholder.max = 10
        season_placeholder.placeholder = "Semestre";
        student.value = "Universitario";
    }
});

    if (typeof(Storage) !== "undefined") {
        console.log("Sí tiene localstorage");
        localStorage.setItem("student", "Curso de Angular avanzado - Víctor Robles");
    } else {
        console.log("No tiene localstorage");
    }

