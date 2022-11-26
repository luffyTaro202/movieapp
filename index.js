const API_KEY = "api_key=1bfdbff05c2698dc917dd28c08d41096";
let upcoming =
  "https://api.themoviedb.org/3/movie/upcoming?api_key=1bfdbff05c2698dc917dd28c08d41096&language=en-US&page=";

const image = "http://image.tmdb.org/t/p/w500/";

const search_url =
  "https://api.themoviedb.org/3/search/movie?api_key=1bfdbff05c2698dc917dd28c08d41096&query=";

const noImage =
  "https://media.istockphoto.com/vectors/cinema-poster-with-cola-filmstrip-and-clapper-vector-vector-id1244034031?k=20&m=1244034031&s=612x612&w=0&h=WFpMBZ7PfLCJrK4F9764OsAls0NbOJOza8CIiP3Yfc8=";

const details_url = "https://api.themoviedb.org/3/movie/";

const similar_url = "https://api.themoviedb.org/3/movie/";

let pagenumber = "1";
const search = document.getElementById("search");
const form = document.getElementById("form");
const main = document.getElementById("main");
let movieId = sessionStorage.getItem("movieId");
const details_com = details_url + movieId + "?" + API_KEY;
const similar_container = document.getElementById("similar");
const details_container = document.getElementById("details");
const upcomingCheck = "true";

// DECLARE DETAILS_VALUE ONLOAD

sessionStorage.getItem("details_value")
  ? ""
  : sessionStorage.setItem("details_value", false);

sessionStorage.getItem("previous_page")
  ? ""
  : sessionStorage.setItem("previous_page", upcoming + "1");

// iftrue upcoming
if (sessionStorage.getItem("details_value") != upcomingCheck) {
  console.log("UPCOMING");

  // IF PREVIOUS PAGE IS NULL GO TO PAGE 1 ELSE NOT
  getmovie(
    sessionStorage.getItem("previous_page")
      ? sessionStorage.getItem("previous_page")
      : upcoming + pagenumber
  );
} else {
  console.log("DETAILS");
  console.log(
    similar_url +
    movieId +
    "/similar?api_key=1bfdbff05c2698dc917dd28c08d41096&language=en-US&page=" +
    pagenumber
  );
  getDetails(details_com);
  getSimilar(
    similar_url +
    movieId +
    "/similar?api_key=1bfdbff05c2698dc917dd28c08d41096&language=en-US&page=" +
    pagenumber
  );
}

// GET DATA
// UPCOMING/ HOME
async function getmovie(url) {
  const { data } = await axios(url);
  showmovie(data.results);
}
// DETAILS
async function getDetails(url) {
  const { data } = await axios(url);
  pakita(data);
}

// SIMILAR
async function getSimilar(url) {
  const { data } = await axios(url);
  var pages = data.total_pages;
  similar(data.results);
}

// SHOWMOVIE

