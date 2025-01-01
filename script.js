"use strict";
const main = document.querySelector("main");
const options = document.querySelector(".options");
const dropdown = document.querySelector(".dropdown__img");
const toggleContainer = document.querySelector(".toggle__btn");
const toggle = document.querySelector(".toggle");
const searchIcon = document.querySelector(".search__icon");
const input = document.querySelector("input");
let inputWord = document.querySelector(".input__word");
let phonetics = document.querySelector(".sound");
let synonymn = document.querySelector(".synonymn");
const errorMsg = document.querySelector(".error__msg");
const meaningLists = document.querySelector(".meaning__lists");
const source = document.querySelector(".source p a");
const audio = document.querySelector(".play__audio");
const playImg = document.querySelector(".play__img");
const footer = document.querySelector("footer");

const toggleMode = () => {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme;

  if (currentTheme === "dark") {
    newTheme = "light";
  } else {
    newTheme = "dark";
  }
  document.documentElement.setAttribute("data-theme", newTheme);
};

const toggleOptions = () => {
  if (options.classList.contains("hide__options")) {
    options.classList.remove("hide__options");
  } else {
    options.classList.add("hide__options");
  }
};

const toggleBtn = () => {
  if (!toggle.classList.contains("move__toggle")) {
    toggle.classList.add("move__toggle");
    // console.log(playIcon.src);
    // playImg.src = "./starter-code/assets/images/icon-play-dark-mode.png";
    toggleMode();
    console.log("added");
  } else {
    toggle.classList.remove("move__toggle");
    // playImg.src = "./starter-code/assets/images/icon-play.png";
    console.log("removed");
    !toggleMode();
  }
};

const submit = () => {
  const word = input.value.trim(); // Get the input value

  if (word) {
    errorMsg.classList.add("hide__error__msg");
    getData(word);
  } else {
    errorMsg.classList.remove("hide__error__msg");
    console.log("Please enter a word.");
  }
};

// const renderData = function (data) {
//   main.innerHTML = " ";

//   const phoneticsHTML = data[0].map(function (phonetic) {
//     phonetic.text;
//   });

//   const meaningsHTML = data[0].meanings.map(function (meanings) {
//     return meanings.map(function (definitions) {
//       return `<li>${definitions.definition}</li>`;
//     });
//   });

//   const partOfSpeech = data[0].meanings.map(function (meanings) {
//     return meanings.map(function (pos) {
//       return `<p>${pos.partOfSpeech}</p>`;
//     });
//   });

//   const html = `
// <section class="header">
// <div class="header__words">
//   <h2 class="input__word">${data[0].word}</h2>
//   <p> ${phoneticsHTML}</p>
// </div>
// <div class="play__sound">
//   <img
//     src="./starter-code/assets/images/icon-play.png"
//     alt="play image"
//     class="play__img"
//   />
//   <audio class="play__audio"></audio>
// </div>
// </section>

// <section class="meaning__heading noun">
// ${partOfSpeech}
// <img
//   src="./starter-code/assets/images/white-line.png"
//   alt="horizontal line"
// />
// </section>

// <section class="meaning__section">
// <p class="meaning">Meaning</p>
// <ul class="meaning__lists">
//   ${meaningsHTML}
// </ul>

// <div class="synonymn__section">
//   <p>Synonyms</p>
//   <p class="synonymn">electronic keyboard</p>
// </div>
// </section>

// `;

//   console.log(true);
//   main.insertAdjacentHTML("afterbegin", html);
// };

const renderData = function (data) {
  main.innerHTML = " ";

  // Phonetics text
  // const phoneticsHTML = data[0].phonetics
  //   .map((phonetic) => phonetic.text || "")
  //   .join("");

  // Definitions list
  const meaningsHTML = data[0].meanings
    .map((meaning) => {
      return meaning.definitions
        .map((definition) => `<li>${definition.definition}</li>`)
        .join("");
    })
    .join("");

  // Parts of Speech
  const partOfSpeech = data[0].meanings
    .map((meaning) => `<p>${meaning.partOfSpeech}</p>`)
    .join("");

  // HTML structure
  const html = `
    <section class="header">
      <div class="header__words">
        <h2 class="input__word">${data[0].word}</h2>

        ${data[0].phonetics
          .map((phonetic) => `<p>${phonetic.text}</p>` || "")
          .join("")}
      </div>
      <div class="play__sound">
        <img
          src="./starter-code/assets/images/icon-play.png"
          alt="play image"
          class="play__img"
        />
        <audio class="play__audio"></audio>
      </div>
    </section>

    <section class="meaning__heading noun">
   ${data[0].meanings
     .map((meaning) => `<p>${meaning.partOfSpeech}</p>`)
     .join("")}
      <img
        src="./starter-code/assets/images/white-line.png"
        alt="horizontal line"
      />
    </section>

    <section class="meaning__section">
      <p class="meaning">Meaning</p>
      <ul class="meaning__lists">
        ${data[0].meanings
          .map((meaning) => {
            return meaning.definitions
              .map((definition) => `<li>${definition.definition}</li>`)
              .join("");
          })
          .join("")}
      </ul>

      <div class="synonymn__section">
        <p>Synonyms</p>
        <p class="synonymn">electronic keyboard</p>
      </div>
    </section>
  `;

  main.insertAdjacentHTML("afterbegin", html);
};

const getData = async function (word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!res.ok) {
      throw new Error(`HTTP error!: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    renderData(data);
    main.style.opacity = 100;
    footer.style.opacity = 100;
    return data;
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);
  }
};

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    submit();
  }
});
searchIcon.addEventListener("click", submit);

dropdown.addEventListener("click", toggleOptions);
toggle.addEventListener("click", toggleBtn);

// inputWord.textContent = data[0].word;
// phonetics.textContent = data[0].phonetics[0].text;
// let wordMeanings = data[0].meanings[0].definitions;
// wordMeanings.map((definition) => `<li>${definition}</li`).join("");
// meaningLists.innerHTML = wordMeanings
//   .map((definition) => `<li>${definition.definition}</li>`)
//   .join("");
// let wordSynonymn = data[0].meanings[0].synonyms;
// wordSynonymn.map((synonymn) => `<p>${synonymn}</p>`).join(" ");
// synonymn.innerHTML = wordSynonymn;

// const phoneticsArray = data[0].phonetics;
// phoneticsArray.forEach((phonetic) => {
//   console.log(phonetic);
//   if (phonetic.audio) {
//     console.log(true);
//     // audio.src = data[0].phonetics[1].audio;
//     audio.src = phonetic.audio;
//   } else {
//     console.log("No audio available for this word");
//   }
// });
