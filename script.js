const movieSearchBar = document.querySelector("#searchbar");
const homepage = document.getElementsByClassName("homepage")[0];
const movieDetails = document.getElementsByClassName("movie-details")[0];
const favPage = document.getElementsByClassName("fav-page")[0];
const homepageTitle = document.getElementsByClassName("home-page")[0];
const favourite = document.getElementsByClassName("favourite")[0];
const favList = document.getElementsByClassName("fav-list")[0];
let searchBar = document.getElementById("searchbar");
let list = document.getElementById("search-list");
let favCard = document.getElementsByClassName("fav-card")[0];
let favouriteList = [];
let filmList;

// Input keystroke event listener

movieSearchBar.addEventListener("keyup", () => {
  let searchString = searchBar.value;
  if (searchString == "") {
    list.innerHTML = "";
  } else {
    getMovies(searchString);
  }
});

// Searching the input by making API call

async function getMovies(searchString) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${searchString.trim()}&apikey=4e039f0b`
    );
    let data = await response.json();
    renderMovies(data.Search);
  } catch (error) {
    console.error(error);
  }
}

async function getMovieDetails(movieID) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${movieID.trim()}&apikey=b6bf5319`
    );
    let data = await response.json();
    renderMovieDetails(data);
  } catch (error) {
    console.error(error);
  }
}

// Populating the search results in list

function renderMovies(movieList) {
  filmList = movieList;
  if (movieList) {
    list.innerHTML = "";
    for (let i = 0; i < movieList.length; ++i) {
      const serializedObj = localStorage.getItem(movieList[i].imdbID);
      const obj = JSON.parse(serializedObj);

      if (serializedObj) {
        console.log(obj);
        let li = document.createElement("li");
        li.classList.add("movie-list-item");
        li.setAttribute("data-id", obj[0].imdbID);
        li.innerHTML = `
                <div>
                <div class="list-image-holder">
                    <img src="${obj[0].Poster}" alt="">
                </div>
                <div class="movie-info">
                    <spam><b>${obj[0].Title}</b></span>
                    <span>${obj[0].Year}</span>
                </div>
                    </div>
                        <span class="like" data-id="${obj[0].imdbID}"><i class="fa-solid fa-heart" style="color: #f8f9fa;"></i></span>`;
        list.appendChild(li);
      } else {
        let li = document.createElement("li");
        li.classList.add("movie-list-item");
        li.setAttribute("data-id", movieList[i].imdbID);
        li.innerHTML = `
            <div>
                <div class="list-image-holder">
                    <img src="${movieList[i].Poster}" alt="">
                </div>
                <div class="movie-info">
                    <spam><b>${movieList[i].Title}</b></span>
                    <span>${movieList[i].Year}</span>
                </div>
            </div>
            <span class="like" data-id="${movieList[i].imdbID}"><i class="fa-regular fa-heart fa-lg"></i></span>`;
        list.appendChild(li);
      }
    }
  } else {
    list.innerHTML = "";
    let li = document.createElement("li");
    li.classList.add("no-result");
    li.innerHTML = `<h2>No Result found</h2>`;
    list.appendChild(li);
  }
}

// Populating the movie details page

function renderMovieDetails(movie) {
  homepage.classList.add("hide");
  movieDetails.innerHTML = `
    <div class="movie-details-wrapper">
    <div>
        <h1 class="movie-style" style="text-shadow: 4px 4px 2px #909294;">${movie.Title}</h1>
        <div class="movie-date"><span>${movie.Year}</span>&nbsp;<span>&#183;</span>&nbsp;<span>${movie.Rated}</span>&nbsp;<span>&#183;</span>&nbsp;<span>${movie.Runtime}</span></div>
    </div>

    <div>
        <p class="imdb-rating-title">IMDb RATING</p>
        <div class="rating">
            <div><i class="fa-solid fa-star fa-xl"></i></div>
            <div><span class="rating-number"><b>${movie.imdbRating}</b></span><span class="rating-number-dino">/10</span></div>
        </div>
    </div>

</div>

<div class="movie-poster">
    <img src="${movie.Poster}" alt="">
    <div class="movie-poster-details">
        <div class="genre"></div>
        <div class="movie-bio">${movie.Plot}</div>
        <hr>
        <div class="movie-bio"><span><b>Director</b></span><span class="color-blue">${movie.Director}</span></div>
        <hr>
        <div class="movie-bio"><span><b>Writers</b></span><span class="color-blue">${movie.Writer}</span></div>
        <hr>
        <div class="movie-bio"><span><b>Stars</b></span><span class="color-blue">${movie.Actors}</span></div>
    </div>
</div>
</div>
    `;

  let genre = movie.Genre.split(",");
  let genreDiv = document.getElementsByClassName("genre")[0];

  for (let i = 0; i < genre.length; i++) {
    let span = document.createElement("span");
    span.innerText = genre[i];
    genreDiv.appendChild(span);
  }

  movieDetails.classList.remove("hide");
}

// Populating the favourite page

