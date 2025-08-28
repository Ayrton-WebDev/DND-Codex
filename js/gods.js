document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const godKey = params.get("g");

  const godNameElem = document.getElementById("god-name");
  const godTitleElem = document.getElementById("god-title");
  const godAlliedElem = document.getElementById("god-allied");
  const godDominionsElem = document.getElementById("god-dominions");
  const godAppearanceElem = document.getElementById("god-appearance");
  const godMythosElem = document.getElementById("god-mythos");
  const godGroupTitleElem = document.getElementById("god-group-title");
  const godGroupDescElem = document.getElementById("god-group-desc");

  fetch("../jsons/gods.json")
    .then(res => res.json())
    .then(data => {
      let god = null;
      let group = null;

      // Determine group
      // Determine group
    if (godKey?.startsWith("celestial_court")) {
        group = data.celestial_court.default;
        god = data.celestial_court.gods[godKey.replace("celestial_court.", "")] || null;
    } else if (godKey?.startsWith("dread_lords")) {
        group = data.dread_lords.default;
        god = data.dread_lords.gods[godKey.replace("dread_lords.", "")] || null;
    }

      if (!group) {
        godGroupTitleElem.textContent = "God group not found";
        godGroupDescElem.textContent = "";
        return;
      }

      // Set group info
      // Set group info only if no specific god is selected
if (!god) {
    godGroupTitleElem.textContent = group.title;
    godGroupDescElem.textContent = group.description;
} else {
    godGroupTitleElem.textContent = "";
    godGroupDescElem.textContent = "";
}


      // If a specific god exists, populate info, otherwise clear god fields
      if (god) {
        godNameElem.textContent = god.name;
        godTitleElem.textContent = god.title;
        godAlliedElem.textContent = `Allied: ${god.allied}`;
        godDominionsElem.textContent = `Dominions: ${god.dominions.join(", ")}`;
        godAppearanceElem.textContent = god.appearance;
        godMythosElem.textContent = god.mythos;
      } else {
        godNameElem.textContent = "";
        godTitleElem.textContent = "";
        godAlliedElem.textContent = "";
        godDominionsElem.textContent = "";
        godAppearanceElem.textContent = "";
        godMythosElem.textContent = "";
      }
    })
    .catch(err => console.error("Error loading gods.json:", err));
});
