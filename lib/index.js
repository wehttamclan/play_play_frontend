// This file is in the entry point in your webpack config.
/*jshint esversion: 6 */


const spop = document.querySelector(".spop");

const toggleGrow = () => {
  event.preventDefault();
  if (spop.className === 'spop'){
    spop.className = 'spop-grow';
  } else {
    spop.className = 'spop';
  }
};

spop.addEventListener("click", toggleGrow);

spop.innerText = "Oh hello";
