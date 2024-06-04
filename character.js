const portrait = document.getElementById("portrait");
const characterClass = document.getElementById("characterClass");
const characterName = document.getElementById("characterName");
const characterRace = document.getElementById("characterRace");

const PB = document.getElementById("PB"); // Proficiency Bonus / Бонус Мастерства
const AC = document.getElementById("AC"); // Armor Class / Класс брони
const Speed = document.getElementById("Speed");
const Initiative = document.getElementById("Initiative");

const STR = document.getElementById("strVal");
const DEX = document.getElementById("dexVal");
const CON = document.getElementById("conVal");
const INT = document.getElementById("intVal");
const WIS = document.getElementById("wisVal");
const CHA = document.getElementById("chaVal");

var Level = 1;
const sexChanger = document.getElementById("sexChanger");
var Sex = "male";

const skillList = [...document.getElementsByClassName("skillVals")];
/*[
  STstr,
  athletics,
  STdex,
  acrobatics,
  sleightOfHand,
  stealth,
  STcon,
  STint,
  arcana,
  history,
  investigation,
  religion,
  STwis,
  animalHandling,
  insight,
  medicine,
  perception,
  survival,
	STcha,
	deception,
	intimidation,
	performance,
	persuasion
]*/

const skillCBList = [...document.getElementsByClassName("skillCB")];
/*[
  STstrCB,
  athleticsCB,
  STdexCB,
  acrobaticsCB,
  sleightOfHandCB,
  stealthCB,
  STconCB,
  STintCB,
  arcanaCB,
  historyCB,
  investigationCB,
  religionCB,
  STwisCB,
  animalHandlingCB,
  insightCB,
  medicineCB,
  perceptionCB,
  survivalCB,
	STchaCB,
	deceptionCB,
	intimidationCB,
	performanceCB,
	persuasionCB
]*/

var classes, races, racesDetails, spells;

async function createFetch(api, options) {
  return fetch(api, options).then((res) => {
    return res.json();
  });
}

GetDataBase().then((data) => {
  classes = data[0];
  races = data[1];
  racesDetails = data[2];
  spells = data[3];
  configureElements(data[0], data[1]);
  updateTable();
});

async function GetDataBase() {
  const res = await Promise.allSettled([
    createFetch("https://dnd-data-base.vercel.app/classes", {
      method: "GET",
    }),
    createFetch("https://dnd-data-base.vercel.app/races", {
      method: "GET",
    }),
    createFetch("https://dnd-data-base.vercel.app/race", { method: "GET" }),
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

  characterRace.value = "Human";
  characterRace.dispatchEvent(new Event("change"));

  characterClass.value = "Wizard";
  characterClass.dispatchEvent(new Event("change"));

  [STR, DEX, CON, INT, WIS, CHA].forEach((item) => {
    item.value = 8;
  });
  updatePB();
  updateCharacteristicMods();
  updateSkillVals();
  document.getElementById("Speed").innerHTML =
    racesDetails[`${characterRace.value.toLowerCase()}`][0]["speed"];

  document.getElementById("level").value = 1;
}

characterRace.addEventListener("change", (event) => {
  changePortrait();
  document.getElementById("Speed").innerHTML =
    racesDetails[`${characterRace.value.toLowerCase()}`][0]["speed"];
});
characterClass.addEventListener("change", (event) => {
  changePortrait();
  characterClass.style.backgroundImage = `url("./images/DicesClasses/${event.target.value.toLowerCase()}.png")`;
  document.getElementById("Speed").innerHTML =
    racesDetails[`${characterRace.value.toLowerCase()}`][0]["speed"];
  updateTable();
});
sexChanger.addEventListener("click", (event) => {
  Sex = Sex == "male" ? "female" : "male";
  sexChanger.innerHTML = Sex == "male" ? "М" : "Ж";
  changePortrait();
});

function changePortrait() {
  portrait.style.backgroundImage = `url("https://dnd-data-base.vercel.app/portrait/${characterRace.value.toLowerCase()}-${characterClass.value.toLowerCase()}-${Sex}")`;
}

skillCBList.forEach((item) => addEventListener("change", updateSkillVals));

document.getElementById("level").addEventListener("input", (e) => {
  if (e.target.value > 20) {
    e.target.value = 20;
  }
  if (e.target.value < 1) {
    e.target.value = 1;
  }
  Level = e.target.value;
  updatePB();
  updateSkillVals();
});

[STR, DEX, CON, INT, WIS, CHA].forEach((item) =>
  item.addEventListener("input", (e) => {
    if (e.target.value > 30) {
      e.target.value = 30;
    }
    if (e.target.value < 1) {
      e.target.value = 1;
    }
    updateCharacteristicMods();
    updateSkillVals();
  })
);

function updatePB() {
  PB.innerHTML = "+" + getPB(Level).toString();
}

function updateCharacteristicMods() {
  document.getElementById("strMod").innerHTML =
    getValueModifier(+STR.value) > 0
      ? `+${getValueModifier(+STR.value)}`
      : `${getValueModifier(+STR.value)}`;

  document.getElementById("Initiative").innerHTML = document.getElementById(
    "dexMod"
  ).innerHTML =
    getValueModifier(+DEX.value) > 0
      ? `+${getValueModifier(+DEX.value)}`
      : `${getValueModifier(+DEX.value)}`;

  document.getElementById("conMod").innerHTML =
    getValueModifier(+CON.value) > 0
      ? `+${getValueModifier(+CON.value)}`
      : `${getValueModifier(+CON.value)}`;

  document.getElementById("intMod").innerHTML =
    getValueModifier(+INT.value) > 0
      ? `+${getValueModifier(+INT.value)}`
      : `${getValueModifier(+INT.value)}`;

  document.getElementById("wisMod").innerHTML =
    getValueModifier(+WIS.value) > 0
      ? `+${getValueModifier(+WIS.value)}`
      : `${getValueModifier(+WIS.value)}`;

  document.getElementById("chaMod").innerHTML =
    getValueModifier(+CHA.value) > 0
      ? `+${getValueModifier(+CHA.value)}`
      : `${getValueModifier(+CHA.value)}`;
}

function updateSkillVals() {
  for (let i = 0; i < skillList.length; i++) {
    let val =
      getValueModifier(parseInt(getSkillCharacteristic(i).value)) +
      (skillCBList[i].checked ? getPB(Level) : 0);
    skillList[i].innerHTML = val > 0 ? `+${val}` : `${val}`;
  }
}

function getValueModifier(value) {
  return Math.floor(value / 2) - 5;
}
function getPB(level) {
  return Math.ceil(level / 4) + 1;
}

function getSkillCharacteristic(numberInList) {
  if ([0, 1].indexOf(numberInList) !== -1) return STR;
  if ([2, 3, 4, 5].indexOf(numberInList) !== -1) return DEX;
  if (numberInList == 6) return CON;
  if ([7, 8, 9, 10, 11, 12].indexOf(numberInList) !== -1) return INT;
  if ([13, 14, 15, 16, 17, 18].indexOf(numberInList) !== -1) return WIS;
  if ([19, 20, 21, 22, 23].indexOf(numberInList) !== -1) return CHA;
}
