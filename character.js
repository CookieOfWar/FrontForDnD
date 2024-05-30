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

  updateSkillVals();
  updatePB();
  updateCharacteristicNames();
}

characterClass.addEventListener("change", (event) => {
  portrait.style.backgroundImage = `url("https://dnd-data-base.vercel.app/portrait/human-${event.target.value.toLowerCase()}-male")`;
  characterClass.style.backgroundImage = `url("./images/DicesClasses/${event.target.value.toLowerCase()}.png")`;
  console.log("changed");
});

skillCBList.forEach((item) => addEventListener("change", updateSkillVals));

function updatePB() {
  PB.innerHTML = "+" + getPB(Level).toString();
}

function updateCharacteristicNames() {
  document.getElementById("strMod").innerHTML =
    getValueModifier(parseInt(STR.innerHTML)) > 0
      ? `+${getValueModifier(parseInt(STR.innerHTML))}`
      : `${getValueModifier(parseInt(STR.innerHTML))}`;

  document.getElementById("dexMod").innerHTML =
    getValueModifier(parseInt(DEX.innerHTML)) > 0
      ? `+${getValueModifier(parseInt(DEX.innerHTML))}`
      : `${getValueModifier(parseInt(DEX.innerHTML))}`;

  document.getElementById("conMod").innerHTML =
    getValueModifier(parseInt(CON.innerHTML)) > 0
      ? `+${getValueModifier(parseInt(CON.innerHTML))}`
      : `${getValueModifier(parseInt(CON.innerHTML))}`;

  document.getElementById("intMod").innerHTML =
    getValueModifier(parseInt(INT.innerHTML)) > 0
      ? `+${getValueModifier(parseInt(INT.innerHTML))}`
      : `${getValueModifier(parseInt(INT.innerHTML))}`;

  document.getElementById("wisMod").innerHTML =
    getValueModifier(parseInt(WIS.innerHTML)) > 0
      ? `+${getValueModifier(parseInt(WIS.innerHTML))}`
      : `${getValueModifier(parseInt(WIS.innerHTML))}`;

  document.getElementById("chaMod").innerHTML =
    getValueModifier(parseInt(CHA.innerHTML)) > 0
      ? `+${getValueModifier(parseInt(CHA.innerHTML))}`
      : `${getValueModifier(parseInt(CHA.innerHTML))}`;
}

function updateSkillVals() {
  for (let i = 0; i < skillList.length; i++) {
    let val =
      getValueModifier(parseInt(getSkillCharacteristic(i).innerHTML)) +
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
