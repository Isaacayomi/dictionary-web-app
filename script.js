"use strict";
const body = document.querySelector("body");
const main = document.querySelector("main");
const options = document.querySelector(".options");
const errorPage = document.querySelector(".error__page");
const fonts = document.querySelectorAll(".fonts");
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
const fontName = ["Inter", "Lora", "Inconsolata"];

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
    toggleMode();
    console.log("added");
  } else {
    toggle.classList.remove("move__toggle");
    console.log("removed");
    !toggleMode();
  }
};

// code to change font on selection
const changeFont = () => {
  fonts.forEach(function (font, i) {
    font.addEventListener("click", function () {
      toggleOptions();
      let errorMessageSection = document.querySelector(".error__msg");
      let inputWordSection = document.querySelector(".input__word");
      let soundSection = document.querySelector(".sound");
      let meaningHeadingSection = document.querySelectorAll(
        ".meaning__heading p"
      );
      let meaningSectionParagraph = document.querySelectorAll(
        ".meaning__section p"
      );
      let meaningSectionList = document.querySelectorAll(
        ".meaning__section ul li"
      );
      let synonymnSection = document.querySelectorAll("p.sentence");

      const elementsToStyle = [
        errorMessageSection,
        inputWordSection,
        soundSection,
        ...meaningHeadingSection,
        ...meaningSectionParagraph,
        ...meaningSectionList,
        ...synonymnSection,
      ];

      elementsToStyle.forEach(function (element) {
        element.style.fontFamily = fontName[i];
      });

      console.log(`Font changed to: ${fontName[i]}`);
    });
  });
};

const submit = () => {
  const word = input.value.trim();

  if (word) {
    errorMsg.classList.add("hide__error__msg");
    main.style.opacity = 100;
    getData(word);
  } else {
    main.style.opacity = 0;
    errorMsg.classList.remove("hide__error__msg");
    console.log("Please enter a word.");
  }
};

const renderData = (data) => {
  main.innerHTML = "";
  const phonetic =
    // finds the first phonetic that has a text property and a length greater than 0
    data[0].phonetics.find((phonetic) => phonetic.text && phonetic.text.length)
      ?.text || "No phonetics found";

  source.href = `${data[0].sourceUrls}}`;
  source.innerHTML = `${data[0].sourceUrls}`;
  source.style.opacity = "100";

  // finds the first phonetic audio that has a length greater than 0
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
        <section class="meaning__heading page__section">
          <p>${meaning.partOfSpeech}</p>
          <img
            src="./starter-code/assets/images/white-line.png"
            alt="horizontal line"
          />
        </section>
        <section class="meaning__section page__section">
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
              ? meaning.synonyms
                  .map(
                    (synonym) => `<span class="clickable-el">${synonym}</span>`
                  )
                  .join(", ")
              : meaning.antonyms && meaning.antonyms.length
              ? meaning
                  .map(
                    (antonymn) =>
                      `<span class = 'clickable-el'> ${antonymn}</span>`
                  )
                  .join(", ")
              : ""
          }
        </p>
        </div>
        
        </section>
      `;
    })
    .join("");

  const html = `
    <section class="header page__section">
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
  const clickableEl = document.querySelectorAll(".clickable-el");
  playImg.addEventListener("click", function () {
    audio.play();
  });
  clickableEl.forEach((el) => {
    el.addEventListener("click", () => {
      console.log(el.textContent);
      input.value = el.textContent;
      getData(el.textContent);
    });
  });
};

errorPage.style.display = "none";
const getData = async function (word) {
  try {
    errorPage.style.display = "none";
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
    // alert("error o, senior man");
    loader.style.display = "none";
    errorPage.style.display = "flex";
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
changeFont();
