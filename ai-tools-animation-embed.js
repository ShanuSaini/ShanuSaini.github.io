(function () {
  var CONTAINER_ID = "il9j1ue";
  var STYLE_ID = "atai-animation-styles";

  var ICONS = {
    chatgpt: "https://shanusaini.github.io/images/ai_icons/chatgpt-icon.svg",
    claude: "https://shanusaini.github.io/images/ai_icons/claude-ai-icon.svg",
    gemini: "https://shanusaini.github.io/images/ai_icons/google-gemini-icon.png",
    perplexity: "https://shanusaini.github.io/images/ai_icons/perplexity-ai-icon.svg"
  };

  function iconImg(src, alt) {
    return '<img class="atai-tool-img" src="' + src + '" alt="' + alt + '" width="68" height="68" loading="lazy" decoding="async" />';
  }

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

#${CONTAINER_ID} .atai-aurora {
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  background:
    radial-gradient(ellipse 60% 50% at 30% 40%, rgba(139, 92, 246, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 70% 60%, rgba(59, 130, 246, 0.14) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 70%);
  animation: atai-aurora-shift 12s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;
}

#${CONTAINER_ID} .atai-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.28) 0%, transparent 52%),
    repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 84deg, rgba(99, 102, 241, 0.09) 84deg 90deg);
  animation: atai-glow-spin 80s linear infinite;
  pointer-events: none;
  z-index: 0;
}

#${CONTAINER_ID} .atai-scan {
  position: absolute;
  inset: 5%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(129, 140, 248, 0.12) 30deg, transparent 60deg);
  animation: atai-scan-sweep 6s linear infinite;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: screen;
}

#${CONTAINER_ID} .atai-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

#${CONTAINER_ID} .atai-particle {
  position: absolute;
  width: var(--size, 3px);
  height: var(--size, 3px);
  border-radius: 50%;
  background: rgba(165, 180, 252, 0.7);
  box-shadow: 0 0 6px rgba(165, 180, 252, 0.5);
  left: var(--x);
  top: var(--y);
  animation: atai-particle-float var(--dur) ease-in-out infinite;
  animation-delay: var(--delay);
}

#${CONTAINER_ID} .atai-particle-lg {
  --size: 5px;
  box-shadow: 0 0 10px rgba(129, 140, 248, 0.7);
}

#${CONTAINER_ID} .atai-radial-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  pointer-events: none;
  z-index: 2;
  animation: atai-glow-spin 80s linear infinite;
}

#${CONTAINER_ID} .atai-radial-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 150px;
  margin-left: -0.5px;
  transform-origin: top center;
  transform: rotate(var(--angle)) translateY(-150px);
  background: linear-gradient(to bottom, rgba(129, 140, 248, 0.35), transparent 85%);
  animation: atai-line-pulse 3s ease-in-out infinite;
  animation-delay: var(--line-delay, 0s);
}

#${CONTAINER_ID} .atai-orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

#${CONTAINER_ID} .atai-orbit-ring-1 {
  width: 300px;
  height: 300px;
  border: 1px solid rgba(99, 102, 241, 0.22);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.06), inset 0 0 20px rgba(99, 102, 241, 0.04);
  animation: atai-ring-pulse 4s ease-in-out infinite;
}

#${CONTAINER_ID} .atai-orbit-ring-2 {
  width: 340px;
  height: 340px;
  border: 1px dashed rgba(139, 92, 246, 0.16);
  animation: atai-ring-spin-reverse 50s linear infinite;
}

#${CONTAINER_ID} .atai-orbit-ring-3 {
  width: 380px;
  height: 380px;
  border: 1px solid rgba(99, 102, 241, 0.06);
  animation: atai-ring-spin-forward 70s linear infinite;
}

#${CONTAINER_ID} .atai-comet {
  position: absolute;
  top: 0;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  border-radius: 50%;
  background: #a5b4fc;
  box-shadow: 0 0 12px #818cf8, 0 0 24px rgba(129, 140, 248, 0.5);
  animation: atai-comet-pulse 2s ease-in-out infinite;
}

#${CONTAINER_ID} .atai-hub-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 108px;
  height: 108px;
  z-index: 6;
}

#${CONTAINER_ID} .atai-hub-ripple {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 1px solid rgba(129, 140, 248, 0.25);
  animation: atai-ripple 3s ease-out infinite;
}

#${CONTAINER_ID} .atai-hub-ripple:nth-child(2) { animation-delay: 1s; }
#${CONTAINER_ID} .atai-hub-ripple:nth-child(3) { animation-delay: 2s; }

#${CONTAINER_ID} .atai-hub-ring {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px dashed rgba(165, 180, 252, 0.2);
  animation: atai-hub-ring-spin 12s linear infinite;
}

