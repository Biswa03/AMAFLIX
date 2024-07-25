import {api_key} from './apiKey.js';
import {youtube_apiKey} from './apiKey.js';

// const api_key = process.env.api_key;
// const youtube_apiKey = process.env.youtube_apiKey;

const base_url='https://api.themoviedb.org/3';
const api_url=base_url+'/discover/movie?sort_by=popularity.desc&api_key='+api_key;
const img_url='https://image.tmdb.org/t/p/w500';

const genres=[{"id": 28,"name": "Action"},
	{"id": 12,"name": "Adventure"},
	{"id": 16,"name": "Animation"},
	{"id": 35,"name": "Comedy"},
	{"id": 80,"name": "Crime"},
	{"id": 99,"name": "Documentary"},
	{"id": 18,"name": "Drama"},
	{"id": 10751,"name": "Family"},
	{"id": 14,"name": "Fantasy"},
	{"id": 36,"name": "History"},
	{"id": 27,"name": "Horror"},
	{"id": 10402,"name": "Music"},
	{"id": 9648,"name": "Mystery"},
	{"id": 10749,"name": "Romance"},
	{"id": 878,"name": "Science Fiction"},
	{"id": 10770,"name": "TV Movie"},
	{"id": 53,"name": "Thriller"},
	{"id": 10752,"name": "War"},
	{"id": 37,"name": "Western"}
];
let genreIds = [];


$('#search-btn').click(function () {
	var Q=$("#query").val();

	searchMovie(Q)
})
$("#query").keypress(function(event) {
	var Q=$("#query").val();

    if (event.key === "Enter") {
		searchMovie(Q)
    }
});

function searchMovie(Q){
	console.log(Q);
	window.location.href ="indexSearchResults.html?name="+Q;
}


var movieName='null';


$('.movi').click(function () {

  onload(movieName);
})

/*
SEARCH BY POPULARITY

PAGE SCROLLING TRANSITION */
const observer= new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if (entry.isIntersectiong){
      entry.target.classList.add('.show');
    }
    else{
      entry.target.classList.remove('.show');
    }
  });
});

const hiddenElements =document.querySelectorAll('.hidden');
hiddenElements.forEach((el)=> observer.observe(el));

/**..................................MOVIES........................................................ */

var urlParams = new URLSearchParams(window.location.search) //getting name from link

