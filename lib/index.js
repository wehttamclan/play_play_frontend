// This file is in the entry point in your webpack config.
/*jshint esversion: 6 */

// https://github.com/thelinmichael/spotify-web-api-node
// browserify [input].js > [output].js
// var SpotifyWebApi = require('spotify-web-api-node');
//
// var spotifyApi = new SpotifyWebApi({
//   clientId: '95bd10eba6d84741b6261e80d10a6db9',
//   clientSecret: '8d50c48cf22e404c8f15e20df8905e29',
//   redirectUri: 'http://www.example.com/callback'
// });
//
// // Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//   function(data) {
//     console.log('Artist albums', data.body);
//   },
//   function(err) {
//     console.error(err);
//   }
// );
const navToggle    = document.querySelector(".menu-toggle");
const closeBtn     = document.querySelector(".close-btn");
const searchButton = document.querySelector(".search-button");
const searchField  = document.querySelector(".search-text");

searchField.addEventListener("input", enableSearch);
navToggle.addEventListener("click", toggleIt);
closeBtn.addEventListener("click", toggleIt);
searchButton.addEventListener("click", searchForEm);

function enableSearch() {
  if(searchField.value) { searchButton.disabled = false; }
  else { searchButton.disabled = true; }
};

searchField.addEventListener("keydown", function(e) {
  if (e.which == 13){
    searchForEm();
  }
});

function toggleIt() {
  if(document.querySelector(".side-nav").style.width === "") {
    openMenu();
  } else {
    closeMenu();
  }
}

function openMenu() {
  document.querySelector(".side-nav").style.width = "150px";
  document.querySelector(".main").className = "main-menu";
  document.querySelector(".menu-toggle").className = "menu-toggle hide-nav";
}

function closeMenu() {
  document.querySelector(".side-nav").style.width = "";
  document.querySelector(".main-menu").className = "main";
  document.querySelector(".menu-toggle").className = "show-nav menu-toggle";
}

function searchForEm() {
  var search = encodeURIComponent(searchField.value.trim());
  fetch(`https://play-play-api.herokuapp.com/api/v1/search/${search}`)
  .then(response => response.json())
  .then(results => {
    displayResults(results)
  })
}

function displayResults(results) {
  for (let i in results.slice(0, 9)) {
    let wrapper = document.querySelector(".wrapper");
    let box = wrapper.getElementsByClassName("box")[i]
    let image = box.getElementsByTagName('img')[0]
    let imageText = box.getElementsByTagName("h3")[0]
    image.srcset = results[i].image_url
    imageText.innerText = results[i].name
  }
}

fetch(`https://play-play-api.herokuapp.com/api/v1/landing`)
.then(response => response.json())
.then(landingArtists => {
  document.querySelector(".landing-hero-image").src=`${landingArtists[0].image_url}`;
  document.querySelector(".hero-text").innerText=`${landingArtists[0].name}`;

  document.querySelector(".artist-box").src=`${landingArtists[1].image_url}`;
  document.querySelector(".box-text").innerText=`${landingArtists[1].name}`;
  let wrapper = document.querySelector(".wrapper");
  for(let i = 2; i < 9; i++) {
    let box = document.createElement("div");
    box.className = "box";
    wrapper.append(box)
    let image = document.createElement("img");
    image.srcset = `${landingArtists[i].image_url}`;
    box.append(image);
    let overlay = document.createElement("div");
    overlay.className = "box-overlay";
    box.append(overlay);
    let title = document.createElement("h3");
    title.className = "box-text";
    title.innerText = `${landingArtists[i].name}`;
    overlay.append(title);
  }
});

