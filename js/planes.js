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
  {x: -7, y: 5},   // left
  {x: 7, y: 5},    // right
  {x: 0, y: -5}    // top
];
center.forEach((el, i) => {
  el.style.transform = `translate(${centerOffsets[i].x}vmin, ${centerOffsets[i].y}vmin)`;
});

// Mid ring (4 items)
placeRing('.mid-ring.ring1 a', 4, 23);

// Outer ring (24 items)
placeRing('.outer-ring a', 24, 35);
