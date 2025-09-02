document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const godKey = params.get("g");

  const godNameElem = document.getElementById("god-name");
  const godAlliedElem = document.getElementById("god-allied");
  const godDominionsElem = document.getElementById("god-dominions");
  const godAppearanceElem = document.getElementById("god-appearance");
  const godHomePlaneElem = document.getElementById("god-home-plane");
  const godMythosElem = document.getElementById("god-mythos");
  const godGroupTitleElem = document.getElementById("god-group-title");
  const godGroupDescElem = document.getElementById("god-group-desc");

  // Load both JSON files
  Promise.all([
    fetch("../jsons/gods.json").then(res => res.json()),
    fetch("../jsons/planes.json").then(res => res.json())
  ])
    .then(([godsData, planesData]) => {
      let god = null;
      let group = null;

      if (godKey?.startsWith("celestial_court")) {
        group = godsData.celestial_court.default;
        god = godsData.celestial_court.gods[godKey.replace("celestial_court.", "")] || null;
      } else if (godKey?.startsWith("dread_lords")) {
        group = godsData.dread_lords.default;
        god = godsData.dread_lords.gods[godKey.replace("dread_lords.", "")] || null;
      }

      if (!group) {
        godGroupTitleElem.textContent = "God group not found";
        godGroupDescElem.textContent = "";
        return;
      }

      if (!god) {
        godGroupTitleElem.textContent = group.title;
        godGroupDescElem.textContent = group.description;
        return;
      }

      // Populate god data
      godNameElem.textContent = `${god.name} - ${god.title}`;
      godAlliedElem.textContent = `Allied: ${god.allied}`;
      godDominionsElem.textContent = `Dominions: ${god.dominions.join(", ")}`;
      godAppearanceElem.textContent = god.appearance;

      // 🔗 Handle Home Plane + Region with link
      if (god.home_region) {
        const [planeKey, sideKey] = god.home_region.split(".");
        const plane = planesData.planes[planeKey];
        const region = plane?.regions?.[sideKey];

        if (plane && region) {
          const planeName = plane.name;
          const regionName = region.name;

          // Create clickable link to the plane page
          godHomePlaneElem.innerHTML = `
            <strong>Plane:</strong> <a href="../Planes/planes.html?plane=${planeKey}">${planeName}</a><br>
            <strong>Region:</strong> ${regionName}<br>
            <em>${region.description}</em>
          `;
        } else {
          godHomePlaneElem.textContent = "Home Plane: Unknown";
        }
      } else {
        godHomePlaneElem.textContent = "Home Plane: Unknown";
      }

      // 🔖 Mythos blocks
      godMythosElem.innerHTML = "";
      if (Array.isArray(god.mythos)) {
        god.mythos.forEach(block => {
          const titleEl = document.createElement("h4");
          titleEl.textContent = block.title;

          const textEl = document.createElement("p");
          textEl.textContent = block.text;

          godMythosElem.appendChild(titleEl);
          godMythosElem.appendChild(textEl);
        });
      }
    })
    .catch(err => console.error("Error loading JSON:", err));
});

// Side menu toggles
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll("#side-menu .toggle");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = toggle.parentElement;
      const isOpen = parent.classList.contains("open");

      document.querySelectorAll("#side-menu .menu-parent").forEach(item => {
        item.classList.remove("open");
      });

      if (!isOpen) {
        parent.classList.add("open");
      }
    });
  });
});
