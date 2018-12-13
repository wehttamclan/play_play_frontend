// This file is in the entry point in your webpack config.
/*jshint esversion: 6 */
document.querySelector(".artist-show").style.display = "none";
const navToggle    = document.querySelector(".menu-toggle");
const closeBtn     = document.querySelector(".close-btn");
const searchButton = document.querySelector(".search-button");
const searchField  = document.querySelector(".search-text");

searchField.addEventListener("input", enableSearch);
const appTitle     = document.querySelector(".pppp")

appTitle.addEventListener("click", goHome);
navToggle.addEventListener("click", toggleIt);
closeBtn.addEventListener("click", toggleIt);
searchButton.addEventListener("click", searchForEm);

function enableSearch() {
  if(searchField.value) { searchButton.disabled = false; }
  else { searchButton.disabled = true; }
};

function goHome() {
  document.querySelector(".artist-show").style.display = "none";
  document.querySelector(".landing-page").style.display = "block";
}

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
    image.srcset = results[i].image_url || "https://cdn.browshot.com/static/images/not-found.png"
    imageText.innerText = results[i].name
  }
}

fetch(`https://play-play-api.herokuapp.com/api/v1/landing`)
.then(response => response.json())
.then(landingArtists => {
  document.querySelector(".landing-hero-image").src=`${landingArtists[0].image_url}`;
  document.querySelector(".landing-hero-image").alt=`${landingArtists[0].name}`;
  document.querySelector(".hero-text").innerText=`${landingArtists[0].name}`;
  document.querySelector(".hero-box").addEventListener("click", grabTheArtistInfo);

  let wrapper = document.querySelector(".wrapper");
  for(let i = 1; i < 9; i++) {
    let box = document.createElement("div");
    box.className = `box box-${i}`;
    wrapper.append(box)
    let image = document.createElement("img");
    image.srcset = `${landingArtists[i].image_url}`;
    box.append(image);
    document.querySelector(`.box-${i}`).alt=`${landingArtists[i].name}`
    let overlay = document.createElement("div");
    overlay.className = "box-overlay";
    box.append(overlay);
    let title = document.createElement("h3");
    title.className = "box-text";
    title.innerText = `${landingArtists[i].name}`;
    overlay.append(title);
    document.querySelector(`.box-${i}`).addEventListener("click", grabTheArtistInfo);
  }
});

function grabTheArtistInfo() {
  let artistName;
  if (this.alt) {
    artistName = encodeURIComponent(this.alt);
  } else {
    artistName = encodeURIComponent(this.getElementsByTagName("img")[0].alt);
  }
  fetch(`https://play-play-api.herokuapp.com/api/v1/artists/${artistName}`)
  .then(response => response.json())
  .then(results => {
    let img;
    let name;
    if (this.getElementsByTagName("img")[0].srcset) {
      img = (this.getElementsByTagName("img")[0].srcset);
    } else {
      img = (this.getElementsByTagName("img")[0].src);
    }
    if (this.alt) {
      name = this.alt;
    } else {
      name = this.getElementsByTagName("img")[0].alt;
    }
    showArtist(name, img, results);
    showTracks(name);
  });
}

function showArtist(name, image, albums) {
  window.scrollTo(0, 0);
  document.querySelector(".landing-page").style.display = "none";
  document.querySelector(".artist-show").style.display = "block";
  document.querySelector(".show-hero-image").src=`${image}`;
  document.querySelector(".show-hero-image").alt=`${name}`;
  document.querySelector(".hero-show-text").innerText=`${name}`;
  for(i = 0; i < 6; i++) {
    if (albums.albums[i]) {
      let albumImgUrl = albums.albums[i].image_url;
      let albumName   = albums.albums[i].name;
      let albumNum    = (i + 1);
      document.querySelector(`.album${albumNum}-img`).src=albumImgUrl;
      document.querySelector(`.album${albumNum}-img`).alt=albumName;
      document.querySelector(`.album${albumNum}-img`).alt=albumName;
    } else {
      let albumNum    = (i + 1);
      let albumImgUrl = 'https://lastfm-img2.akamaized.net/i/u/300x300/15ef1c034e1f6a71d0d69d3b6f5c534f.png';
      document.querySelector(`.album${albumNum}-img`).src =`${albumImgUrl}`;
      document.querySelector(`.album${albumNum}-img`).style.opacity = 0.0;
    }
  }
  primeThePlaylist();
}

function primeThePlaylist() {
  document.querySelector(".addToP").addEventListener("click", addThemToPlaylist);
}

function addThemToPlaylist() {
  const selected = document.getElementsByClassName("selected");

  // for (let selection of selected) {
  //   let song = selection.id.split("---");
  //   let newSong = {name: song[0], artist_name: song[1], genre: song[2], song_rating: song[3]};
  //   let payload = {method: "POST", body: JSON.stringify(newSong), headers: { 'Content-Type': 'application/json' }};
  //   fetch(`https://play-play-api.herokuapp.com/api/v1/songs`, payload)
  //   .then(response => response.json())
  // }
}


function showTracks(name) {
  let html = ``;
  fetch(`https://play-play-api.herokuapp.com/api/v1/artists/${name}/tracks`)
  .then(response => response.json())
  .then(results => {
    for (i = 0; i < results.length; i++) {
      if (results[i].name && results[i].artist_name && results[i].genre && results[i].song_rating) {
        let stats = `${results[i].name}---${results[i].artist_name}---${results[i].genre}---${results[i].song_rating}`
        html += `<div id="${stats}" class="single-track track${i}"><p>${results[i].name.trim()}</p><p>${results[i].artist_name.trim()}</p><p>${results[i].genre.trim()}</p><p>${results[i].song_rating}</p></div>`;
      }
    }
    document.querySelector(".tracks-holder").innerHTML = html;
  })
  .then(() => {
    const singleTracks = document.getElementsByClassName("single-track");
    for (let track of singleTracks) {
      track.addEventListener('click', mark);
    }
  });
}

function mark() {
  if (this.classList.contains("selected")){
    this.style.backgroundColor = "black";
    this.style.color = "#636363";
    this.classList.remove("selected");
  } else {
    this.style.backgroundColor = "#ff008c";
    this.style.color = "black";
    this.classList.add("selected");
  }
  const selected = document.getElementsByClassName("selected");
  if (selected.length < 1) {
    document.querySelector(".addToP").style.backgroundColor = "gray";
    document.querySelector(".addToP").style.pointerEvents = "none";
  } else {
    document.querySelector(".addToP").style.backgroundColor = "#ff008c";
    document.querySelector(".addToP").style.pointerEvents = "all";
  }
}
