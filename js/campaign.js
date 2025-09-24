fetch("../jsons/campaign.json")
  .then(res => res.json())
  .then(data => {
    Object.entries(data.characters).forEach(([key, char]) => {
      const missionList = document.getElementById(`${key}-mission-list`);
      missionList.innerHTML = "";

      let completedCount = 0;
      let totalCount = 0;

      char.story_arcs.forEach(arc => {
        // Arc title (show ??? if not revealed)
        const arcTitle = document.createElement("h4");
        arcTitle.innerText = arc.revealed ? arc.arc_name : "???";
        missionList.appendChild(arcTitle);

        const ul = document.createElement("ul");

        arc.missions.forEach(mission => {
          totalCount++;
          const li = document.createElement("li");
          li.innerText = mission.completed ? mission.mission : "?????";
          if (mission.completed) {
            li.classList.add("completed");
            completedCount++;
          }
          ul.appendChild(li);
        });

        missionList.appendChild(ul);
      });

      // Progress %
      const percent = totalCount > 0
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

      document.getElementById(`${key}-bar`).style.width = percent + "%";
      document.getElementById(`${key}-progress-text`).innerText =
        `${completedCount}/${totalCount} (${percent}%)`;
    });
  
  })
  .catch(err => console.error("Error loading missions:", err));
    // campaign progress bar
  fetch("../jsons/campaign.json")
  .then(res => res.json())
  .then(data => {
    let completedCount = 0;
    let totalCount = 0;

    // Count all character missions
    Object.entries(data.characters).forEach(([key, char]) => {
      if (!char.story_arcs) return;
      char.story_arcs.forEach(arc => {
        arc.missions.forEach(mission => {
          totalCount++;
          if (mission.completed) completedCount++;
        });
      });
    });

    // Count main story missions
    const campaignMissions = data.characters.campaign?.story_missions || [];
    campaignMissions.forEach(mission => {
      // Only count missions flagged as main_story
      if (mission.main_story) {
        totalCount++;
        if (mission.completed) completedCount++;
      }
    });

    // Calculate percentage
    const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    // Update the progress bar
    const campaignBar = document.getElementById("campaign-bar");
    const campaignText = document.getElementById("campaign-progress-text");
    if (campaignBar) campaignBar.style.width = percent + "%";
    if (campaignText) campaignText.innerText = `${percent}%`;
  })
  .catch(err => console.error("Error loading missions:", err));


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

