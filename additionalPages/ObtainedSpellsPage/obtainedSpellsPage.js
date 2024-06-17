document.getElementById("openSpellsButton").addEventListener("click", (e) => {
  if (
    getComputedStyle(document.getElementById("spellsPage")).display == "none"
  ) {
    document.getElementById("spellsPage").style.display = "block";
  } else {
    document.getElementById("spellsPage").style.display = "none";
  }
  if (
    getComputedStyle(document.getElementById("equipmentPage")).display ==
    "block"
  ) {
    document.getElementById("equipmentPage").style.display = "none";
  }
});

//couldn't do it with the forEach

document.getElementById("addSpell0").addEventListener("click", (e) => {
  addSpell(0);
});
document.getElementById("addSpell1").addEventListener("click", (e) => {
  addSpell(1);
});
document.getElementById("addSpell2").addEventListener("click", (e) => {
  addSpell(2);
});
document.getElementById("addSpell3").addEventListener("click", (e) => {
  addSpell(3);
});
document.getElementById("addSpell4").addEventListener("click", (e) => {
  addSpell(4);
});
document.getElementById("addSpell5").addEventListener("click", (e) => {
  addSpell(5);
});
document.getElementById("addSpell6").addEventListener("click", (e) => {
  addSpell(6);
});
document.getElementById("addSpell7").addEventListener("click", (e) => {
  addSpell(7);
});
document.getElementById("addSpell8").addEventListener("click", (e) => {
  addSpell(8);
});
document.getElementById("addSpell9").addEventListener("click", (e) => {
  addSpell(9);
});

document
  .getElementById("spellsOfCurrentLevelCloseButton")
  .addEventListener("click", (e) => {
    document.getElementById("spellsOfCurrentLevelDiv").style.display = "none";
  });

function addSpell(spellNumber) {
  let currList = document.getElementById("spellsList" + spellNumber);
  if (currList.querySelector("input") != null) {
    return;
  }
  let li = document.createElement("li");
  li.innerHTML = `
	<div class="obtainedSpell">
	<input type="text" class="spellName" autocomplete="off">
	<button class="linkSpellButton" onclick="linkSpell(this)"></button>
	<button class="addCustomSpellButton" onclick="addCustomSpell(this)" style="display: none;"></button>
	<button class="removeSpellButton">X</button>
	</div>
	`;
  document.getElementById("spellsList" + spellNumber).appendChild(li);
  updListenersOnSkillsInputs();
}

function updListenersOnSkillsInputs() {
  [...document.getElementsByClassName("spellName")].forEach((button) => {
    button.addEventListener("input", (e) => {
      if (e.target.value == "") {
        button.parentElement.querySelector(".linkSpellButton").style.display =
          "block";
        button.parentElement.querySelector(
          ".addCustomSpellButton"
        ).style.display = "none";
      } else {
        button.parentElement.querySelector(".linkSpellButton").style.display =
          "none";
        button.parentElement.querySelector(
          ".addCustomSpellButton"
        ).style.display = "block";
      }
    });
  });

  [...document.getElementsByClassName("removeSpellButton")].forEach(
    (button) => {
      button.addEventListener("click", (e) => {
        e.target.parentElement.remove();
        document.getElementById("spellsOfCurrentLevelDiv").style.display =
          "none";
      });
    }
  );

  [...document.getElementsByClassName("linkSpellButton")].forEach((button) => {
    button.addEventListener("click", (e) => linkSpell);
  });
}

function linkSpell(button) {
  document.getElementById("spellsOfCurrentLevelUl").innerHTML = "";

  filteredSpell = Object.keys(spells).reduce((acc, key) => {
    let filteredSpells = spells[key].filter(
      (spell) =>
        spell.classes.indexOf(
          document.getElementById("characterClass").options[
            document.getElementById("characterClass").selectedIndex
          ].text
        ) != -1
    );
    if (filteredSpells.length > 0) {
      acc[key] = filteredSpells;
    }
    return acc;
  }, {});
  filteredSpell[
    button.parentElement.parentElement.parentElement.id.slice(-1)
  ].forEach((spell) => {
    let li = document.createElement("li");
    li.innerHTML =
      `<span onclick='SpellTip(null, this, true, ${button.parentElement.parentElement.parentElement.id.slice(
        -1
      )});' style='cursor: pointer; font-weight: bold; text-decoration: underline; font-size: 1vw;'>` +
      spell.name +
      "</span>";
    document.getElementById("spellsOfCurrentLevelUl").appendChild(li);
  });
  document.getElementById("spellsOfCurrentLevelDiv").style.display = "block";
}

function createSpell(spell, linkedListId) {
  console.log(spell);

  document.querySelector("#spellsList" + linkedListId).innerHTML = document
    .querySelector("#spellsList" + linkedListId)
    .innerHTML.replace(
      `<input type="text" class="spellName" autocomplete="off">`,
      `<span class="spellName" onclick="SpellTip(null, this);" style="cursor: pointer; font-weight: bold; text-decoration: underline; font-size: 1vw; color: black;">${spell}</span>`
    )
    .replace(
      `<button class="linkSpellButton" onclick="linkSpell(this)"></button>`,
      ``
    )
    .replace(
      `<button class="linkSpellButton" onclick="linkSpell(this)" style="display: block;"></button>`,
      ``
    );
  document.getElementById("spellsOfCurrentLevelDiv").style.display = "none";
  updListenersOnSkillsInputs();
}
