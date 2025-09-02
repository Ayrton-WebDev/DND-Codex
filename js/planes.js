// Function to convert god name to human-readable format
function humanizeGodName(name) {
    if (!name) return '';
    return name
        .replace(/_/g, ' ')                  // Replace underscores with spaces
        .split(' ')                          // Split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');                          // Join back
}

// Function to position items in a circular ring
function placeRing(selector, count, radius) {
    const items = document.querySelectorAll(selector);
    items.forEach((el, i) => {
        const angle = (360 / count) * i;
        el.style.transform = `rotate(${angle}deg) translate(${radius}vmin) rotate(${-angle}deg)`;
    });
}

// Center circles (around center)
const center = document.querySelectorAll('.center-circle a');
const centerOffsets = [
    {x: -8, y: 7},   // left
    {x: 8, y: 7},    // right
    {x: 0, y: -7}    // top
];
center.forEach((el, i) => {
    el.style.transform = `translate(${centerOffsets[i].x}vmin, ${centerOffsets[i].y}vmin)`;
});

// Outer ring (14 items)
placeRing('.outer-ring a', 14, 35);

document.addEventListener('DOMContentLoaded', () => {
    fetch('../jsons/planes.json')
        .then(response => response.json())
        .then(data => {
            const planes = data.planes;
            const submenu = document.getElementById('planes-submenu');

            // Populate submenu with all planes
            for (const planeKey in planes) {
                const plane = planes[planeKey];
                const li = document.createElement('li');
                li.innerHTML = `<a href="?plane=${encodeURIComponent(planeKey)}">${plane.name}</a>`;
                submenu.appendChild(li);
            }

            // Get selected plane from query string
            const urlParams = new URLSearchParams(window.location.search);
            let planeKey = urlParams.get('plane') || Object.keys(planes)[0];
            planeKey = decodeURIComponent(planeKey);

            const plane = planes[planeKey];
            if (!plane) return;

            document.getElementById('plane-name').textContent = plane.name;
            document.getElementById('plane-description').textContent = plane.description;
            
            // Pull regions safely
            const cc = plane.regions.celestial_court;
            const dl = plane.regions.dread_lords;

            // Celestial Court region
            if (cc) {
                document.getElementById('cc-title').textContent = 'Celestial Court';
                document.getElementById('cc-domain-name').textContent = cc.name;
                document.getElementById('cc-god-name').textContent = cc.god ? 'God: ' + humanizeGodName(cc.god) : '';
                document.getElementById('cc-domain-description').textContent = cc.description;
            } else {
                document.getElementById('cc-title').textContent = '';
                document.getElementById('cc-domain-name').textContent = '';
                document.getElementById('cc-god-name').textContent = '';
                document.getElementById('cc-domain-description').textContent = '';
            }

           // Dread Lords
if (dl) {
    document.getElementById('dl-title').textContent = 'Dread Lords';
    document.getElementById('dl-domain-name').textContent = dl.name;
    document.getElementById('dl-god-name').textContent = dl.god ? 'God: ' + humanizeGodName(dl.god) : '';
    document.getElementById('dl-domain-description').textContent = dl.description;
} else {
    document.getElementById('dl-title').textContent = '';
    document.getElementById('dl-domain-name').textContent = '';
    document.getElementById('dl-god-name').textContent = '';
    document.getElementById('dl-domain-description').textContent = '';
}
})
        .catch(err => console.error('Error loading planes.json:', err));
});
