const portrait = document.getElementById("portrait");
const characterClass = document.getElementById("characterClass");
const characterName = document.getElementById("characterName");
const characterRace = document.getElementById("characterRace");

const PB = document.getElementById("PB"); // Proficiency Bonus / Бонус Мастерства
const AC = document.getElementById("AC"); // Armor Class / Класс брони
const Speed = document.getElementById("Speed");
const Initiative = document.getElementById("Initiative");

var classes, races, spells;

async function createFetch(api, options) {
  return fetch(api, options).then((res) => {
    return res.json();
  });
}

GetDataBase().then((data) => {
  classes = data[0];
  races = data[1];
  spells = data[2];
  configureElements(data[0], data[1]);
});

async function GetDataBase() {
  const res = await Promise.allSettled([
    createFetch("https://dnd-data-base.vercel.app/classes", {
      method: "GET",
    }),
    createFetch("https://dnd-data-base.vercel.app/races", {
      method: "GET",
    }),
    createFetch("https://dnd-data-base.vercel.app/spells", {
      method: "GET",
    }),
  ]);
  return res.reduce((arr, curr) => arr.concat(curr.value), []);
}

function configureElements(classes, races) {
  for (let i = 0; i < classes["ClassesRu"].length; i++) {
    characterClass.innerHTML += `<option value="${classes["ClassesEn"][i]}">${classes["ClassesRu"][i]}</option>`;
  }
  for (let i = 0; i < races["RacesRu"].length; i++) {
    characterRace.innerHTML += `<option value="${races["RacesEn"][i]}">${races["RacesRu"][i]}</option>`;
  }

  characterClass.value = "Fighter";
  characterClass.dispatchEvent(new Event("change"));

  characterRace.value = "Human";
}

characterClass.addEventListener("change", (event) => {
  portrait.style.backgroundImage = `url("https://dnd-data-base.vercel.app/portrait/human-${event.target.value.toLowerCase()}-male")`;
  characterClass.style.backgroundImage = `url("./images/DicesClasses/${event.target.value.toLowerCase()}.png")`;
  console.log("changed");
});
