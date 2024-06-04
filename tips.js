const classLevelingButton = document.getElementById("levelsInformationButton");
const levelingTip = document.getElementById("levelingTip");

var classTable;

isLevelingOpened = true;

function updateTable() {
  getTable().then((data) => {
    classTable = data[0];
		classLevelingButton.dispatchEvent(new Event("click"));
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
  //console.log(e);
  //e.preventDefault();
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<dialog"));
  } else {
    if (
      classTable["explanations"][
        tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
      ] != undefined
    ) {

      let t = (100 / document.body.clientWidth * (tag.getBoundingClientRect().top + 0.02 * document.body.clientWidth));
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.55 * document.body.clientHeight) {
        t = 100 / document.body.clientWidth * (tag.getBoundingClientRect().top - 0.24 * document.body.clientWidth);
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
        `<span class="spellTip" onclick="SpellTip(this);">`
      )}</dialog>`;
    }
  }
}

function SpellTip(tag) {
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<dialog"));
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

      let typeColors = {
        Гром: "rgb(136, 102, 177);",
        Огонь: "rgb(234, 108, 0);",
        Холод: "rgb(136, 204, 227);",
        Кислота: "rgb(212, 222, 3);",
        Яд: "rgb(161, 183, 79);",
        Лучистый: "rgb(233, 201, 118);",
        Некротический: "rgb(105, 183, 135);",
        Сила: "rgb(183, 86, 87);",
        Психический: "rgb(225, 136, 201);",
        Колющий: "rgb(222, 222, 222);",
        Режущий: "rgb(222, 222, 222);",
        Дробящий: "rgb(222, 222, 222);",
				Электрический: "rgb(76, 129, 206);",
      };

      let lvlShift = 0;
      while (
        filteredSpell[Object.keys(filteredSpell)[0]][0].damage[
          Level - lvlShift
        ] == undefined
      ) {
        lvlShift++;
      }

			let t = (100 / document.body.clientWidth * (tag.getBoundingClientRect().top + 0.02 * document.body.clientWidth));
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.55 * document.body.clientHeight) {
        t = 100 / document.body.clientWidth * (tag.getBoundingClientRect().top - 0.24 * document.body.clientWidth);
      }

      tag.innerHTML += `<dialog open class="spell" onclick="event.stopPropagation();" style="top:${t}vw; left:${100/document.body.clientWidth * (tag.getBoundingClientRect().left + 0.01 * document.body.clientWidth)}vw;">
			<div class="spellInfo">
			<span class="spellName">${filteredSpell[Object.keys(filteredSpell)[0]][0].name}
			</span>
			<div class="spellDamage">
			<span class="spellDamageValue">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].damage[Level - lvlShift]}
			</span>
			<span class="spellDamageType" style="color:${typeColors[filteredSpell[Object.keys(filteredSpell)[0]][0].damageType]}">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].damageType}
			</span>
			</div>
			<span class="spellDescription">
			${filteredSpell[Object.keys(filteredSpell)[0]][0].description}
			</span>
			</div>
			</dialog>`;
    }
  }
}
