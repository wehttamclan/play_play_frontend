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
appTitle.addEventListener("click", function() {
  window.location = window.location;
});
navToggle.addEventListener("click", toggleIt);
closeBtn.addEventListener("click", toggleIt);
searchButton.addEventListener("click", searchForEm);

function enableSearch() {
  if(searchField.value) { searchButton.disabled = false; }
  else { searchButton.disabled = true; }
};

function goHome() {
  document.querySelector(".artist-show").style.display = "none";
  document.querySelector(".playlists").style.display = "none";
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
  goHome();
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
    image.alt = results[i].name
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
})

function grabTheArtistInfo() {
  let artistName;
  if (this.alt) {
    artistName = encodeURIComponent(this.alt);
  } else if (this.getElementsByTagName("img")[0]) {
    artistName = encodeURIComponent(this.getElementsByTagName("img")[0].alt);
  } else {
    console.log("More to come");
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
  })
}

function showArtist(name, image, albums) {
  window.scrollTo(0, 0);
  document.querySelector(".landing-page").style.display = "none";
  document.querySelector(".playlists").style.display = "none";
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
  primeTheTracks();
  getPlaylists();
}

function primeTheTracks() {
  document.querySelector(".artistShowAdd").addEventListener("click", function() {
    document.querySelector(".playlist-holder").style.display = "block";
  });
}

function primeThePlaylist() {
  document.querySelector(".runAddP").addEventListener("click", addThemToExistingPlaylist);
}

function primeTheCreatePlaylist() {
  document.querySelector(".create-playlist-button").addEventListener("click", addThemToNewPlaylist);
}

function addThemToExistingPlaylist() {
  const songs = document.getElementsByClassName("selected");
  const playlists = document.getElementsByClassName("selected-p");
  let songIds = [];
  let playlistIds = [];
  for (let song of songs) {
    let songInfo = song.id.split("---");
    let newSong = {name: songInfo[0], artist_name: songInfo[1], genre: songInfo[2], song_rating: songInfo[3]};
    let payload = {method: "POST", body: JSON.stringify(newSong), headers: { 'Content-Type': 'application/json' }};
    fetch(`https://play-play-api.herokuapp.com/api/v1/songs`, payload)
    .then(response => response.json())
    .then(result => {
      songIds.push(result.songs.id);
      if(songIds.length == songs.length) {
        for (let playlist of playlists) {
          playlistIds.push(playlist.id)
        }
        for (let playlist of playlistIds) {
          for (let songId of songIds) {
            const relation = {song_id: songId, playlist_id: playlist};
            const payload  = {method: "POST", body: JSON.stringify(relation), headers: { 'Content-Type': 'application/json' }}
            fetch(`https://play-play-api.herokuapp.com/api/v1/playlists/${playlist}/songs/${songId}`, payload)
          }
        }
      }
    })
  }
  uploadResponse();
}

function uploadResponse() {
  document.querySelector(".addSuccess").style.display = "block";
  document.querySelector(".playlist-holder").style.display = "none";
}

function addThemToNewPlaylist() {
  const songs = document.getElementsByClassName("selected");
  const playlists = document.getElementsByClassName("selected-p");
  for (let song of songs) {
    let song = selection.id.split("---");
    let newSong = {name: song[0], artist_name: song[1], genre: song[2], song_rating: song[3]};
    let payload = {method: "POST", body: JSON.stringify(newSong), headers: { 'Content-Type': 'application/json' }};
    fetch(`https://play-play-api.herokuapp.com/api/v1/songs`, payload)
    .then(response => response.json())
    .then(result => {
    })
  }
  for (let playlist of playlists) {

  }
}

function getPlaylists() {
  fetch(`https://play-play-api.herokuapp.com/api/v1/playlists`)
  .then(response => response.json())
  .then(playlists => {
    let html = ``;
    for (let playlist of playlists) {
      html += `<p class="single-playlist" id="${playlist.id}">${playlist.name}</p> `
    }
    document.querySelector(".playlist-list").innerHTML = html;
    const playlistCards = document.getElementsByClassName("single-playlist");
    for (let card of playlistCards) {
      card.addEventListener("click", markPlaylist);
    }
    const createPlay = document.querySelector(".new-playlist-text");
    createPlay.addEventListener("input", enableCreatePlaylist);
  })
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


function markPlaylist() {
  if (this.classList.contains("selected-p")){
    this.style.backgroundColor = "black";
    this.style.color = "#636363";
    this.classList.remove("selected-p");
  } else {
    this.style.backgroundColor = "#ff008c";
    this.style.color = "black";
    this.classList.add("selected-p");
  }
  const selected = document.getElementsByClassName("selected-p");
  if (selected.length < 1) {
    document.querySelector(".playlistShowAdd").style.backgroundColor = "gray";
    document.querySelector(".playlistShowAdd").style.pointerEvents = "none";
  } else {
    document.querySelector(".playlistShowAdd").style.backgroundColor = "#ff008c";
    document.querySelector(".playlistShowAdd").style.pointerEvents = "all";
  }
}

function enableCreatePlaylist() {
  const createPlay = document.querySelector(".new-playlist-text");
  const createPlayBtn = document.querySelector(".create-playlist-button");

  if(createPlay.value) {
    createPlayBtn.disabled = false;
    createPlayBtn.style.pointerEvents = "all";
    createPlayBtn.style.backgroundColor = "#ff008c"
    createPlayBtn.style.color = "black";
  } else {
    createPlayBtn.disabled = true;
    createPlayBtn.style.pointerEvents = "none";
    createPlayBtn.style.color = "black";
    createPlayBtn.style.backgroundColor = "gray";
  }
};

document.querySelector(".close-add").addEventListener("click", function() {
  document.querySelector(".playlist-holder").style.display = "none";
})

document.querySelector(".playlists-link").addEventListener("click", function() {
  document.querySelector(".landing-page").style.display = "none";
  document.querySelector(".artist-show").style.display = "none";
  document.querySelector(".playlists").style.display = "flex";
  document.querySelector(".playlists").style.flexWrap = "wrap";
  loadThePlays();
})

document.querySelector(".playlists").style.display = "none"

function loadThePlays() {
  closeMenu();
  event.preventDefault();
  fetch(`https://play-play-api.herokuapp.com/api/v1/playlists`)
  .then(response => response.json())
  .then((playlists) => {
    let html = ``;
    for (let playlist of playlists) {
      html += ` <div class="playlist-card-holder">
                  <div class="playlist-title">
                    <h3>${playlist.name}</h3>
                  </div>
                  <div id="${playlist.id}" class="playlist-card">`
      for (let song of playlist.songs) {
        html += `   <div id="${song.id}" class="single-song">
                      <p>${song.name}</p>
                    </div>`
      }
      html += `   </div>
                </div>`;
    }
    document.querySelector(".playlists").innerHTML = html;
    const playlistCards = document.getElementsByClassName("single-song");
    for (let card of playlistCards) {
      card.addEventListener("click", grabTheArtistInfo);
    }
  })
}
