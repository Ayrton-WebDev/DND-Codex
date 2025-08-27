document.addEventListener("DOMContentLoaded", () => {
  // Get which continent was chosen from ?c=ulgrath
  const params = new URLSearchParams(window.location.search);
  const continentKey = params.get("c");

  fetch("../jsons/locations.json")
    .then(res => res.json())
    .then(data => {
      const continent = data[continentKey];
      const infoBox = document.getElementById("infoBox");
      const mapImage = document.getElementById("continent-map");
      const mapContainer = document.querySelector(".map-container");
      const continentTitle = document.getElementById("continent-title");

      if (!continent) {
        infoBox.innerHTML = "<p>Continent not found.</p>";
        return;
      }

      // Set title + map image
      continentTitle.textContent = continent.default.title;
      mapImage.src = continent.default.image;

      // Default description
      infoBox.innerHTML = `
        <h2>${continent.default.title}</h2>
        <p>${continent.default.description}</p>
        <p>${continent.default.population}</p>
      `;

      // Place pins dynamically after image loads
      mapImage.onload = () => {
        // Clear any existing pins (optional)
        mapContainer.querySelectorAll(".pin").forEach(pin => pin.remove());

        Object.entries(continent.locations).forEach(([id, loc]) => {
          const pin = document.createElement("div");
          pin.className = "pin";
          pin.style.top = loc.coords.top;
          pin.style.left = loc.coords.left;
          pin.title = loc.name;

          pin.addEventListener("click", () => {
            infoBox.innerHTML = `
              <h2>${loc.name}</h2>
              <p>${loc.description}</p>
              <p><strong>Population:</strong> ${loc.population}</p>
              <img src="${loc.image}" alt="${loc.name}">
            `;
          });

          mapContainer.appendChild(pin);
        });
      };
    })
    .catch(err => {
      console.error("Error loading locations.json:", err);
      document.getElementById("infoBox").innerHTML = "<p>Error loading data.</p>";
    });
});
