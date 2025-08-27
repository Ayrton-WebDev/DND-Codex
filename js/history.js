document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eraKey = params.get("era");

  fetch("../jsons/world history.json")
    .then(res => res.json())
    .then(data => {
      const era = data.eras[eraKey];
      const eraTitle = document.getElementById("history-title");
      const eraContainer = document.getElementById("history-content");

      if (!era) {
        eraContainer.innerHTML = "<p>Era not found.</p>";
        return;
      }

      eraTitle.textContent = era.title;
      eraContainer.innerHTML = ""; // Clear existing content

      // Loop through blocks and append
      era.content.forEach(block => {
        const el = document.createElement(block.type);
        el.textContent = block.text;
        eraContainer.appendChild(el);
      });
    })
    .catch(err => console.error("Error loading history.json:", err));
});