var movie_name = urlParams.get('name') ;
var movie_id=0;
var genre_id = 0;
function onLoad(movie_name){
  $.getJSON(`${base_url}/search/movie?api_key=${api_key}&query=${movie_name}`, function (data) {
   console.log(data)
    /*--------------------------------FOR MAIN PAGE CEREDTIALS----------------------------------------------------*/
    $('#title').html(data.results[0].title);
    $('#log-line').html(data.results[0].overview);
    $('#rating').html(data.results[0].vote_average.toFixed(1));
    $('.year').html(data.results[0].release_date.substring(0,4));
    $("#movie-poster").attr("src", `${img_url}${data.results[0].poster_path}`);
    console.log(data.results);

    var imageUrl = "https://image.tmdb.org/t/p/original/"+ data.results[0].backdrop_path;
    $('.main').css('background-image', 'url(' + imageUrl + ')');

    movie_id = data.results[0].id;

    /*--------------------------------FOR genre CEREDTIALS----------------------------------------------------*/
    findGenre(data.results[0].genre_ids);

    function findGenre(data) {
      let genreNames = [];
  
      data.forEach(jonra => {
          genres.forEach(elem => {
              if (jonra == elem.id) {
                genreNames.push(elem.name);
                genreIds.push(elem.id);
                genre_id=elem.id;
              }
          });
      });
  
      // Genre element with the accumulated genre names
      $('#genre').html(genreNames.join(', '));
  }
    /*--------------------------------FOR CAST  RIGHT CONTAINER---------------------------------------------------*/

    const cast_crew = document.getElementById('right-cont');
    var crew_api = `${base_url}/movie/${movie_id}/credits?api_key=${api_key}`;

    getMovies(crew_api);

    function getMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showMovies(data.cast);
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    }

    function showMovies(data) {
      cast_crew.innerHTML = '';

      data.forEach((movie) => {
        const {original_name, profile_path,character} = movie;
    
        const movieEl = document.createElement('div');
        movieEl.classList.add('cast-crew'); 

        movieEl.innerHTML = `
          <img class="cast-crew-img" src="${img_url}${profile_path}" alt="${original_name}">
          <div class="c-c-name-character">
            <p class="cast-crew-name">${original_name}</p>
            <p class="cast-crew-character">${character}</p>
          </div>
        `;
        cast_crew.appendChild(movieEl);
      });
    }

    /*-------------------------------  YouTube Data API request   --------------------------------------------------*/

    
$('.watch').click(function () {
  searchTrailer();
})

  function searchTrailer() {
    const moviName=data.results[0].title;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?q=${moviName} trailer&part=snippet&key=${youtube_apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const videoId = data.items[0].id.videoId;
        const trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Redirect to the trailer URL in SAME tab
        // window.location.href = trailerUrl;

        // Redirect to the trailer URL in NEW tab
         window.open(trailerUrl, '_blank');

        
       })

      .catch(error => console.error('Error:', error));
  }


    /*--------------------------------FOR SIMILAR MOVIES----------------------------------------------------*/
    const similar = document.querySelector(".carousel-area");
    const genresQueryParam = genreIds.join(',');

    const similar_api = `${base_url}/discover/movie?api_key=${api_key}&with_genres=${genresQueryParam}`;
    console.log(similar_api)
    getSimilarMovies(similar_api);

    function getSimilarMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showSimilarMovies(data.results);
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    }

    function showSimilarMovies(data) {
      similar.innerHTML = '';

      data.forEach(movie=> {
        const {title, poster_path, release_date,vote_average} = movie;
        movieName=title;
        const movieEl = document.createElement("a");
        movieEl.href="indexMoviePage.html?name="+title;
        movieEl.classList.add('movi'); 

        movieEl.innerHTML = `
          <img src="${img_url+poster_path}" alt="${title}">
          <div class="title-box">
            <h5>${title}</h5>
            <p>${release_date.substring(0, 4)}</p>
          </div>
          <div class="rating-box">
             <div class="HD">HD</div>
             <div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>  
          </div>
        `;
        similar.appendChild(movieEl);
      });
    }

    /*........................................  SEARCH BOX  ................................ */
    
    const find_url=base_url+'/search/movie?api_key='+api_key+'&query='+query;
    const findMovie = document.querySelector(".search");

    getttMovies(find_url);

    function getttMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showwwMovies(data.results);
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    }

    function showwwMovies(data) {
      findMovie.innerHTML = '';

      data.forEach((movie) => {
        const {title, poster_path,vote_average} = movie;

        const movieLink = document.createElement("a");
        movieLink.href = `index.html`;
        movieLink.classList.add('card');

        movieLink.innerHTML = `
          <img src="${img_url}${poster_path}" alt="${title}">
          <div class="cont">
            <h3>${title}</h3>
            <p>Action, 2021,<span>IMDB</span><i class="fa-solid fa-star"></i>${vote_average}</p>
          </div>
        `;
       
        findMovie.appendChild(movieLink);
      })
    }     



  })
}
onLoad(movie_name)

/**..................................TV SHOWS......................................................... */

var urlParams = new URLSearchParams(window.location.search) 

