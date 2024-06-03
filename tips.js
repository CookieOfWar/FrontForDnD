const classLevelingButton = document.getElementById("levelsInformationButton");
const levelingTip = document.getElementById("levelingTip");

var classTable;

isLevelingOpened = false;

function updateTable() {
  getTable().then((data) => {
    classTable = data[0];
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
        `<span class="tableAbility" onclick="Test(this);">`
      ) +
      "<br>" +
      classTable["additionalInfo"];
  } else {
    levelingTip.style.display = "none";
    levelingTip.innerHTML = "";
  }
});

function Test(tag) {
  console.log(tag.innerHTML.indexOf("<"));
  if (tag.innerHTML.indexOf("<") != -1) {
    tag.innerHTML = tag.innerHTML.slice(0, tag.innerHTML.indexOf("<div"));
  } else {
    if (
      classTable["explanations"][
        tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
      ] != undefined ||
      classTable["explanations"][
        tag.innerHTML
          .toLowerCase()
          .replace(/ \([0-9а-яА-Я ]+\)/, "")
          .replace("е", "ё")
      ] != undefined
    ) {
      let t = -1;
      // tag.innerHTML += classTable["explanations"][tag.innerHTML.toLowerCase()];
      if (tag.getBoundingClientRect().top > 0.6 * document.body.clientHeight) {
        t = 0;
      }
      tag.innerHTML += `<div class="explanation" style="top:${
        t != -1 ? t : ""
      }vh;">${
        classTable["explanations"][
          tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "") !=
          undefined
            ? tag.innerHTML.toLowerCase().replace(/ \([0-9а-яА-Я ]+\)/, "")
            : tag.innerHTML
                .toLowerCase()
                .replace(/ \([0-9а-яА-Я ]+\)/, "")
                .replace("е", "ё")
        ]
      }</div>`;
    }
  }
}
