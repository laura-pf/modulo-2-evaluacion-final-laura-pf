'use strict';



  /* BUSQUEDA de serie anime: dos partes:
1. Un campo de texto y un botón para buscar series por su título.
    -Cuando la usuaria haga click en el botón buscar.
    -recoge la informacion de las series
    -las muestra en el html 

2. Un listado de resultados de búsqueda donde aparece el cartel de la serie y el título.*/


const searchButton = document.querySelector(".js-searchButton");
const inputSearch = document.querySelector(".js-inputSearch");
const containerAllSeries= document.querySelector(".js-containerSeries");
let seriesList = [];
let image;
const placeholder = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
const notImage = "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
let favoriteSeries = [];
const containerFavoriteSeries= document.querySelector(".js-containerFavoriteSeries");



function renderSeries(series, container) {
   for(const serie of series){

        if (serie.images.jpg.image_url === notImage ){
            image = placeholder

        }else{
            image = serie.images.jpg.image_url
        }

        container.innerHTML += ` 
        <div class= "js-containerOneSerie" id="${serie.mal_id}" >
            <h3>${serie.title}</h3>
            <img src="${image}" alt="$${serie.title}">  
        </div>
      ` 
    
    }

    const containersOneSerie = document.querySelectorAll(".js-containerOneSerie")
    for (const containeroneSerie of containersOneSerie ){
        containeroneSerie.addEventListener("click", handleClickFavorite)
    }
}

function handleClickFavorite (event) {
    const clickFavorite = event.currentTarget;
    clickFavorite.classList.add("colorFav");

    const idClickFavorite = parseInt(event.currentTarget.id);


    const serieSelected = seriesList.find((serie) => {
        return idClickFavorite === serie.mal_id;
        
    })

    favoritesSeries.push(serieSelected)
    renderSeries(favoriteSeries,containerFavoriteSeries)
    
}



function handleSearchClick (event){
    event.preventDefault();
    const value = inputSearch.value;

    
  fetch(`https://api.jikan.moe/v4/anime?q=${value}`)
    .then(response => response.json())
    .then(data => {
        const series = data.data;
        seriesList = series;
        renderSeries(seriesList, containerAllSeries);
    
    }) 


}

searchButton.addEventListener("click", handleSearchClick);


  /*añadir a favoritos 

  Cuando la usuaria haga click en una serie, 
  - saber en cual ha hecho click
  - cambiar el color de fondo y el de la fuente
  - mostrar los fav en un listado en la parte izquierda de la pantalla
  
  
  */
   