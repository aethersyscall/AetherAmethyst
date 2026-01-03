/*
 * CORE LOGIC
 */

let paletteData = null;
let currentTheme = "eclipse";

// Init
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./palette.json");
    paletteData = await response.json();
    renderPalette();
  } catch (e) {
    console.error("Failed to load palette.json", e);
  }
});

function setTheme(theme) {
  currentTheme = theme;
  document.body.setAttribute("data-theme", theme);

  // Update buttons
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    const isActive = btn.innerText.toLowerCase() === theme;
    btn.classList.toggle("active", isActive);
  });

  // Re-render palette grid if data is loaded
  if (paletteData) renderPalette();
}

function renderPalette() {
  const variant = paletteData.variants[currentTheme];
  const grid = document.getElementById("paletteGrid");
  grid.innerHTML = "";

  // Flatten the categories for display (Base, Syntax, Semantic)
  const categories = ["base", "syntax", "semantic"];

  categories.forEach((cat) => {
    if (!variant[cat]) return;

    Object.entries(variant[cat]).forEach(([key, hex]) => {
      grid.innerHTML += createHexCard(cat, key, hex);
    });
  });
}

function createHexCard(category, name, hex) {
  return `
        <div class="hex-card" onclick="copyHex('${hex}')">
            <div class="swatch" style="background: ${hex}"></div>
            <div class="hex-name">${category} • ${name}</div>
            <div class="hex-val">${hex}</div>
        </div>
    `;
}

function copyHex(hex) {
  navigator.clipboard.writeText(hex);
  showToast(`Copied ${hex}`);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function downloadJSON() {
  if (!paletteData) return;
  const jsonStr = JSON.stringify(paletteData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aether-amethyst.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
