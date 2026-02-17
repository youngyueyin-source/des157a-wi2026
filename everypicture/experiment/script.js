// this selects the overlay element which is the black layer covering the image
const overlay = document.querySelector(".overlay");
// this listens for mouse movement anywhere on the page
document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  // gets the current mouse position on the screen
  // e.clientX = horizontal position
  // e.clientY = vertical position

    // applies a radial gradient mask to the overlay
  // this creates a circular "hole" in the black layer
  // the hole follows the mouse position (x, y)
  overlay.style.maskImage =
    `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, black 100%)`;

    // this line is for Safari compatibility (WebKit browsers)
  overlay.style.webkitMaskImage =
    `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, black 100%)`;
});
