let cityData = {};

    // Load JSON
    fetch('locations.json')
      .then(res => res.json())
      .then(data => { cityData = data; });

    // Hook up pins
    document.querySelectorAll('.pin').forEach(pin => {
      pin.addEventListener('click', () => {
        const id = pin.getAttribute('data-id');
        const city = cityData[id];
        if (city) {
          const box = document.getElementById('infoBox');
          box.innerHTML = `
            <h2>${city.name}</h2>
            <img src="${city.image}" alt="${city.name}">
            <p><strong>Population:</strong> ${city.population}</p>
            <p>${city.description}</p>
          `;
          box.style.display = 'block';
          window.scrollTo({ top: box.offsetTop, behavior: 'smooth' });
        }
      });
    });