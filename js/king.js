// Get kingdom key from the URL (?kingdom=nudaskian_empire)
const params = new URLSearchParams(window.location.search);
const key = params.get("kingdom");

fetch("../jsons/king.json") // adjust path if needed
  .then(res => res.json())
  .then(data => {
    const kingdom = data.kingdoms[key];
    if (!kingdom) {
      document.getElementById("kingdom-name").innerText = "Kingdom not found";
      return;
    }

    // --- Basic Info ---
    document.getElementById("kingdom-name").innerText = kingdom.name;
    document.getElementById("kingdom-continent").innerText =
      "Territories: " + Object.keys(kingdom.territory.landmasses).join(", ");

    // --- Overview ---
    document.getElementById("kingdom-values").innerText =
      "Values: " + kingdom.culture.values.join(", ");
    document.getElementById("kingdom-overview").innerText =
      "Religion: " + kingdom.culture.religion;

      // --- Ruler ---
    document.getElementById("ruler").innerText =
      `${kingdom.ruler.title} ${kingdom.ruler.name} (${kingdom.ruler.dynasty})`;
    document.getElementById("ruler-description").innerText =
      `Traits: ${kingdom.ruler.traits.join(", ")}`;

       // --- culture ---
const cultureDiv = document.getElementById("culture");
cultureDiv.innerHTML = "<h2>Culture</h2>";

// Values
const cul = document.createElement("p");
cul.innerHTML = `<strong>Values:</strong> ${kingdom.culture.values.join(", ")}`;
cultureDiv.appendChild(cul);

// Symbols
const symHeader = document.createElement("h3");
symHeader.textContent = "Symbols";
cultureDiv.appendChild(symHeader);

Object.entries(kingdom.culture.symbols).forEach(([key, value]) => {
  const culCard = document.createElement("div");
  culCard.classList.add("culture-card");
  culCard.innerHTML = `
    <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</p>
  `;
  cultureDiv.appendChild(culCard);
});

// Religion
const reliHeader = document.createElement("h3");
reliHeader.textContent = "Religion";
cultureDiv.appendChild(reliHeader);

const reli = document.createElement("p");
reli.textContent = kingdom.culture.religion;
cultureDiv.appendChild(reli);


    // --- History ---
    const historyDiv = document.getElementById("kingdom-history");
    historyDiv.innerHTML = "";
    kingdom.history.forEach(event => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${event.era}:</strong> ${event.summary}`;
      historyDiv.appendChild(p);
    });

   // --- Politics ---
    const politicsDiv = document.getElementById("politics");
    politicsDiv.innerHTML = "<h2>Politics</h2>";
    const gov = document.createElement("p");
    gov.innerHTML = `<strong>Government:</strong> ${kingdom.politics.government}`;
    politicsDiv.appendChild(gov);

    const nobility = document.createElement("p");
    nobility.innerHTML = `<strong>Nobility:</strong> ${kingdom.politics.nobility.join(", ")}`;
    politicsDiv.appendChild(nobility);

    const relHeader = document.createElement("h3");
    relHeader.innerText = "Relationships:";
    politicsDiv.appendChild(relHeader);

    Object.entries(kingdom.politics.relationships).forEach(([other, desc]) => {
      const card = document.createElement("div");
      card.classList.add("relationship-card");
      card.innerHTML = `
        <h4>${other.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h4>
        <p>${desc}</p>
      `;
      politicsDiv.appendChild(card);   });
      
       const milHeader = document.createElement("h3");
        milHeader.innerText = "Military:";
        politicsDiv.appendChild(milHeader);

    Object.entries(kingdom.politics.military).forEach(([other, desc]) => {
      const milCard = document.createElement("div");
      milCard.classList.add("military-card");
      milCard.innerHTML = `
        <h4>${other.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h4>
        <p>${desc}</p>
      `;
      politicsDiv.appendChild(milCard);});
 

    // --- Territories ---
const territoryDiv = document.getElementById("territories");
territoryDiv.innerHTML = "<h2>Territories</h2>";

Object.entries(kingdom.territory.landmasses).forEach(([landName, landInfo]) => {
  const card = document.createElement("div");
  card.classList.add("territory-card");

  const cities = landInfo.major_cities
    .map(city => `${city.name} (${city.type})`)
    .join(", ");

  const notable = landInfo.notable_locations.join(", ");

  card.innerHTML = `
    <h3>${landName}</h3>
    <p>${landInfo.description}</p>
    <p><strong>Major Cities:</strong> ${cities}</p>
    <p><strong>Notable Locations:</strong> ${notable}</p>
  `;

  territoryDiv.appendChild(card);
});
  })
 .catch(err => console.error("Error loading kingdoms:", err));