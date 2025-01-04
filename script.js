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
const loader = document.querySelector(".loader");
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

const renderData = (data) => {
  main.innerHTML = "";
  const phonetic =
    data[0].phonetics.find((phonetic) => phonetic.text && phonetic.text.length)
      ?.text || "No phonetics found";

  source.href = `${data[0].sourceUrls}}`;
  source.innerHTML = `${data[0].sourceUrls}`;
  source.style.opacity = "100";

  const phoneticAudio = data[0].phonetics.find(
    (phonetic) => phonetic.audio && phonetic.audio.length
  );

  const audioSrc = phoneticAudio?.audio || "";

  const meaningSection = data[0].meanings
    .map(function (meaning) {
      const definitionsHTML = meaning.definitions
        .map(function (def) {
          return `
            <li>
              ${def.definition}
              ${def.example ? `<p class="sentence">'${def.example}'</p>` : ""}
            </li>
          `;
        })
        .join("");

      return `
        <section class="meaning__heading">
          <p>${meaning.partOfSpeech}</p>
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
          <p class='synonymn__heading'>${
            meaning.synonyms && meaning.synonyms.length
              ? "Synonyms:"
              : meaning.antonyms && meaning.antonyms.length
              ? "Antonyms:"
              : ""
          }</p>
          <p class="synonymn">${
            meaning.synonyms && meaning.synonyms.length
              ? meaning.synonyms.join(", ")
              : meaning.antonyms && meaning.antonyms.length
              ? meaning.antonyms.join(", ")
              : ""
          }
          </p>
        </div>
        
        </section>
      `;
    })
    .join("");

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
        <audio class="play__audio" src=${audioSrc}>/audio>
      </div>
    </section>
    ${meaningSection}
   
  `;

  main.insertAdjacentHTML("beforeend", html);

  const audio = document.querySelector(".play__audio");
  const playImg = document.querySelector(".play__img");
  playImg.addEventListener("click", function () {
    audio.play();
  });
};

const getData = async function (word) {
  try {
    loader.style.display = "block";
    main.style.opacity = 0;
    footer.style.opacity = 0;
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!res.ok) {
      console.log("failed to fetch sehh!");
      throw new Error(`HTTP error!: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    renderData(data);
    main.style.opacity = 100;
    footer.style.opacity = 100;
    loader.style.display = "none";
    return data;
  } catch (error) {
    // main.style.opacity = 100;
    // main.innerHTML = "This word cannot be found";
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
// console.log(playImg);