#${CONTAINER_ID} .atai-hub {
  position: relative;
  width: 108px;
  height: 108px;
  filter: drop-shadow(0 0 28px rgba(99, 102, 241, 0.55));
  animation: atai-hub-pulse 3.5s ease-in-out infinite;
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
  animation: atai-orbit-spin 26s linear infinite;
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
  animation: atai-orbit-counter 26s linear infinite;
}

#${CONTAINER_ID} .atai-tool-icon {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 18px;
  overflow: visible;
  display: block;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  animation: atai-tool-bob 4s ease-in-out infinite;
  animation-delay: var(--bob-delay, 0s);
}

#${CONTAINER_ID} .atai-tool-icon::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 22px;
  background: var(--glow, rgba(99, 102, 241, 0.3));
  opacity: 0;
  filter: blur(10px);
  transition: opacity 0.35s ease;
  z-index: -1;
}

#${CONTAINER_ID} .atai-tool-icon::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

#${CONTAINER_ID} .atai-tool:hover .atai-tool-icon::before {
  opacity: 0.55;
}

#${CONTAINER_ID} .atai-tool-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 18px;
  position: relative;
  z-index: 1;
}

#${CONTAINER_ID} .atai-tool:hover .atai-tool-icon {
  transform: scale(1.12) translateY(-3px);
  box-shadow:
    0 16px 36px rgba(0, 0, 0, 0.5),
    0 0 28px var(--glow, rgba(99, 102, 241, 0.35));
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
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(165, 180, 252, 0.55);
  white-space: nowrap;
  z-index: 6;
  animation: atai-label-glow 4s ease-in-out infinite;
}

@keyframes atai-hub-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 28px rgba(99, 102, 241, 0.55));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 52px rgba(99, 102, 241, 0.9)) drop-shadow(0 0 80px rgba(139, 92, 246, 0.3));
    transform: scale(1.05);
  }
}

@keyframes atai-aurora-shift {
  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  100% { transform: scale(1.08) rotate(8deg); opacity: 1; }
}

@keyframes atai-scan-sweep {
  to { transform: rotate(360deg); }
}

@keyframes atai-line-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.7; }
}