function showmovie(data) {
  // if (!main) {
  //   console.log("walang main//error");
  //   return;
  // }

  main.innerHTML = "";
  data.forEach((movie) => {
    // ES6-- pulling the value of the object and putting it in the variable movie
    const { title, poster_path, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <img src="${poster_path ? image + poster_path : noImage}" alt="" />
    <a id='movieId' onclick="showDetails(${id});">${title}</a>

    `;
    main.appendChild(movieEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;

  if (searchTerm.trim()) {
    getmovie(search_url + searchTerm);
    sessionStorage.setItem("previous_page", search_url + searchTerm);
  }
});

// DETAILS

function pakita(data) {
  // TRY CATCH WHEN NO VALUES
  try {
    country = data.production_countries[0].name;
    companies = data.production_companies[0].name;
  } catch (err) {
    country = "N/A";
    companies = "N/A";
  }
  // GENRE HOLDER
  let genre = "";

  // FOR LOOP FOR GENRES
  data.genres.forEach(genreSort);

  function genreSort(item) {
    genre += item.name + " ";
  }

  details_container.innerHTML = "";
  const movieEl = document.createElement("main");
  movieEl.classList.add("details");
  movieEl.innerHTML = `


      <div class="photo">
        <img src="${data.poster_path
      ? image + data.poster_path
      : "https://media.istockphoto.com/vectors/cinema-poster-with-cola-filmstrip-and-clapper-vector-vector-id1244034031?k=20&m=1244034031&s=612x612&w=0&h=WFpMBZ7PfLCJrK4F9764OsAls0NbOJOza8CIiP3Yfc8="
    }" alt="" />
      </div>

      <div class="details">
        <h1 class="title">${data.title}</h1>
        <ul>
          <li class="date">${data.release_date}</li> |
          <li class="duration">${data.runtime ? data.runtime : "N/A"} mins</li>
        </ul>

        <div class="more">
          <div class="buttons">
            <button>Watch Now</button><button>Trailer</button
            ><button>Share</button>
          </div>

          <p class="summary">
            ${data.overview}
          </p>

          <div class="bottom">
            <p>COUNTRY<span class="director">${country}</span></p>
            <p>RATINGS<span class="written">${data.vote_average == 0 ? "N/A" : data.vote_average
    }</span></p>
            <p>STUDIO<span class="release">${companies}</span></p>
            <p>GENRE<span class="genre">${genre}</span></p>
          </div>
        </div>
      </div> `;

  details_container.appendChild(movieEl);
}

// SIMILAR

function similar(data) {
  similar_container.innerHTML = "";
  // IF DATA IS NULL DISPLAY NO THEN RETURN
  if (data == "") {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
  <h1>No Similar Movies Found</h1>
  `;
    similar_container.appendChild(movieEl);
    return;
  }

  data.forEach((movie) => {
    const { title, poster_path, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <img src="${poster_path ? image + poster_path : noImage}" alt="" />
    <a id='movieId' onclick="showDetails(${id});">${title}</a>
    `;

    similar_container.appendChild(movieEl);
  });
}

// DETAILS FUNCTION WHEN CLICK

function showDetails(id) {
  sessionStorage.setItem("movieId", id);
  sessionStorage.setItem("details_value", true);
  window.location = "details.html";
}
// LOGOCLICK BACK TO HOME
function home() {
  sessionStorage.setItem("details_value", false);
  sessionStorage.setItem("previous_page", upcoming + "1");
}

function back() {
  sessionStorage.setItem("details_value", false);
  window.location = "index.html";
}

// PAGINATION

var pagePagination = {
  code: "",
  Extend: function (data) {
    data = data || {};
    pagePagination.size = data.size || 300;
    pagePagination.page = data.page || 1;
    pagePagination.step = data.step || 3;
  },
  Add: function (p, q) {
    for (var l = p; l < q; l++) {
      pagePagination.code += "<a>" + l + "</a>";
    }
  },
  Last: function () {
    pagePagination.code += "<i>...</i><a>" + pagePagination.size + "</a>";
  },
  First: function () {
    pagePagination.code += "<a>1</a><i>...</i>";
  },
  Click: function () {
    pagePagination.page = +this.innerHTML;
    pagePagination.Start();
    // IF IT'S UPCOOMING ELSE GO DETAILS

    if (sessionStorage.getItem("details_value") != upcomingCheck) {
      console.log("indexpage");
      getmovie(upcoming + pagePagination.page);
      sessionStorage.setItem("previous_page", upcoming + pagePagination.page);
    } else {
      console.log("DETAILS");

      getDetails(details_com);
      getSimilar(
        similar_url +
        movieId +
        "/similar?api_key=1bfdbff05c2698dc917dd28c08d41096&language=en-US&page=" +
        pagenumber
      );
    }
  },
  Prev: function () {
    pagePagination.page--;
    if (pagePagination.page < 1) {
      pagePagination.page = 1;
    }
    pagePagination.Start();
    getmovie(upcoming + pagePagination.page);
    sessionStorage.setItem("previous_page", upcoming + pagePagination.page);
  },
  Next: function () {
    pagePagination.page++;
    if (pagePagination.page > pagePagination.size) {
      pagePagination.page = pagePagination.size;
    }
    pagePagination.Start();
    getmovie(upcoming + pagePagination.page);
    sessionStorage.setItem("previous_page", upcoming + pagePagination.page);
  },
  Bind: function () {
    // PAGE CLICK
    // active checker for class and id
    var a = pagePagination.e.getElementsByTagName("a");

    //text slice for the in the previous page
    var previous_number = sessionStorage
      .getItem("previous_page")
      .slice(105, sessionStorage.getItem("previous_page").length);
    for (var num = 0; num < a.length; num++) {
      if (+a[num].innerHTML === pagePagination.page) {
        console.log(parseInt(previous_number) + " " + a[num].innerHTML);
        a[num].className = "current";
        a[num].setAttribute("id", "current");
        pagenumber = document.getElementById("current").innerHTML;
      }
      a[num].addEventListener("click", pagePagination.Click, false);
    }
  },
  Finish: function () {
    pagePagination.e.innerHTML = pagePagination.code;
    pagePagination.code = "";
    pagePagination.Bind();
  },
  Start: function () {
    if (pagePagination.size < pagePagination.step * 2 + 6) {
      pagePagination.Add(1, pagePagination.size + 1);
    } else if (pagePagination.page < pagePagination.step * 2 + 1) {
      pagePagination.Add(1, pagePagination.step * 2 + 4);
      pagePagination.Last();
    } else if (
      pagePagination.page >
      pagePagination.size - pagePagination.step * 2
    ) {
      pagePagination.First();
      pagePagination.Add(
        pagePagination.size - pagePagination.step * 2 - 2,
        pagePagination.size + 1
      );
    } else {
      pagePagination.First();
      pagePagination.Add(
        pagePagination.page - pagePagination.step,
        pagePagination.page + pagePagination.step + 1
      );
      pagePagination.Last();
    }
    pagePagination.Finish();
  },
  Buttons: function (e) {
    var nav = e.getElementsByTagName("a");
    nav[0].addEventListener("click", pagePagination.Prev, false);
    nav[1].addEventListener("click", pagePagination.Next, false);
  },
  Create: function (e) {
    var html = [
      "<a>◄</a>", // previous button
      "<span></span>", // paginationID container
      "<a>►</a>", // next button
    ];
    e.innerHTML = html.join("");
    pagePagination.e = e.getElementsByTagName("span")[0];
    pagePagination.Buttons(e);
  },
  Init: function (e, data) {
    pagePagination.Extend(data);
    pagePagination.Create(e);
    pagePagination.Start();
  },
};

var init = function () {
  pagePagination.Init(document.getElementById("paginationID"), {
    size: sessionStorage.getItem("details_value") == "false" ? 19 : 500,
    page: 1,
    step: 3,
  });
};

document.addEventListener("DOMContentLoaded", init, false);
