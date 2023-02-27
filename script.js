const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const main = document.getElementById("main");
const resultFlex = document.getElementById("result-flex");
const movies = document.getElementById("movies");
const favoriteMovie = document.getElementById("favoriteMovie");
const container = document.getElementById("Container");
const favContainer = document.getElementById("favContainer");

const slidesID = [ "tt12844910","tt1745960","tt11851548","tt8041270","tt1287845","tt7349950","tt6806448","tt4154796","tt1877830","tt1431045","tt6443346","tt8108274","tt8291224","tt9052960","tt7784604","tt9114286","tt10872600","tt9389998","tt5954088","tt0800080","tt15474916","tt2752772","tt10954652","tt0070047","tt1457767",];

// navBar Items started
function displayMain() {
  favContainer.style.display = "none";
  container.innerHTML = " ";
  window.location.reload('main');
}

async function displayFav() {
  favContainer.innerHTML = " ";
  favContainer.innerHTML = `
  <button id="removeFav" onClick="removeFav()" >Clear Favorites</button>
  `;
  
  var IDd = new Set();
  for (const i in localStorage) 
  {
    IDd.add(localStorage.getItem(i));
  }

  for (const i of IDd.values()) 
  {
    if (i !== null) {

      let URL = `https://www.omdbapi.com/?i=${i}&apikey=1613435a`;
      let res = await fetch(`${URL}`);
      let data = await res.json();

          let div = document.createElement("div");
          div.classList.add("movie");
          div.innerHTML = ` 
    <img src="${data.Poster}" alt="movie">
  <p>
    <hr/><h3 class="h3"> ${data.Title} </h3> <hr/>   
    <h5 class="h5">Year: ${data.Year} </h5>  
    <h5 class="h5">Rating: ${data.imdbRating} </h5>
  </p>
    `;
          favContainer.appendChild(div);
      }
  }
}

function removeFav(){
  localStorage.clear();
  window.location.reload();
}

function hideMain() {
  main.style.display = "none";
  favContainer.style.display = "flex";
  resultFlex.style.display = "none";
  displayFav();
}
// end of navBar Items

//  Startin of Search_List Logic
function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-it");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-it");
  }
}

async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=1613435a`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function displayMovieList(movies_list) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies_list.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies_list[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies_list[idx].Poster != "N/A") moviePoster = movies_list[idx].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
      <div class = "search-item-thumbnail">
          <img src = "${moviePoster}">
      </div>
      <div class = "search-item-info">
          <h3>${movies_list[idx].Title}</h3>
          <p>${movies_list[idx].Year}</p>
      </div>
      `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

async function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-it");
      main.classList.add("hide-it");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://omdbapi.com/?i=${movie.dataset.id}&apikey=1613435a`
      );
      const movieDetails = await result.json();

      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultFlex.innerHTML = `
  <div class = "movie-poster">
      <img src = "${
        details.Poster != "N/A" ? details.Poster : "image_not_found.png"
      }" alt = "movie poster">
  </div>
  <button style="width: 200px; height: 25px; transition: all 0.3s ease-in-out;
  " class="favorite" id="favorite" onClick="setGetLocal('${details.imdbID}')"  >Add To Favorite</button>
  <div class = "movie-info">
  <hr/><h3 class = "movie-title">${details.Title}</h3><hr/>
      <ul class = "movie-misc-info">
          <li class = "year">Year: ${details.Year}</li>
          <li class = "rated">Ratings: ${details.Rated}</li>
          <li class = "released">Released: ${details.Released}</li>
      </ul>
      <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
      <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
      <p class = "actors"><b>Actors: </b>${details.Actors}</p>
      <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
      <p class = "language"><b>Language:</b> ${details.Language}</p>
      <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
  </div>
  `;
}
//  End of Search_List Logic

//  Random Movies (Landing Page)
async function loadMovie() {
  for (let i = 0; i <= slidesID.length; i++) 
  {
    var id = slidesID[i];
    const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=1613435a`);
    const data = await res.json();
    if ( data.Response !== "False" && data.Poster !== "N/A" && data.Type == "movie")
    {
      var div = document.createElement("div");
      div.dataset.id = data.imdbID; // setting movie id in  data-id
      div.classList.add("movie");
      div.classList.add("movie-brief-display");
      div.setAttribute("onclick", "displaymovie(dataset.id)");
      
      div.innerHTML = ` 
      <img src="${data.Poster}" alt="movie">
      <p>
      <hr/><h3 class="h3"> ${data.Title} </h3>  <hr/>
      <h5 class="h5">Year: ${data.Year} </h5>  
      <h5 class="h5">Rating: ${data.imdbRating} </h5>
      </p>
      `;
      movies.appendChild(div);
    }
  }
}
loadMovie();

async function displaymovie(res){
  main.classList.add("hide-it");
  const result1 = await fetch(`https://omdbapi.com/?i=${res}&apikey=1613435a`);
  const movieDetails = await result1.json();
  displayMovieDetails(movieDetails);
}
//  End of Random Movies


//  Setting The LocalStorage Logic (Favorite)
function addTofavorites() {
  let favBtns = document.querySelector(".favorite");
  favBtns.setAttribute("disabled", "");
  favBtns.style.cursor = "not-allowed";
}

function setGetLocal(id){
      localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
      addTofavorites();
}

// Carousel Slide

let slideIndex = 1;
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("allSlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].className = slides[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].className += " active";
}

showSlides(slideIndex);

function changeSlides(n) {
  showSlides((slideIndex += n));
}

setInterval(function () {
  changeSlides(1);
}, 3000);

// On Click outside the element hide - it
window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-it");
  }
});
