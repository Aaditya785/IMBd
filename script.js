const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const main = document.getElementById("main");
const resultGrid = document.getElementById("result-grid");
const movies = document.getElementById("movies");
const favoriteMovie = document.getElementById("favoriteMovie");
const container = document.getElementById("Container");
const favContainer = document.getElementById("favContainer");
const navHome = document.getElementById("navSpanHome");

function displayMain() {
  favContainer.style.display = "none";
  main.style.display = "block";
}

async function displayFav() {
  favContainer.innerHTML = " ";
  for (const i in localStorage) {
    // console.log(i);
    let id = localStorage.getItem(i);
    console.log(id);
    // if(id !== null){}
    let URL = `https://www.omdbapi.com/?i=${id}&apikey=1613435a`;
    let res = await fetch(`${URL}`);
    let data = await res.json();
    

    if (id !== null) {
      // favContainer.innerHTML += `${id} </br> `;
      
      favContainer.innerHTML += ` 
    <img src="${data.Poster}" alt="movie">
  <p>
    <h3 class="h3"> ${data.Title} </h3> <br/>
    <h5 class="h5">Year: ${data.Year} </h5>  
    <h5 class="h5">Rating: ${data.imdbRating} </h5>
  </p>
    `;
    }
  }

  favContainer.style.backgroundColor = "#fff";
  favContainer.style.display = "flex";
}

function hideMain() {
  console.log("Main Element Hideed");
  main.style.display = "none";
}

const slidesID = [
  "tt12844910",
  "tt1745960",
  "tt11851548",
  "tt8041270",
  "tt1287845",
  "tt7349950",
  "tt6806448",
  "tt4154796",
  "tt1877830",
  "tt1431045",
  "tt6443346",
  "tt8108274",
  "tt8291224",
  "tt9052960",
  "tt7784604",
  "tt9114286",
  "tt10872600",
  "tt9389998",
  "tt5954088",
  "tt0800080",
  "tt15474916",
  "tt2752772",
  "tt10954652",
  "tt0070047",
  "tt1457767",
];

// -------------------> Search_List Logic
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

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
      <div class = "search-item-thumbnail">
          <img src = "${moviePoster}">
      </div>
      <div class = "search-item-info">
          <h3>${movies[idx].Title}</h3>
          <p>${movies[idx].Year}</p>
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
      navHome.classList.remove("hide-it");
      movieSearchBox.vaue = "";
      const result = await fetch(
        `https://omdbapi.com/?i=${movie.dataset.id}&apikey=1613435a`
      );
      const movieDetails = await result.json();

      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  console.log(details);
  resultGrid.innerHTML = `
  <div class = "movie-poster">
      <img src = "${
        details.Poster != "N/A" ? details.Poster : "image_not_found.png"
      }" alt = "movie poster">
  </div>
  <div class = "movie-info">
      <h3 class = "movie-title">${details.Title}</h3>
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
      <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
        details.Awards
      }</p>
  </div>
  `;
}
// -------------------> End of Search_List Logic

// -------------------> Random Movies (Landing Page)
var res = 0,
  error = 0;
let clicked = false;

async function loadMovie() {
  for (let i = 0; i <= slidesID.length; i++) {
    var id = slidesID[i];
    const URL = `https://www.omdbapi.com/?i=${id}&apikey=1613435a`;

    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (
      data.Response !== "False" &&
      data.Poster !== "N/A" &&
      data.Type == "movie"
    ) {
      // console.log( 'This is just Try', data);
      var div = document.createElement("div");

      div.classList.add("movie");

      div.innerHTML = ` 
            <img src="${data.Poster}" alt="movie">
  
  <button class="favorite" id="favorite" onMouseDown="setGetLocal('${id}')" onClick="addTofavorites()" >Add To Favorite</button>
          <p>
            <h3 class="h3"> ${data.Title} </h3> <br/>
            <h5 class="h5">Year: ${data.Year} </h5>  
            <h5 class="h5">Rating: ${data.imdbRating} </h5>
          </p>
            `;
      movies.appendChild(div);
    }
  }
}
loadMovie();
// -------------------> End of Random Movies

// -------------------> Hideing The nav element
function displayHome() {}
// ------------------->-------------------

// -------------------> Setting The LocalStorage Logic (Favorite)
function addTofavorites() {
  
  let favBtns = document.querySelectorAll(".favorite");
  
  for (let i = 0; i < favBtns.length; i++) {
    favBtns[i].addEventListener("click", (event) => {
      event.stopImmediatePropagation();
      alert("Added To Favorite");
      
      favBtns[i].setAttribute("disabled", "");
      favBtns[i].style.cursor = "not-allowed";
      
      
      //adding to favorite div
    });
  }
}

function setGetLocal(id){
  let key = Math.random().toString(36).slice(2, 7);
      let value = id;

      localStorage.setItem(key, value);
      console.log(localStorage.getItem(key));
}




async function loadFavoriteMovies() {
  navHome.classList.remove("hide-it");
}

// slides

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

function currentSlide(n) {
  showSlides((slideIndex = n));
}

setInterval(function () {
  changeSlides(1);
}, 3000);

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-it");
  }
});
