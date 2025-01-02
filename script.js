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
//   main.innerHTML = "";

//   const phonetic = data[0].phonetic;

//   const meaningSection = data[0].meanings
//     .map(function (meaning) {
//       return `
//   <section class="meaning__heading noun">
//         <p>${meaning.partOfSpeech}</p>
//         <img
//           src="./starter-code/assets/images/white-line.png"
//           alt="horizontal line"
//         />
//       </section>
//   `;
//     })
//     .join("");

//   const meaningLists = data[0].meanings
//     .map(function (meaning) {
//       return meaning.definitions
//         .map(function (def) {
//           const synonyms = def.synonyms.length
//             ? def.synonyms.join(", ")
//             : "No synonyms available";
//           return `
//           <section class="meaning__section">
//             <p class="meaning">Meaning</p>
//             <ul class="meaning__lists">
//               <li>${def.definition}</li>
//             </ul>

//             <div class="synonymn__section">
//               <p>Synonyms</p>
//               <p class="synonymn">${synonyms}</p>
//             </div>
//           </section>
//           `;
//         })
//         .join("");
//     })
//     .join("");

//   const html = `

//   <section class="header">
//         <div class="header__words">
//           <h2 class="input__word">${data[0].word}</h2>
//           <p class="sound">${phonetic}</p>
//         </div>
//         <div class="play__sound">
//           <img
//             src="./starter-code/assets/images/icon-play.png"
//             alt="play image"
//             class="play__img"
//           />
//           <audio class="play__audio"></audio>
//         </div>
//       </section>
//       ${meaningSection}
//       ${meaningLists}
//   `;
//   main.insertAdjacentHTML("beforeend", html);
// };

const renderData = function (data) {
  main.innerHTML = "";

  // Get phonetic
  const phonetic = data[0]?.phonetic || "Phonetic not available";

  // Generate HTML for each part of speech and its meanings
  const meaningsHTML = data[0]?.meanings
    .map(function (meaning) {
      const definitionsHTML = meaning.definitions
        .map(function (def) {
          const synonyms =
            def.synonyms && def.synonyms.length
              ? def.synonyms.join(", ")
              : "No synonyms available";
          return `
            <li class="definition">${def.definition}</li>
            
          `;
        })
        .join(""); // Combine all definitions for this part of speech

      return `
        <section class="meaning__heading">
          <p class="part-of-speech">${meaning.partOfSpeech}</p>
          <img
            src="./starter-code/assets/images/white-line.png"
            alt="horizontal line"
          />
        </section>
        <section class="meaning__section">
          <p class="meaning">Meaning</p>
          <ul class="meaning__lists">
            ${definitionsHTML}
          </ul>
          <div class="synonymn__section">
              <p>Synonyms</p>
              <p class="synonymn">sy</p>
            </div>
        </section>
      `;
    })
    .join(""); // Combine all parts of speech sections

  // Complete HTML
  const html = `
    <section class="header">
      <div class="header__words">
        <h2 class="input__word">${data[0]?.word || "Word not available"}</h2>
        <p class="sound">${phonetic}</p>
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
    ${meaningsHTML}
  `;

  // Insert the HTML into the main element
  main.insertAdjacentHTML("beforeend", html);
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
