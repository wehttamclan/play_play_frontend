// This file is in the entry point in your webpack config.
/*jshint esversion: 6 */
document.querySelector(".artist-show").style.display = "none";
const navToggle    = document.querySelector(".menu-toggle");
const closeBtn     = document.querySelector(".close-btn");
const fromSubmit   = document.querySelector(".search-text");
const searchButton = document.querySelector(".search-button");

navToggle.addEventListener("click", toggleIt);
closeBtn.addEventListener("click", toggleIt);
searchButton.addEventListener("click", searchForEm);

fromSubmit.addEventListener("keydown", function(e) {
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

function searchForEm(query = '') {
  var search = encodeURIComponent(fromSubmit.value.trim());
  fetch(`https://play-play-api.herokuapp.com/api/v1/search/${search}`)
  .then(response => response.json())
  .then(results => {
    console.log(results)
  });
}

fetch(`https://play-play-api.herokuapp.com/api/v1/landing`)
.then(response => response.json())
.then(landingArtists => {
  document.querySelector(".landing-hero-image").src=`${landingArtists[0].image_url}`;
  document.querySelector(".landing-hero-image").alt=`${landingArtists[0].name}`;
  document.querySelector(".hero-text").innerText=`${landingArtists[0].name}`;
    document.querySelector(".landing-top-left").src=`${landingArtists[1].image_url}`;
    document.querySelector(".top-left-text").innerText=`${landingArtists[1].name}`;
  document.querySelector(".landing-top-right").src=`${landingArtists[2].image_url}`;
  document.querySelector(".top-right-text").innerText=`${landingArtists[2].name}`;
    document.querySelector(".landing-bottom-left").src=`${landingArtists[3].image_url}`;
    document.querySelector(".bottom-left-text").innerText=`${landingArtists[3].name}`;
  document.querySelector(".landing-bottom-right").src=`${landingArtists[4].image_url}`;
  document.querySelector(".bottom-right-text").innerText=`${landingArtists[4].name}`;
    document.querySelector(".second-landing-top-left").src=`${landingArtists[5].image_url}`;
    document.querySelector(".second-top-left-text").innerText=`${landingArtists[5].name}`;
  document.querySelector(".second-landing-top-right").src=`${landingArtists[6].image_url}`;
  document.querySelector(".second-top-right-text").innerText=`${landingArtists[6].name}`;
    document.querySelector(".second-landing-bottom-left").src=`${landingArtists[7].image_url}`;
    document.querySelector(".second-bottom-left-text").innerText=`${landingArtists[7].name}`;
  document.querySelector(".second-landing-bottom-right").src=`${landingArtists[8].image_url}`;
  document.querySelector(".second-bottom-right-text").innerText=`${landingArtists[8].name}`;
});


const heroImage = document.querySelector(".landing-hero-image");
heroImage.addEventListener("click", grabTheArtistInfo);

function grabTheArtistInfo() {
  const artistName = encodeURIComponent(this.alt);
  fetch(`https://play-play-api.herokuapp.com/api/v1/artists/${artistName}`)
  .then(response => response.json())
  .then(results => {
    showArtist(this.alt, this.src, results);
    showTracks(this.alt);
  });
}

function showArtist(name, image, albums) {
  document.querySelector(".landing-page").style.display = "none";
  document.querySelector(".artist-show").style.display = "block";

  document.querySelector(".show-hero-image").src=`${image}`;
  document.querySelector(".show-hero-image").alt=`${name}`;
  document.querySelector(".hero-show-text").innerText=`${name}`;
  for(i = 0; i < 6; i++) {
    if (albums.albums[i]) {
      let albumImgUrl = albums.albums[i].image_url;
      let albumName   = albums.albums[0].name;
      let albumNum    = (i + 1);
      document.querySelector(`.album${albumNum}-img`).src=`${albumImgUrl}`;
      document.querySelector(`.album${albumNum}-img`).alt=`${albumName}`;
      document.querySelector(`.album${albumNum}-img`).alt=`${albumName}`;
    } else {
      let albumNum    = (i + 1);
      let albumImgUrl = 'https://lastfm-img2.akamaized.net/i/u/300x300/15ef1c034e1f6a71d0d69d3b6f5c534f.png';
      document.querySelector(`.album${albumNum}-img`).src=`${albumImgUrl}`;
      document.querySelector(`.album${albumNum}-img`).style.opacity = 0.0;
    }
  }
}

function showTracks(name) {
  let html = ``;
  fetch(`https://play-play-api.herokuapp.com/api/v1/artists/${name}/tracks`)
  .then(response => response.json())
  .then(results => {
    for (i = 0; i < results.length; i++) {
      html += `<div class="single-track track${i}><p>${results[i].name.trim()}</p><p>${results[i].artist_name.trim()}</p><p>${results[i].genre.trim()}</p><p>${results[i].song_rating}</p></div>`;
    }
    document.querySelector(".tracks-holder").innerHTML = html;
  });
}
