"use strict";

const searchButton = document.querySelector(".js-searchButton");
const inputSearch = document.querySelector(".js-inputSearch");
const containerAllSeries = document.querySelector(".js-containerSeries");
let seriesList = [];
let image;
const placeholder =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
const notImage =
  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
let favoriteSeries = [];
const containerFavoriteSeries = document.querySelector(
  ".js-containerFavoriteSeries"
);
const titleResults = document.querySelector(".js-titleResults");
const titleFavorite = document.querySelector(".js-titleFav");
const seriesFavLocalSotrage = JSON.parse(localStorage.getItem("listFavSeries"));
const message = document.querySelector(".js-message");
const resetButton = document.querySelector(".js-resetButton");
const form = document.querySelector(".js-form");

if (seriesFavLocalSotrage) {
  titleFavorite.classList.remove("hidden");
  containerFavoriteSeries.classList.remove("hidden");
  favoriteSeries = seriesFavLocalSotrage;
  renderSeries(seriesFavLocalSotrage, containerFavoriteSeries, true);
}

function renderSeries(series, container, isFavorite) {
  container.innerHTML = "";

  for (const serie of series) {
    if (serie.images.jpg.image_url === notImage) {
      image = placeholder;
    } else {
      image = serie.images.jpg.image_url;
    }

    container.innerHTML += `
        <div class= "series 
        ${
          isFavorite ? "js-containerOneFavSerie" : "js-containerOneSerie"
        } " id="${serie.mal_id}" >
            <img class="img" src="${image}" alt="$${serie.title}"> 
            <h3 class="title__series">${serie.title}</h3> 
            ${
              isFavorite
                ? `<button id="${serie.mal_id}" class="close__button js-closeButton">X</button>`
                : ""
            }
        </div>
      `;
  }

  const containersOneSerie = document.querySelectorAll(".js-containerOneSerie");
  for (const containeroneSerie of containersOneSerie) {
    containeroneSerie.addEventListener("click", handleClickFavorite);
  }

  const closeButtons = document.querySelectorAll(".js-closeButton");
  for (const closeButton of closeButtons) {
    closeButton.addEventListener("click", handleClickClose);
  }
}

function handleClickFavorite(event) {
  const clickFavorite = event.currentTarget;
  clickFavorite.classList.add("colorFav");
  titleFavorite.classList.remove("hidden");
  containerFavoriteSeries.classList.remove("hidden");

  const idClickFavorite = parseInt(event.currentTarget.id);

  const serieSelected = seriesList.find((serie) => {
    return idClickFavorite === serie.mal_id;
  });

  const indexSerieFavorites = favoriteSeries.findIndex((favoriteSerie) => {
    return idClickFavorite === favoriteSerie.mal_id;
  });

  //si no existe como favorita, añado serie
  if (indexSerieFavorites === -1) {
    favoriteSeries.push(serieSelected);
    renderSeries(favoriteSeries, containerFavoriteSeries, true);
    localStorage.setItem("listFavSeries", JSON.stringify(favoriteSeries));
  }
}
function handleClickClose(event) {
  const idSerieToRemove = parseInt(event.target.id);

  const IndexFavSerie = favoriteSeries.findIndex((favSerie) => {
    return idSerieToRemove === favSerie.mal_id;
  });

  favoriteSeries.splice(IndexFavSerie, 1);
  if (favoriteSeries.length === 0) {
    titleFavorite.classList.add("hidden");
    containerFavoriteSeries.classList.add("hidden");
    localStorage.removeItem("listFavSeries");
  } else {
    localStorage.setItem("listFavSeries", JSON.stringify(favoriteSeries));
  }

  renderSeries(favoriteSeries, containerFavoriteSeries, true);
  const containerSerieResults = document.getElementById(idSerieToRemove);
  containerSerieResults.classList.remove("colorFav");
}

function handleSearchClick(event) {
  event.preventDefault();
  const value = inputSearch.value;
  message.innerHTML = "";

  if (!value) {
    message.innerHTML = `
        <h3> Por favor, introduce una serie de anime </h3>`;
  } else {
    fetch(`https://api.jikan.moe/v4/anime?q=${value}`)
      .then((response) => response.json())
      .then((data) => {
        const series = data.data;

        if (series.length === 0) {
          containerAllSeries.classList.add("hidden");
          titleResults.classList.add("hidden");
          message.innerHTML = `<h3>No se encontraron series. Por favor, introduce un nombre válido de anime</h3>`;
          return;
        }

        seriesList = series;
        renderSeries(seriesList, containerAllSeries, false);
      })
      .catch((error) => {
        console.error("Error fetching anime:", error);
        message.innerHTML = `<h3>Error al buscar series. Por favor, intenta de nuevo más tarde.</h3>`;
      });

    titleResults.classList.remove("hidden");
    containerAllSeries.classList.remove("hidden");
  }
}
searchButton.addEventListener("click", handleSearchClick);

function handleClickReset(event) {
  event.preventDefault();
  titleResults.classList.add("hidden");
  containerAllSeries.classList.add("hidden");
  titleFavorite.classList.add("hidden");
  containerFavoriteSeries.classList.add("hidden");
  form.reset();
  localStorage.clear();
  message.innerHTML = "";
}

resetButton.addEventListener("click", handleClickReset);
