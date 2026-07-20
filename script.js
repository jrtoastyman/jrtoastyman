/* ══════════════════ MATRIX TERMINAL LOGIC SYSTEM ══════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const clockEl = document.getElementById('hud-clock');
  const cursorX = document.getElementById('cursor-x');
  const cursorY = document.getElementById('cursor-y');

  // ── 1. Telemetry Clock ──
  function updateClock() {
    const now = new Date();
    const timeString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    if (clockEl) clockEl.textContent = timeString;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ── 2. Cursor Coordinate Tracker ──
  document.addEventListener('mousemove', (e) => {
    if (cursorX) cursorX.textContent = String(e.clientX).padStart(4, '0');
    if (cursorY) cursorY.textContent = String(e.clientY).padStart(4, '0');
  });

  // ── 3. HTML5 Canvas Matrix Binary Rain ──
  initMatrixRain();

  // ── 4. Monospace Decrypt Hover Effect ──
  initDecryptEffect();
});

/* ── Falling Matrix Binary Rain Animation ── */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const fontSize = 15;
  let columns = Math.floor(width / fontSize);
  // Pre-fill the screen vertically with drops so rain starts instantly
  let yPositions = Array(columns).fill(0).map(() => Math.floor(Math.random() * (height / fontSize)) * fontSize - height);

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    
    // adjust yPositions array
    const oldLength = yPositions.length;
    if (oldLength < columns) {
      for (let i = oldLength; i < columns; i++) {
        yPositions.push(Math.floor(Math.random() * -100));
      }
    }
  });

  function draw() {
    // Draw semi-opaque black cover to leave trails
    ctx.fillStyle = 'rgba(5, 8, 6, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00ff66'; // Glowing Matrix Green
    ctx.font = `500 ${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < yPositions.length; i++) {
      // Binary numbers 0 and 1
      const text = Math.random() > 0.5 ? '1' : '0';
      const x = i * fontSize;
      const y = yPositions[i];

      // Draw character
      ctx.fillText(text, x, y);

      // Random trigger to reset stream position after off-screen
      if (y > height && Math.random() > 0.98) {
        yPositions[i] = 0;
      } else {
        yPositions[i] += fontSize;
      }
    }
  }

  // 24 frames per second for classic cinema matrix rain feel
  setInterval(draw, 40);
}

/* ── Scramble-to-Plaintext Hover Anim ── */
function initDecryptEffect() {
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach(card => {
    const heading = card.querySelector('.card-heading');
    if (!heading) return;
    
    const originalText = heading.textContent;
    let interval = null;
    
    card.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);
      
      interval = setInterval(() => {
        heading.textContent = originalText
          .split("")
          .map((char, index) => {
            // Preserve spacing, slashes, or commas
            if (char === " " || char === "/" || char === "." || char === ":") return char;
            
            if (index < iteration) {
              return originalText[index];
            }
            // Matrix Binary Accents
            return Math.random() > 0.5 ? "1" : "0";
          })
          .join("");
          
        if (iteration >= originalText.length) {
          clearInterval(interval);
          heading.textContent = originalText;
        }
        
        iteration += 1 / 1.5; // Scramble cycle speed
      }, 30);
    });
    
    card.addEventListener('mouseleave', () => {
      clearInterval(interval);
      heading.textContent = originalText;
    });
  });
}