function renderFavouritePage() {
  let favDiv = document.getElementsByClassName("fav-list")[0];

  favList.innerHTML = "";

  for (let i = 0; i < favouriteList.length; i++) {
    let div = document.createElement("div");
    div.classList.add("fav-card");
    div.setAttribute("data-id", favouriteList[i][0].imdbID);
    div.innerHTML = `
                    <div class="fav-poster">
                        <img src="${favouriteList[i][0].Poster}" alt="">
                        <div class="dislike" data-id="${favouriteList[i][0].imdbID}"><i class="fa-solid fa-thumbs-down fa-2xl" style="color: #f8f9fa;"></i></div>
                    </div>
                <div class="card-text"><span class="color-lightgrey">${favouriteList[i][0].Year}</span></div>
            <p class="card-text extra-padding">${favouriteList[i][0].Title}</p>
        `;
    favDiv.appendChild(div);
  }

  favourite.classList.remove("hide");
}

// Adding items to favourite list

function addToFavourite(id) {
  let likesList = document.getElementsByClassName("like");
  let like;
  for (let i = 0; i < likesList.length; i++) {
    if (likesList[i].dataset.id === id) {
      like = likesList[i];
      break;
    }
  }

  like.innerHTML = "";

  const serializedFavMovie = localStorage.getItem(id);

  if (serializedFavMovie) {
    favouriteList = favouriteList.filter((film) => {
      return film[0].imdbID != id;
    });

    localStorage.removeItem(id);

    like.innerHTML = `<i class="fa-regular fa-heart fa-lg"></i>`;

    Toastify({
      text: "Removed from favourites!",
      duration: 2000,
      className: "info",
      position: "center",
      style: {
        background: "linear-gradient(to right, #909294, #595c5f)",
      },
    }).showToast();
  } else {
    let newFavMovie = filmList.filter((film) => {
      return film.imdbID == id;
    });

    const serializedNewFavMovie = JSON.stringify(newFavMovie);
    localStorage.setItem(id, serializedNewFavMovie);

    favouriteList.push(newFavMovie);
    like.innerHTML = `<i class="fa-solid fa-heart" style="color: #f8f9fa;"></i>`;
    Toastify({
      text: "Added to favourites!",
      duration: 2000,
      className: "info",
      position: "center",
      style: {
        background: "linear-gradient(to right, #909294, #595c5f)",
      },
    }).showToast();
  }
}

// Remove from favourite list

function removeToFavourite(id) {
  favouriteList = favouriteList.filter((film) => {
    return film[0].imdbID != id;
  });

  localStorage.removeItem(id);
  Toastify({
    text: "Removed from favourites!",
    duration: 2000,
    className: "info",
    position: "center",
    style: {
      background: "linear-gradient(to right, #f8f9fa, #f6c800)",
    },
  }).showToast();
}

// Tracking mouse clicks and handling functions

function handleClickListner(e) {
  const target = e.target;
  let dataId;
  if (target.closest("[data-id]")) {
    dataId = target.closest("[data-id]");
  }

  if (target.parentElement.className === "like") {
    const taskid = target.parentElement.dataset.id;
    addToFavourite(taskid);
  } else if (target.className === "fav-page") {
    homepageTitle.style.color = "#f8f9fa";
    favPage.style.color = "#f6c800";
    homepage.classList.add("hide");
    searchBar.value = "";
    list.innerHTML = "";
    movieDetails.classList.add("hide");
    favourite.classList.remove("hide");
    renderFavouritePage();
  } else if (target.className === "home-page") {
    favPage.style.color = "#f8f9fa";
    homepageTitle.style.color = "#f6c800";
    movieDetails.classList.add("hide");
    favourite.classList.add("hide");
    homepage.classList.remove("hide");
  } else if (dataId) {
    if (dataId.className === "fav-card") {
      const taskid = dataId.dataset.id;
      favourite.classList.add("hide");
      favPage.style.color = "#f8f9fa";
      getMovieDetails(taskid);
    } else if (dataId.className === "movie-list-item") {
      const taskid = dataId.dataset.id;
      homepageTitle.style.color = "#f8f9fa";
      getMovieDetails(taskid);
    } else if (dataId.className === "dislike") {
      const taskid = dataId.dataset.id;
      removeToFavourite(taskid);
      renderFavouritePage();
    }
  } else if (target.tagName !== "INPUT") {
    list.innerHTML = "";
  }
}

// When Page is loaded

window.onload = () => {
  // Setting event listener to the entire document

  document.addEventListener("click", handleClickListner);
  searchBar.value = "";
  homepageTitle.style.color = "#f6c800";

  // Getting items from local storage

  let serializedObj = localStorage.getItem("favouriteList");
  let obj = JSON.parse(serializedObj);

  if (obj) {
    for (let i = 0; i < obj.length; i++) {
      favouriteList.push(obj[i]);
    }
  }
};

window.addEventListener("beforeunload", () => {
  let serializedfavouriteList = JSON.stringify(favouriteList);
  localStorage.setItem("favouriteList", serializedfavouriteList);
});
