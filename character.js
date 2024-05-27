const test = document.getElementById("test");
const portrait = document.getElementById("portrait");

async function createFetch(api, options) {
  return fetch(api, options).then((res) => {
    return res.json();
  });
}

const [classes, races, spells] = GetDataBase();

portrait.style.backgroundImage = `url("https://dnd-data-base.vercel.app/portrait/human-wizard-male")`;
portrait.style.borderRadius = "50%";

function GetDataBase() {
  var classes, races, spells;
  createFetch("https://dnd-data-base.vercel.app/classes", {
    method: "GET",
  }).then((data) => {
    classes = data;
  });

  createFetch("https://dnd-data-base.vercel.app/races", {
    method: "GET",
  }).then((data) => {
    races = data;
  });

  createFetch("https://dnd-data-base.vercel.app/spells", {
    method: "GET",
  }).then((data) => {
    spells = data;
  });
  return [classes, races, spells];
}
