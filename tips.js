const classLevelingButton = document.getElementById("levelsInformationButton");
const levelingTip = document.getElementById("levelingTip");

var classTable;
var lastTag = null;
var lastSpell = null;

isLevelingOpened = false;

function updateTable() {
  getTable().then((data) => {
    classTable = data[0];
    // classLevelingButton.dispatchEvent(new Event("click"));
  });
}

async function getTable() {
  const res = await Promise.allSettled([
    createFetch(
      `https://dnd-data-base.vercel.app/class/${characterClass.value.toLowerCase()}`,
      {
        method: "GET",
      }
    ),
  ]);
  return res.reduce((arr, curr) => arr.concat(curr.value), []);
}

classLevelingButton.addEventListener("click", () => {
  isLevelingOpened = !isLevelingOpened;
  if (isLevelingOpened) {
    levelingTip.style.display = "block";
    levelingTip.innerHTML =
      classTable["table"].replaceAll(
        `<span class="tableAbility">`,
        `<span class="tableAbility" onclick="AbilityTip(event, this);">`
      ) +
      "<br>" +
      classTable["additionalInfo"];
  } else {
    levelingTip.style.display = "none";
    levelingTip.innerHTML = "";
  }
});

function AbilityTip(e, tag) {
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<dialog"));
    lastTag = null;
  } else {
    if (
      classTable["explanations"][
        tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
      ] != undefined
    ) {
      let t =
        (100 / document.body.clientWidth) *
        (tag.getBoundingClientRect().top + 0.02 * document.body.clientWidth);
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.55 * document.body.clientHeight) {
        t =
          (100 / document.body.clientWidth) *
          (tag.getBoundingClientRect().top - 0.24 * document.body.clientWidth);
      }

      if (lastTag == null) lastTag = tag;
      else {
        if (lastTag != tag) {
          AbilityTip(null, lastTag);
          lastTag = tag;
        }
      }

      tag.innerHTML += `<dialog open class="explanation" onclick="event.stopPropagation();" style="top:${
        t != -1 ? t : ""
      }vw;">${classTable["explanations"][
        tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "") !=
        undefined
          ? tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
          : tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)\/½/, "")
      ].replaceAll(
        `<span class="spellTip">`,
        `<span class="spellTip" onclick="SpellTip(event, this);">`
      )}</dialog>`;
    }
  }
}