@keyframes atai-ripple {
  0% { transform: scale(0.85); opacity: 0.7; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes atai-hub-ring-spin {
  to { transform: rotate(360deg); }
}

@keyframes atai-ring-spin-forward {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes atai-comet-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

@keyframes atai-label-glow {
  0%, 100% { opacity: 0.45; text-shadow: none; }
  50% { opacity: 0.75; text-shadow: 0 0 12px rgba(165, 180, 252, 0.4); }
}

@keyframes atai-ring-pulse {
  0%, 100% { border-color: rgba(99, 102, 241, 0.12); box-shadow: none; }
  50% { border-color: rgba(99, 102, 241, 0.28); box-shadow: 0 0 20px rgba(99, 102, 241, 0.08); }
}

@keyframes atai-ring-spin-reverse {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}

@keyframes atai-particle-float {
  0%, 100% { transform: translate(0, 0); opacity: 0.25; }
  50% { transform: translate(var(--dx), var(--dy)); opacity: 0.75; }
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
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.02); }
}

@media (max-width: 640px) {
  #${CONTAINER_ID} { min-height: 320px; }
  #${CONTAINER_ID} .atai-stage { max-width: 340px; }
  #${CONTAINER_ID} .atai-orbit-track,
  #${CONTAINER_ID} .atai-orbit-ring-1 { width: 240px; height: 240px; }
  #${CONTAINER_ID} .atai-orbit-ring-2 { width: 280px; height: 280px; }
  #${CONTAINER_ID} .atai-orbit-ring-3 { width: 320px; height: 320px; }
  #${CONTAINER_ID} .atai-radial-lines { width: 240px; height: 240px; margin: -120px 0 0 -120px; }
  #${CONTAINER_ID} .atai-radial-line { height: 120px; transform: rotate(var(--angle)) translateY(-120px); }
  #${CONTAINER_ID} .atai-hub-wrap { width: 88px; height: 88px; }
  #${CONTAINER_ID} .atai-orbit-track { margin: -120px 0 0 -120px; }
  #${CONTAINER_ID} .atai-hub { width: 88px; height: 88px; }
  #${CONTAINER_ID} .atai-hub svg { width: 88px; height: 88px; }
  #${CONTAINER_ID} .atai-tool-upright { width: 56px; height: 56px; margin-left: -28px; margin-top: -28px; }
  #${CONTAINER_ID} .atai-tool-icon { width: 56px; height: 56px; border-radius: 14px; }
}
`;

  var MARKUP =
    '<div class="atai-stage">' +
      '<div class="atai-aurora"></div>' +
      '<div class="atai-glow"></div>' +
      '<div class="atai-scan"></div>' +
      '<div class="atai-particles">' +
        '<span class="atai-particle" style="--x:12%;--y:18%;--dx:8px;--dy:-10px;--dur:5s;--delay:0s"></span>' +
        '<span class="atai-particle atai-particle-lg" style="--x:82%;--y:22%;--dx:-10px;--dy:8px;--dur:4s;--delay:0.8s"></span>' +
        '<span class="atai-particle" style="--x:28%;--y:78%;--dx:6px;--dy:6px;--dur:6s;--delay:1.2s"></span>' +
        '<span class="atai-particle atai-particle-lg" style="--x:72%;--y:75%;--dx:-8px;--dy:-6px;--dur:4.5s;--delay:0.4s"></span>' +
        '<span class="atai-particle" style="--x:50%;--y:8%;--dx:4px;--dy:10px;--dur:5.5s;--delay:1.6s"></span>' +
        '<span class="atai-particle" style="--x:8%;--y:55%;--dx:12px;--dy:-4px;--dur:3.8s;--delay:2s"></span>' +
        '<span class="atai-particle" style="--x:90%;--y:48%;--dx:-6px;--dy:12px;--dur:5.2s;--delay:0.2s"></span>' +
        '<span class="atai-particle atai-particle-lg" style="--x:38%;--y:12%;--dx:10px;--dy:6px;--dur:4.8s;--delay:1.4s"></span>' +
        '<span class="atai-particle" style="--x:62%;--y:88%;--dx:-8px;--dy:-10px;--dur:6.5s;--delay:2.4s"></span>' +
        '<span class="atai-particle" style="--x:20%;--y:35%;--dx:5px;--dy:-8px;--dur:4.2s;--delay:0.6s"></span>' +
      '</div>' +
      '<div class="atai-radial-lines">' +
        '<span class="atai-radial-line" style="--angle:0deg;--line-delay:0s"></span>' +
        '<span class="atai-radial-line" style="--angle:90deg;--line-delay:0.75s"></span>' +
        '<span class="atai-radial-line" style="--angle:180deg;--line-delay:1.5s"></span>' +
        '<span class="atai-radial-line" style="--angle:270deg;--line-delay:2.25s"></span>' +
      '</div>' +
      '<div class="atai-orbit-ring atai-orbit-ring-3"></div>' +
      '<div class="atai-orbit-ring atai-orbit-ring-2"><span class="atai-comet"></span></div>' +
      '<div class="atai-orbit-ring atai-orbit-ring-1"><span class="atai-comet" style="animation-delay:1s"></span></div>' +

      '<div class="atai-hub-wrap">' +
        '<span class="atai-hub-ripple"></span>' +
        '<span class="atai-hub-ripple"></span>' +
        '<span class="atai-hub-ripple"></span>' +
        '<span class="atai-hub-ring"></span>' +
        '<div class="atai-hub">' +
          '<svg viewBox="0 0 108 108" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<defs>' +
              '<radialGradient id="atai-hub-grad" cx="35%" cy="35%" r="65%">' +
                '<stop offset="0%" stop-color="#a5b4fc"/>' +
                '<stop offset="40%" stop-color="#6366f1"/>' +
                '<stop offset="100%" stop-color="#312e81"/>' +
              '</radialGradient>' +
              '<filter id="atai-hub-glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '</defs>' +
            '<circle cx="54" cy="54" r="50" fill="url(#atai-hub-grad)"/>' +
            '<circle cx="54" cy="54" r="50" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>' +
            '<circle cx="54" cy="54" r="38" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>' +
            '<text x="54" y="64" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="34" font-weight="800" fill="#ffffff" letter-spacing="2" filter="url(#atai-hub-glow)">AI</text>' +
          '</svg>' +
        '</div>' +
      '</div>' +

      '<div class="atai-orbit-track">' +
        '<div class="atai-orbit-spoke" style="--angle:0deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(255,255,255,0.3);--bob-delay:0s">' +
              '<div class="atai-tool-icon">' + iconImg(ICONS.chatgpt, "ChatGPT") + '</div>' +
              '<span class="atai-tool-label">ChatGPT</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="atai-orbit-spoke" style="--angle:90deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(198,108,240,0.4);--bob-delay:0.6s">' +
              '<div class="atai-tool-icon">' + iconImg(ICONS.gemini, "Gemini") + '</div>' +
              '<span class="atai-tool-label">Gemini</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="atai-orbit-spoke" style="--angle:180deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(255,255,255,0.25);--bob-delay:1.2s">' +
              '<div class="atai-tool-icon">' + iconImg(ICONS.perplexity, "Perplexity") + '</div>' +
              '<span class="atai-tool-label">Perplexity</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="atai-orbit-spoke" style="--angle:270deg">' +
          '<div class="atai-tool-upright">' +
            '<div class="atai-tool" style="--glow:rgba(217,119,87,0.45);--bob-delay:1.8s">' +
              '<div class="atai-tool-icon">' + iconImg(ICONS.claude, "Claude") + '</div>' +
              '<span class="atai-tool-label">Claude</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function injectStyles() {
    var style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.body || document.head).appendChild(style);
    }
    style.textContent = CSS;
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
