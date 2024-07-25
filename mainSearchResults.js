import {api_key} from './apiKey.js';
// const api_key = process.env.api_key;

const base_url='https://api.themoviedb.org/3';
const api_url=base_url+'/discover/movie?sort_by=popularity.desc&api_key='+api_key;
const img_url='https://image.tmdb.org/t/p/w500';

const genres=[{"id": 28,"name": "Action"},
	{"id": 12,"name": "Adventure"},
	{"id": 16,"name": "Animation"},
	{"id": 35,"name": "Comedy"},
	{"id": 80,"name": "Crime"},
	/*{"id": 99,"name": "Documentary"},*/
	{"id": 18,"name": "Drama"},
	/*{"id": 10751,"name": "Family"},*/
	{"id": 14,"name": "Fantasy"},
	/*{"id": 36,"name": "History"},*/
	{"id": 27,"name": "Horror"},
	/*{"id": 10402,"name": "Music"},*/
	{"id": 9648,"name": "Mystery"},
	{"id": 10749,"name": "Romance"},
	{"id": 878,"name": "SciFi"},
	/*{"id": 10770,"name": "TV Movie"},*/
	{"id": 53,"name": "Thriller"},
	/*{"id": 10752,"name": "War"},*/
	/*{"id": 37,"name": "Western"}*/
];

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

var urlParams = new URLSearchParams(window.location.search) //getting name from link
var movie_id=0;

var movie_name = urlParams.get('name') ;
// console.log(movie_id )
var genre_id = 0;
function onLoad(movie_name){
  $.getJSON(`${base_url}/search/movie?api_key=${api_key}&query=${movie_name}`, function (data) {
    
    movie_id = data.results[0].id;

    /*--------------------------------FOR genre CEREDTIALS----------------------------------------------------*/
    findGenre(data.results[0].genre_ids);

    function findGenre(data){
      let genreNames = [];

      data.forEach(jonra => {
        genres.forEach(elem => {
            if (jonra == elem.id) {
              genreNames.push(elem.name);
              genre_id=elem.id;
            }
        });
    });
    console.log(genreNames);

    }
    
    /*--------------------------------Search-results----------------------------------------------------*/
    const searchResults = document.querySelector(".poster-area");
    const searchResults_api = base_url+'/search/movie?api_key='+api_key+'&query='+movie_name;
    console.log(searchResults_api);
    

    getSearchResults(searchResults_api);

    function getSearchResults(url) {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          showSearchResults(data.results);
          console.log(data.results);
        })
        .catch(error => {
          console.error('Error fetching movie data:', error);
        });
    }

    function showSearchResults(data) {
      searchResults.innerHTML = '';

      data.forEach(movie=> {
        const {title, poster_path, release_date, vote_average} = movie;

        if (poster_path !== null) {
    
        const movieEl = document.createElement('a');
        movieEl.href="indexMoviePage.html?name="+ title;
        movieEl.classList.add('movi'); 

        movieEl.innerHTML = `
          <img src="${img_url+poster_path}" alt="${title}">
          <div class="movi-details">
                  <div class="title-box">
                    <h5>${title}</h5>
                    <p>${release_date.substring(0,4)}</p>
                  </div>
                  <div class="rating-box">
                    <div class="HD">HD</div>
                    <div class="duration"><i class="fa-regular fa-clock"></i>137 min</div>
                    <div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>
                  </div>
          </div>  
        `;
        searchResults.appendChild(movieEl);
        }
      });
    }

  }
  )} 

onLoad(movie_name)

 /*--------------------------------FOR SIMILAR MOVIES----------------------------------------------------*/
 const similar = document.querySelector(".carousel-area");
 const similar_api = `${base_url}/discover/movie?api_key=${api_key}&with_genres=${genre_id}`;
 
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
     const {title, poster_path} = movie;
 
     const movieEl = document.createElement('div');
     movieEl.classList.add('movi'); 

     movieEl.innerHTML = `
       <img src="${img_url+poster_path}" alt="${title}">
       <div class="movi-details">
         <p>${title}</p>
       </div> 
     `;
     similar.appendChild(movieEl);
   });
 }