var show_name = urlParams.get('showName') ;
var show_id=0;
function onLoadShows(movie_name){
  $.getJSON(`${base_url}/search/tv?api_key=${api_key}&query=${show_name}`, function (data) {

   console.log(data)
    /*--------------------------------FOR MAIN PAGE CEREDTIALS----------------------------------------------------*/
    $('#title').html(data.results[0].name);
    $('#log-line').html(data.results[0].overview);
    $('#rating').html(data.results[0].vote_average);
    $('.year').html(data.results[0].first_air_date);
    $("#movie-poster").attr("src", `${img_url}${data.results[0].poster_path}`);
    console.log(data.results);

    var imageUrl = "https://image.tmdb.org/t/p/original/"+ data.results[0].backdrop_path;
    $('.main').css('background-image', 'url(' + imageUrl + ')');

    show_id = data.results[0].id;

    /*--------------------------------FOR genre CEREDTIALS----------------------------------------------------*/
    findGenre(data.results[0].genre_ids);

    function findGenre(data){
      data.forEach(jonra=>{
        genres.forEach(elem=>{
          if(jonra==elem.id){
            $('#genre').html(elem.name);
            genre_id=elem.id;
          }
         })
      })
    }
    
    /*--------------------------------FOR CAST  RIGHT CONTAINER---------------------------------------------------*/

    const cast_crew = document.getElementById('right-cont');
    var show_crew_api = `${base_url}/tv/${show_id}/credits?api_key=${api_key}`;

    getMovies(show_crew_api);

    function getMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showMovies(data.cast);
        })
        .catch(error => {
          console.error('Error fetching Show data:', error);
        });
    }

    function showMovies(data) {
      cast_crew.innerHTML = '';

      data.forEach((movie) => {
        const {original_name, profile_path,character} = movie;
    
        const movieEl = document.createElement('div');
        movieEl.classList.add('cast-crew'); 

        movieEl.innerHTML = `
          <img class="cast-crew-img" src="${img_url}${profile_path}" alt="${original_name}">
          <div class="c-c-name-character">
            <p class="cast-crew-name">${original_name}</p>
            <p class="cast-crew-character">${character}</p>
          </div>
        `;
        cast_crew.appendChild(movieEl);
      });
    }
    /*--------------------------------FOR SIMILAR TV SHOWS....-----------------------------------------*/
    const similar = document.querySelector(".carousel-area");
    const similar_api = `${base_url}/discover/tv?api_key=${api_key}&with_genres=${genre_id}`;
    
    getSimilarMovies(similar_api);

    function getSimilarMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showSimilarMovies(data.results);
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    }

    function showSimilarMovies(data) {
      similar.innerHTML = '';

      data.forEach(movie=> {
        const {name, poster_path, first_air_date, vote_average} = movie;
    
        const movieEl = document.createElement("a");
        movieEl.href = `indexMoviePage.html?showName=`+name;
        movieEl.classList.add('movi'); 

        movieEl.innerHTML = `
          <img src="${img_url+poster_path}" alt="${name}">
          <div class="title-box">
            <h5>${name}</h5>
            <p>${first_air_date.substring(0, 4)}</p>
          </div>
          <div class="rating-box">
            <div class="HD">HD</div>
            <div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>  
          </div>
        
        `;
        similar.appendChild(movieEl);
      });
    }

    /*........................................  SEARCH BOX  ................................ */
    
    const find_url=base_url+'/search/movie?api_key='+api_key+'&query='+query;
    const findMovie = document.querySelector(".search");

    getttMovies(find_url);

    function getttMovies(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showwwMovies(data.results);
          console.log(data.results)
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    }

    function showwwMovies(data) {
      findMovie.innerHTML = '';

      data.forEach((movie) => {
        const {title, poster_path,vote_average} = movie;

        const movieLink = document.createElement("a");
        movieLink.href = `index.html`;
        movieLink.classList.add('card');

        movieLink.innerHTML = `
          <img src="${img_url}${poster_path}" alt="${title}">
          <div class="cont">
            <h3>${title}</h3>
            <p>Action, 2021,<span>IMDB</span><i class="fa-solid fa-star"></i>${vote_average}</p>
          </div>
        `;
       
        findMovie.appendChild(movieLink);
      })
    }     

  })
}
onLoadShows(show_name)

$('#search-btn').click(function () {
    let name=$('#query').val();

    main(name);
  })
  $("#query").keypress(function(event) {
    let name=$('#query').val();

    if (event.key === "Enter") {
      main(name);
    }
  });
