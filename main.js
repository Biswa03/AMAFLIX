'use strict';
import {api_key} from './apiKey.js';
// import {api_key} from './.env';
// require('dotenv').config();
// const api_key = process.env.api_key;

const imageBaseUrl="https://image.tmdb.org/t/p/";
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

$("#search-btn").click(function() {
	searchMovie(Q)
});

function searchMovie(Q){
	console.log(Q);
	window.location.href ="indexSearchResults.html?name="+Q;
}

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


/*---------------------------------CAROUSEL HOME PAGE--------------------------------------------- */
let currentIndex = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;
const slideWidth = 100; // Each slide is 100vw

// Clone the slides to create an infinite loop effect
const firstSlide = slides.firstElementChild.cloneNode(true);
const lastSlide = slides.lastElementChild.cloneNode(true);

slides.appendChild(firstSlide);
slides.insertBefore(lastSlide, slides.firstElementChild);

function showNextSlide() {
  currentIndex++;
  slides.style.transition = 'transform 1s ease-in-out';
  slides.style.transform = `translateX(${-slideWidth * (currentIndex + 1)}vw)`;

  if (currentIndex >= totalSlides) {
    setTimeout(() => {
      slides.style.transition = 'none';
      slides.style.transform = `translateX(${-slideWidth}vw)`;
      currentIndex = 0;
    }, 1000); // Delay must match the transition duration
  }
}

setInterval(showNextSlide, 5000); // Change slide every 5 seconds

// Initial setup to show the first slide
slides.style.transform = `translateX(${-slideWidth}vw)`;


/*---------------------------------GENRE OPTIONS/ FILTER BY GENRE--------------------------------------------- */
const tagsEl=document.querySelector('#genre-container');

var selectedGenre=[];

setGenres();
function setGenres(){
	tagsEl.innerHTML='';

	genres.forEach(genre=>{
		const t = document.createElement('div');
		t.classList.add('tag');
		t.id=genre.id;
		t.innerText=genre.name;
		t.addEventListener('click',()=>{
			if(selectedGenre.length==0){
				selectedGenre.push(genre.id);
			}else{
				if(selectedGenre.includes(genre.id)){
					selectedGenre.forEach((id,idx)=>{
						if(id==genre.id){
							selectedGenre.splice(idx,1);
						} 
					})
				}else{
					selectedGenre.push(genre.id);
				} 
			}
			console.log(selectedGenre);
			getTopRated(top_rated_api+'&with_genres='+selectedGenre[0]);
			selectedGenre=[];
		})
		
		tagsEl.append(t);
	})
}

/*............................UPCOMING MOVIES .........................*/
const base_url='https://api.themoviedb.org/3';
const api_url=base_url+'/movie/upcoming?api_key='+api_key;
const img_url='https://image.tmdb.org/t/p/w500';

const main=document.getElementById('poster-area');

getMovies(api_url);

function getMovies(url){

  fetch(url).then(res=>res.json()).then(data=>{
    console.log(data.results);
    showMovies(data.results);
});
};
/*..............................UPCOMING..................................... */
function showMovies(data){
	main.innerHTML='';

  data.forEach(movie=> {
	const {title, poster_path, vote_average, release_date} =movie;
    const movieEl=document.createElement("a");
	movieEl.href="indexMoviePage.html?name="+ title;
	movieEl.classList.add('upcoming-poster-details');
	movieEl.innerHTML=`
	    <img src="${img_url+poster_path}" alt="${title}" class="upcoming-poster upcoming-poster-1">
	    <div class="upcoming-details">
            <div class="title-box">
              <h5>${title}</h5>
			  <p>${release_date.substring(0, 4)}</p>
            </div>
            <div class="rating-box">
              <div class="HD">HD</div>
              <div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>
            </div>
        </div>
      
	`
	main.appendChild(movieEl);
  })
}

// /*..........................................STREAMING NOW....................................... */

const now_playing_api=base_url+'/movie/now_playing?api_key='+api_key;
const now=document.getElementById('streaming-now-poster-area');

getNowPlaying(now_playing_api);