function SpellTip(e, tag) {
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<dialog"));
    lastSpell = null;
  } else {
    filteredSpell = Object.keys(spells).reduce((acc, key) => {
      let filteredSpells = spells[key].filter(
        (spell) => spell.name.toLowerCase() === tag.innerHTML.toLowerCase()
      );
      if (filteredSpells.length) {
        acc[key] = filteredSpells;
      }
      return acc;
    }, {});
    if (Object.keys(filteredSpell).length > 0) {
      let typeColorsImages = {
        Гром: ["rgb(136, 102, 177);", `background-image: url('./images/thunderDamage.png');`],
        Огонь: ["rgb(234, 108, 0);", `background-image: url('./images/fireDamage.png');`],
        Холод: ["rgb(136, 204, 227);", `background-image: url('./images/coldDamage.png');`],
        Кислота: ["rgb(212, 222, 3);", `background-image: url('./images/acidDamage.png');`],
        Яд: ["rgb(161, 183, 79);", `background-image: url('./images/poisonDamage.png');`],
        Лучистый: ["rgb(233, 201, 118);", `background-image: url('./images/radiantDamage.png');`],
        Некротический: ["rgb(105, 183, 135);", `background-image: url('./images/necroticDamage.png');`],
        Сила: ["rgb(183, 86, 87);", `background-image: url('./images/forceDamage.png');`],
        Психический: ["rgb(225, 136, 201);", `background-image: url('./images/psychicDamage.png');`],
        Колющий: ["rgb(222, 222, 222);", `background-image: url('./images/piercingDamage.png');`],
        Режущий: ["rgb(222, 222, 222);", `background-image: url('./images/slashingDamage.png');`],
        Дробящий: ["rgb(222, 222, 222);", `background-image: url('./images/bludgeoningDamage.png');`],
        Электрический: ["rgb(76, 129, 206);", `background-image: url('./images/lighningDamage.png');`],
        Усиление: ["rgb(237, 234, 40);", `background-image: url('./images/boost.png');`],
				"": ["transparent", "background-image: none;"]
      };

      let lvlShift = 0;
      while (
        filteredSpell[Object.keys(filteredSpell)[0]][0].damage[
          Level - lvlShift
        ] == undefined
      ) {
        lvlShift++;
      }

      let t =
        (100 / document.body.clientWidth) *
        (tag.getBoundingClientRect().top + 0.02 * document.body.clientWidth);
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.55 * document.body.clientHeight) {
        t =
          (100 / document.body.clientWidth) *
          (tag.getBoundingClientRect().top - 0.24 * document.body.clientWidth);
      }

      if (lastSpell == null) lastSpell = tag;
      else {
        if (lastTag != tag) {
          SpellTip(null, lastSpell);
          lastSpell = tag;
        }
      }

      let durationColor = `color: rgb(129, 129, 129)`;
      if (filteredSpell[Object.keys(filteredSpell)[0]][0].concentration) {
        durationColor = `color: rgb(196, 110, 12);`;
      }

      let damageFont = `1vw`;
      if (filteredSpell[Object.keys(filteredSpell)[0]][0].damageType == "") {
        damageFont = `0`;
      }

      let actionIcon = ``;

      switch (filteredSpell[Object.keys(filteredSpell)[0]][0].time) {
        case "Действие":
          actionIcon = `<img src="./images/actionIcon.png" style="aspect-ratio: 1/1; width: 1.2vw">`;
          break;
        case "Бонусное действие":
          actionIcon = `<img src="./images/bonusActionIcon.png" style="aspect-ratio: 1/1; width: 1.2vw">`;
          break;
        case "Реакция":
          actionIcon = `<img src="./images/reactionIcon.png" style="aspect-ratio: 1/1; width: 1.2vw">`;
          break;
        default:
          break;
      }

      tag.innerHTML += `<dialog open class="spell" onclick="event.stopPropagation();" style="top:${t}vw; left:${
        (100 / document.body.clientWidth) *
        (tag.getBoundingClientRect().left + 0.01 * document.body.clientWidth)
      }vw;">
			<div class="spellInfo">
			<div class="spellTop">
			<span class="spellName">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].name}
			</span>

			<div class="spellIcon"></div>

			<div class="spellDamage" style="font-size: ${damageFont}">
			<span class="spellDamageValue">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].damage[Level - lvlShift]}
			</span>
			<span class="spellDamageType" style="color:${
        typeColorsImages[filteredSpell[Object.keys(filteredSpell)[0]][0].damageType][0]
      }">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].damageType}
			</span>
			</div>
			<span style="color: rgb(129, 129, 129)">
			Длительность: 
			</span>
			<span class="spellDuration" style="${durationColor}">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].duration}
			</span>
			</div>
			<div class="spellDescriptionDiv">
			<span class="spellDescription">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].description}
			</span>
			</div>
			<div class="spellBottom">
			<div class="spellRangeNclasses">
			<span class="spellRange">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].range}
			</span>
			<span class="spellClasses">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].classes}
			</span>
			</div>
			<div class="spellTimeLevel">
			<span class="spellTime">
			${actionIcon}
			${filteredSpell[Object.keys(filteredSpell)[0]][0].time}
			</span>
			</div>
			</div>
			</div>
			</dialog>`;

			let spellDiv = document.querySelector(".spell");
			let iconPos = (100 / document.body.clientWidth) * (spellDiv.getBoundingClientRect().left + spellDiv.offsetWidth - 0.05 * document.body.clientWidth);
			console.log(tag.getBoundingClientRect());

			tag.innerHTML = tag.innerHTML.replace(`<div class="spellIcon"></div>`, `<div class="spellIcon" style="${typeColorsImages[filteredSpell[Object.keys(filteredSpell)[0]][0].damageType][1]} left: ${iconPos}vw; top: ${(100 / document.body.clientWidth) * (spellDiv.getBoundingClientRect().top - 0.01 * document.body.clientWidth)}vw;"></div>`);
    }
  }
}
