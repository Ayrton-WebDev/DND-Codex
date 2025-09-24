fetch("../jsons/campaign.json")
  .then(res => res.json())
  .then(data => {
    const homebrewRules = data.homebrew?.rules || [];
    const rules = document.getElementById("rules");

    if (!rules) return;

    // Clear the existing content
    rules.innerHTML = `<h1>The Homebrew Rules of Takairim</h1>`;

    // Add each rule
    homebrewRules.forEach(rule => {
      const ruleContainer = document.createElement("div");
      ruleContainer.classList.add("homebrew-rule");

      const title = document.createElement("h2");
      title.innerText = rule.title;

      const description = document.createElement("p");
      description.innerText = rule.description;

      ruleContainer.appendChild(title);
      ruleContainer.appendChild(description);

      // Append to the correct element
      rules.appendChild(ruleContainer);
    });
  })
  .catch(err => console.error("Error loading homebrew rules:", err));

