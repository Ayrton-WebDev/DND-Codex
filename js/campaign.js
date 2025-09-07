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