function getNowPlaying(url){

  fetch(url).then(res=>res.json()).then(data=>{
    console.log(data.results);
    showNowPlaying(data.results);
});
};
function showNowPlaying(data){
	now.innerHTML='';

  data.forEach(movie=> {
	const {title, poster_path, vote_average, release_date} =movie;
    const movieEl=document.createElement("a");
	movieEl.href="indexMoviePage.html?name="+ title;
	/*movieEl.classList.add('streaming-now-poster-details');*/
	movieEl.classList.add('upcoming-poster-details');

	movieEl.innerHTML=`
	    <img src="${img_url+poster_path}" alt="${title}" class="streaming-now-poster streaming-now-poster-1">
		<div class="upcoming-details">
			<div class="title-box">
		 		<h5>${title}</h5>
		  		<p>${release_date.substring(0,4)}</p>
			</div>
			<div class="rating-box">
		  		<div class="HD">HD</div>
		  		<div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>
			</div>
      	</div>
	`
	now.appendChild(movieEl);
  })
}


/*.........................................TOP RATED..................................... */


const top_rated_api=base_url+'/discover/movie?sort_by=vote_average.desc&api_key='+api_key+'&page=1&vote_count.gte=50';
const topM=document.getElementById('top-rated-poster-area');

getTopRated(top_rated_api);

function getTopRated(url){

  fetch(url).then(res=>res.json()).then(data=>{
    console.log(data.results);
    showTopRated(data.results);
});
};
function showTopRated(data){
	topM.innerHTML='';

  data.forEach(movie=> {
	const {title, poster_path, vote_average, release_date} =movie;
    const movieEl=document.createElement("a");
	movieEl.href="indexMoviePage.html?name="+ title;
	movieEl.classList.add('upcoming-poster-details');

	movieEl.innerHTML=`
	    <img src="${img_url+poster_path}" alt="${title}" class="top-rated-poster top-rated-poster-1">
		<div class="upcoming-details">
			<div class="title-box">
		 		<h5>${title}</h5>
		  		<p>${release_date.substring(0,4)}</p>
			</div>
			<div class="rating-box">
		  		<div class="HD">HD</div>
		  		<div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>
			</div>
      	</div>
	`
	topM.appendChild(movieEl);
  })
}
/*.............................................TV SHOWS....................................... */
const tv_api=base_url+'/tv/airing_today?api_key='+api_key;
const show=document.getElementById('tv-shows-poster-area');

getShows(tv_api);

function getShows(url){

  fetch(url).then(res=>res.json()).then(data=>{
    console.log(data.results);
    showShows(data.results);
});
};
function showShows(data){
	show.innerHTML='';

  data.forEach(movie=> {
	const {name, poster_path, vote_average, first_air_date} =movie;
    const movieEl=document.createElement("a");
	movieEl.href="indexMoviePage.html?showName="+name;
	movieEl.classList.add('upcoming-poster-details');

	movieEl.innerHTML=`
	    <img src="${img_url+poster_path}" alt="${name}" class="tv-shows-poster tv-shows-poster-1">
            <div class="top-rated-details">
			  <div class="title-box">
                <h5>${name}</h5>
                <p>${first_air_date.substring(0,4)}</p>
              </div>
              <div class="rating-box">
                <div class="HD">HD</div>
                <div class="rating"><i class="fa-solid fa-star"></i>${vote_average.toFixed(1)}</div>
              </div>
            </div>
	`
	show.appendChild(movieEl);
  })
}
/*.............................................TV SHOWS CATEGORIES....................................... */
let airing_tvShows= document.querySelector("#airing-today-tv-shows");
airing_tvShows.addEventListener("click", function(){

	const show=document.getElementById('tv-shows-poster-area');

	getShows(tv_api);

	function getShows(url){

 		fetch(url).then(res=>res.json()).then(data=>{
   		console.log(data.results);
    	showShows(data.results);
});
};
})
const popular_tv_api=base_url+'/tv/popular?api_key='+api_key;
let popular_tvShows= document.querySelector("#popular-tv-shows");
popular_tvShows.addEventListener("click", function(){

	const show=document.getElementById('tv-shows-poster-area');

	getShows(popular_tv_api);
	function getShows(url){

 		fetch(url).then(res=>res.json()).then(data=>{
   		console.log(data.results);
    	showShows(data.results);
});
};
})
const top_tv_api=base_url+'/tv/top_rated?api_key='+api_key;

let top_tvShows= document.querySelector("#top-rated-tv-shows");
top_tvShows.addEventListener("click", function(){

	const show=document.getElementById('tv-shows-poster-area');

	getShows(top_tv_api);
	function getShows(url){

 		fetch(url).then(res=>res.json()).then(data=>{
   		console.log(data.results);
    	showShows(data.results);
});
};
})


const next=document.getElementById('next');

$('#next').click(function () {

	location.replace('google.com');
})



