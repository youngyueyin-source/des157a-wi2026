(function () {
  "use strict";
  console.log("reading js");

  const scene = document.querySelector(".scene");
  const root = document.documentElement;

  const plants = Array.from(document.querySelectorAll(".plant"));

  const panel = document.querySelector(".panel");
  const closeBtn = document.querySelector(".panel__close");
  const collectBtn = document.querySelector("[data-collect]");
  const panelTitle = document.querySelector("[data-panel-title]");
  const panelNote = document.querySelector("[data-panel-note]");
  const panelImage = document.querySelector(".panel__image");

  const foundEl = document.querySelector("[data-found]");
  const totalEl = document.querySelector("[data-total]");

  // If your HTML changed and something is missing, don't hard-crash
  if (!scene) {
    console.warn("No .scene found — check your HTML class names.");
    return;
  }

  // total count in HUD
  if (totalEl) totalEl.textContent = String(plants.length);

  // Track which plant is currently open in the panel
  let activePlantBtn = null;

  // Track collected plants by their data-plant key
  const found = new Set();

  // Panel images
  const plantImages = {
    nightshade: "images/nightshade.png",
    lavender: "images/lavender.png",
    lily: "images/lily.png",
    oleander: "images/oleander.png",
    rosary: "images/pea.png"
  };

  // --------------------------
  // Flashlight follow
  // --------------------------
  function setFlashlightPosition(clientX, clientY) {
    const rect = scene.getBoundingClientRect();

    // Convert pointer coords to percentages inside scene
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // Clamp so it doesn't go too far outside
    const clampedX = Math.min(100, Math.max(0, x));
    const clampedY = Math.min(100, Math.max(0, y));

    root.style.setProperty("--fx", `${clampedX}%`);
    root.style.setProperty("--fy", `${clampedY}%`);

    // Also “light up” nearby plants
    highlightPlants(clientX, clientY);
  }

  function highlightPlants(clientX, clientY) {
    const r = getComputedStyle(root).getPropertyValue("--r").trim();
    const radiusPx = parseInt(r, 10) || 140;

    plants.forEach((btn) => {
      // collected plants stay visible (don't toggle is-lit off)
      if (btn.classList.contains("is-found")) return;

      const b = btn.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;

      const dx = cx - clientX;
      const dy = cy - clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      btn.classList.toggle("is-lit", dist < radiusPx * 0.9);
    });
  }

  // Mouse + touch support
  scene.addEventListener("mousemove", (e) => {
    setFlashlightPosition(e.clientX, e.clientY);
  });

  scene.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (!t) return;
      setFlashlightPosition(t.clientX, t.clientY);
    },
    { passive: true }
  );

  // Set a default position on load
  (function initFlashlight() {
    const rect = scene.getBoundingClientRect();
    setFlashlightPosition(rect.left + rect.width * 0.55, rect.top + rect.height * 0.45);
  })();

  // --------------------------
  // Panel open/close
  // --------------------------
  function openPanelFor(btn) {
    activePlantBtn = btn;

    const title = btn.dataset.title || "Unknown Plant";
    const note = btn.dataset.note || "—";
    const key = btn.dataset.plant;

    if (panelTitle) panelTitle.textContent = title;
    if (panelNote) panelNote.textContent = note;

    // Set panel image
    if (panelImage && plantImages[key]) {
      panelImage.style.backgroundImage = `url("${plantImages[key]}")`;
    } else if (panelImage) {
      panelImage.style.backgroundImage = "none";
    }

    // Update collect button depending on collected state
    if (collectBtn) {
      if (found.has(key)) {
        collectBtn.textContent = "already collected";
        collectBtn.disabled = true;
      } else {
        collectBtn.textContent = "collect specimen";
        collectBtn.disabled = false;
      }
    }

    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    activePlantBtn = null;
  }

  // Clicking a plant opens panel
  plants.forEach((btn) => {
    btn.addEventListener("click", () => openPanelFor(btn));
  });

  // Close interactions
  if (closeBtn) closeBtn.addEventListener("click", closePanel);

  panel.addEventListener("click", (e) => {
    // click outside panel__inner closes
    if (e.target === panel) closePanel();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  // Collect button logic
  if (collectBtn) {
    collectBtn.addEventListener("click", () => {
      if (!activePlantBtn) return;

      const key = activePlantBtn.dataset.plant;
      if (!key) return;

      found.add(key);
      activePlantBtn.classList.add("is-found");

      if (foundEl) foundEl.textContent = String(found.size);

      collectBtn.textContent = "collected ✓";
      collectBtn.disabled = true;

      // If all found, celebrate
      if (found.size === plants.length && panelNote) {
        panelNote.textContent =
          "you found them all! the forest feels less empty now. take in a deep breath of the fresh air. *inhale*, *exhale*. the smell of pine and wet dirt tickles your nose. it's now time to leave quietly.";
      }
    });
  }
})();