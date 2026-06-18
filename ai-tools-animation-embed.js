(function () {
  var CONTAINER_ID = "il9j1ue";
  var STYLE_ID = "atai-animation-styles";

  /* ── Icon SVGs: replace each <path d="..."> with your real icon path ── */

  var SVG_CHATGPT =
    '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="48" height="48" rx="12" fill="#ffffff"/>' +
      '<path fill="#000000" d="M18 18h12v12H18z"/>' +
    '</svg>';

  var SVG_GEMINI =
    '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="48" height="48" rx="12" fill="#0a0a0a"/>' +
      '<path fill="#4285F4" d="M24 14l6 10H18z"/>' +
    '</svg>';

  var SVG_PERPLEXITY =
    '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="48" height="48" rx="12" fill="#1a1a1a"/>' +
      '<path fill="#ffffff" d="M18 18h12v12H18z"/>' +
    '</svg>';

  var SVG_CLAUDE =
    '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="48" height="48" rx="12" fill="#D97757"/>' +
      '<path fill="#ffffff" d="M18 18h12v12H18z"/>' +
    '</svg>';

  var CSS = `
#${CONTAINER_ID} {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 420px;
  overflow: hidden;
}

#${CONTAINER_ID} .atai-stage {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
}

#${CONTAINER_ID} .atai-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 58%),
    repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 84deg, rgba(99, 102, 241, 0.06) 84deg 90deg);
  animation: atai-glow-spin 60s linear infinite;
  pointer-events: none;
  z-index: 0;
}

#${CONTAINER_ID} .atai-orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

#${CONTAINER_ID} .atai-orbit-ring-1 {
  width: 300px;
  height: 300px;
}

#${CONTAINER_ID} .atai-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 108px;
  height: 108px;
  z-index: 6;
  filter: drop-shadow(0 0 28px rgba(99, 102, 241, 0.55));
  animation: atai-hub-pulse 3s ease-in-out infinite;
}

#${CONTAINER_ID} .atai-hub svg {
  width: 108px;
  height: 108px;
  display: block;
}

#${CONTAINER_ID} .atai-orbit-track {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  animation: atai-orbit-spin 22s linear infinite;
  z-index: 4;
  pointer-events: none;
}

#${CONTAINER_ID} .atai-orbit-spoke {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(var(--angle));
  pointer-events: none;
}

#${CONTAINER_ID} .atai-tool-upright {
  position: absolute;
  top: 0;
  left: 50%;
  width: 68px;
  height: 68px;
  margin-left: -34px;
  margin-top: -34px;
  transform: rotate(calc(-1 * var(--angle)));
  pointer-events: auto;
}

#${CONTAINER_ID} .atai-tool {
  position: relative;
  width: 100%;
  height: 100%;
  animation: atai-orbit-counter 22s linear infinite;
}

#${CONTAINER_ID} .atai-tool-icon {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  overflow: hidden;
  display: block;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: atai-tool-bob 3.5s ease-in-out infinite;
  animation-delay: var(--bob-delay, 0s);
}

#${CONTAINER_ID} .atai-tool-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

#${CONTAINER_ID} .atai-tool:hover .atai-tool-icon {
  transform: scale(1.1);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.45),
    0 0 24px var(--glow, rgba(99, 102, 241, 0.35));
}

#${CONTAINER_ID} .atai-tool-label {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  font-family: Inter, system-ui, sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.25s;
  background: rgba(15, 23, 42, 0.92);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

#${CONTAINER_ID} .atai-tool:hover .atai-tool-label {
  opacity: 1;
}

#${CONTAINER_ID} .atai-stage-label {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-family: Inter, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(165, 180, 252, 0.5);
  white-space: nowrap;
  z-index: 6;
}

@keyframes atai-hub-pulse {
  0%, 100% { filter: drop-shadow(0 0 28px rgba(99, 102, 241, 0.55)); }
  50% { filter: drop-shadow(0 0 42px rgba(99, 102, 241, 0.8)); }
}

@keyframes atai-glow-spin {
  to { transform: rotate(360deg); }
}

@keyframes atai-orbit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes atai-orbit-counter {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes atai-tool-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@media (max-width: 640px) {
  #${CONTAINER_ID} { min-height: 320px; }
  #${CONTAINER_ID} .atai-stage { max-width: 340px; }
  #${CONTAINER_ID} .atai-orbit-track,
  #${CONTAINER_ID} .atai-orbit-ring-1 { width: 240px; height: 240px; }
  #${CONTAINER_ID} .atai-orbit-track { margin: -120px 0 0 -120px; }
  #${CONTAINER_ID} .atai-hub { width: 88px; height: 88px; }
  #${CONTAINER_ID} .atai-hub svg { width: 88px; height: 88px; }
  #${CONTAINER_ID} .atai-tool-upright { width: 56px; height: 56px; margin-left: -28px; margin-top: -28px; }
  #${CONTAINER_ID} .atai-tool-icon { width: 56px; height: 56px; border-radius: 14px; }
}
`;

  var MARKUP =
    '<div class="atai-stage">' +
      '<div class="atai-glow"></div>' +
      '<div class="atai-orbit-ring atai-orbit-ring-1"></div>' +

      '<div class="atai-hub">' +
        '<svg viewBox="0 0 108 108" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<defs>' +
            '<radialGradient id="atai-hub-grad" cx="35%" cy="35%" r="65%">' +
              '<stop offset="0%" stop-color="#818cf8"/>' +
              '<stop offset="45%" stop-color="#6366f1"/>' +
              '<stop offset="100%" stop-color="#312e81"/>' +
            '</radialGradient>' +
          '</defs>' +
          '<circle cx="54" cy="54" r="50" fill="url(#atai-hub-grad)"/>' +
          '<circle cx="54" cy="54" r="50" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>' +
          '<text x="54" y="64" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff" letter-spacing="2">AI</text>' +
        '</svg>' +
      '</div>' +

      '<div class="atai-orbit-track">' +
        '<div class="atai-orbit-spoke" style="--angle:0deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(255,255,255,0.3);--bob-delay:0s">' +
              '<div class="atai-tool-icon">' + SVG_CHATGPT + '</div>' +
              '<span class="atai-tool-label">ChatGPT</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="atai-orbit-spoke" style="--angle:90deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(198,108,240,0.4);--bob-delay:0.6s">' +
              '<div class="atai-tool-icon">' + SVG_GEMINI + '</div>' +
              '<span class="atai-tool-label">Gemini</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="atai-orbit-spoke" style="--angle:180deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(255,255,255,0.25);--bob-delay:1.2s">' +
              '<div class="atai-tool-icon">' + SVG_PERPLEXITY + '</div>' +
              '<span class="atai-tool-label">Perplexity</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="atai-orbit-spoke" style="--angle:270deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(217,119,87,0.45);--bob-delay:1.8s">' +
              '<div class="atai-tool-icon">' + SVG_CLAUDE + '</div>' +
              '<span class="atai-tool-label">Claude</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<span class="atai-stage-label">Top AI Tools You\'ll Master</span>' +
    '</div>';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.body || document.head).appendChild(style);
  }

  function injectAnimation() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container || container.getAttribute("data-atai-ready") === "true") return;

    injectStyles();
    container.setAttribute("data-atai-ready", "true");
    container.innerHTML = MARKUP;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectAnimation);
  } else {
    injectAnimation();
  }

  window.aiToolsAnimation_mount = injectAnimation;
})();
