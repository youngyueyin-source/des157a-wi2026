(function () {
  "use strict";
  console.log("reading js");

  // grab the main full-screen scene (the area to track the flashlight inside)
  const scene = document.querySelector(".scene");

  // root is used to update css variables like --fx and --fy for the flashlight mask
  const root = document.documentElement;

  // collect all plant buttons into an array so we can loop through them
  const plants = Array.from(document.querySelectorAll(".plant"));

  // panel elements (field notes ui)
  const panel = document.querySelector(".panel");
  const closeBtn = document.querySelector(".panel__close");
  const collectBtn = document.querySelector("[data-collect]");
  const panelTitle = document.querySelector("[data-panel-title]");
  const panelNote = document.querySelector("[data-panel-note]");
  const panelImage = document.querySelector(".panel__image");

  // hud elements (collected counter)
  const foundEl = document.querySelector("[data-found]");
  const totalEl = document.querySelector("[data-total]");

  // show total number of plants in the hud
  if (totalEl) {
    totalEl.textContent = String(plants.length);
  }

  // keep track of which plant was clicked most recently (the one shown in the panel)
  let activePlantBtn = null;

  // store which plants have been collected using a set (no duplicates)
  const found = new Set();

  // map each plant key (data-plant) to its image path for the panel field notes
  const plantImages = {
    nightshade: "images/nightshade.png",
    lavender: "images/lavender.png",
    lily: "images/lily.png",
    oleander: "images/oleander.png",
    rosary: "images/pea.png"
  };

  // updates css variables for the flashlight position based on the cursor/touch location
  function setFlashlightPosition(clientX, clientY) {
    // get the scene's size and position on the page
    const rect = scene.getBoundingClientRect();

    // convert pointer position into percent values inside the scene
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // clamp values so the flashlight doesn't go outside the scene too far
    const clampedX = Math.min(100, Math.max(0, x));
    const clampedY = Math.min(100, Math.max(0, y));

    // set css vars so your .darkness mask follows the pointer
    root.style.setProperty("--fx", `${clampedX}%`);
    root.style.setProperty("--fy", `${clampedY}%`);

    // decide which plants are close enough to the flashlight to be revealed
    highlightPlants(clientX, clientY);
  }

  // reveals plants when the cursor is near them (inside the flashlight radius)
  function highlightPlants(clientX, clientY) {
    // read the flashlight radius from css (example: "140px")
    const r = getComputedStyle(root).getPropertyValue("--r").trim();
    const radiusPx = parseInt(r, 10) || 140;

    plants.forEach((btn) => {
      // collected plants should stay visible, so don't toggle is-lit off for them
      if (btn.classList.contains("is-found")) {
        return;
      }

      // find the plant button center point
      const b = btn.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;

      // measure distance from cursor to plant center
      const dx = cx - clientX;
      const dy = cy - clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // if it's close enough, add is-lit; otherwise remove is-lit
      btn.classList.toggle("is-lit", dist < radiusPx * 0.9);
    });
  }

  // mouse move updates flashlight position continuously
  scene.addEventListener("mousemove", (e) => {
    setFlashlightPosition(e.clientX, e.clientY);
  });

  // touch move updates flashlight position on phones/tablets
  scene.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (!t) return;
      setFlashlightPosition(t.clientX, t.clientY);
    },
    { passive: true }
  );

  // set an initial flashlight position so it doesn't start at (0,0)
  (function initFlashlight() {
    const rect = scene.getBoundingClientRect();
    setFlashlightPosition(rect.left + rect.width * 0.55, rect.top + rect.height * 0.45);
  })();

  // opens the field notes panel for the clicked plant
  function openPanelFor(btn) {
    // store which plant is active so the collect button knows what to collect
    activePlantBtn = btn;

    // pull content from the button's data attributes
    const title = btn.dataset.title || "unknown plant";
    const note = btn.dataset.note || "—";
    const key = btn.dataset.plant;

    // write the plant title and note into the panel
    if (panelTitle) panelTitle.textContent = title;
    if (panelNote) panelNote.textContent = note;

    // set the panel image based on the plant key
    if (panelImage && plantImages[key]) {
      panelImage.style.backgroundImage = `url("${plantImages[key]}")`;
    } else if (panelImage) {
      panelImage.style.backgroundImage = "none";
    }

    // update collect button state based on whether it's already collected
    if (collectBtn) {
      if (found.has(key)) {
        collectBtn.textContent = "already collected";
        collectBtn.disabled = true;
      } else {
        collectBtn.textContent = "collect specimen";
        collectBtn.disabled = false;
      }
    }

    // show the panel
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  // closes the field notes panel
  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    activePlantBtn = null;
  }

  // clicking any plant opens its field notes
  plants.forEach((btn) => {
    btn.addEventListener("click", () => openPanelFor(btn));
  });

  // close button closes the panel
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }

  // clicking outside the panel content closes it (clicking the dark overlay area)
  panel.addEventListener("click", (e) => {
    if (e.target === panel) {
      closePanel();
    }
  });

  // escape key closes the panel
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePanel();
    }
  });

  // collect button marks the active plant as collected and updates the hud
  if (collectBtn) {
    collectBtn.addEventListener("click", () => {
      // nothing to collect if no plant has been opened
      if (!activePlantBtn) return;

      // this gets the plant key from the active plant
      const key = activePlantBtn.dataset.plant;
      if (!key) return;

      // this adds to the collected set and mark it visually
      found.add(key);
      activePlantBtn.classList.add("is-found");

      // this update the hud count
      if (foundEl) {
        foundEl.textContent = String(found.size);
      }

      // this updates the button state to show success
      collectBtn.textContent = "collected ✓";
      collectBtn.disabled = true;

      // if all plants are collected, replace the note with an ending message
      if (found.size === plants.length && panelNote) {
        panelNote.textContent =
          "you found them all! the forest feels less empty now. take in a deep breath of the fresh air. inhale, exhale. the smell of pine and wet dirt tickles your nose. it's now time to leave quietly.";
      }
    });
  }
})();