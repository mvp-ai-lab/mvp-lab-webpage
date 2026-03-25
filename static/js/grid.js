(() => {
  const root = document.querySelector("[data-grid]");
  if (!root) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Match grid cell count to container aspect-ratio (1 / 0.9)
  const cols = window.innerWidth <= 720 ? 22 : 36;
  const rows = window.innerWidth <= 720 ? 20 : 32;
  const total = cols * rows;

  /* ── Create canvas ── */
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  root.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.requestAnimationFrame(resize);
  window.addEventListener("resize", resize);

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ── Load image → per-cell weight array ── */
  function loadImageWeights(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = cols; c.height = rows;
        const cx = c.getContext("2d");
        const imgAspect = img.width / img.height;
        const gridAspect = cols / rows;
        let sw = img.width, sh = img.height;
        if (imgAspect > gridAspect) sw = img.height * gridAspect;
        else sh = img.width / gridAspect;
        const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
        cx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
        const data = cx.getImageData(0, 0, cols, rows).data;
        const weights = new Float32Array(total);
        for (let i = 0; i < total; i++) {
          const idx = i * 4;
          const brightness = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
          weights[i] = clamp01(1 - brightness) * (data[idx + 3] / 255);
        }
        resolve(weights);
      };
      img.onerror = () => resolve(new Float32Array(total));
      img.src = src;
    });
  }

  const imageSrcs = (root.dataset.images || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!imageSrcs.length) return;

  Promise.all(imageSrcs.map(loadImageWeights)).then(startAnimation);

  function startAnimation(patternCache) {
    const HOLD = 3500, FADE = 1200;
    const CYCLE = HOLD + FADE;
    const TOTAL_CYCLE = CYCLE * patternCache.length;

    function getCurrentWeight(idx, time) {
      const t = time % TOTAL_CYCLE;
      const start = idx * CYCLE;
      const holdEnd = start + HOLD;
      const fadeEnd = start + CYCLE;
      const prevFadeStart = start - FADE;
      if (prevFadeStart < 0) {
        const ws = TOTAL_CYCLE + prevFadeStart;
        if (t >= ws) return clamp01((t - ws) / FADE);
      } else if (t >= prevFadeStart && t < start) {
        return clamp01((t - prevFadeStart) / FADE);
      }
      if (t >= start && t < holdEnd) return 1;
      if (t >= holdEnd && t < fadeEnd) return clamp01(1 - (t - holdEnd) / FADE);
      return 0;
    }

    /* ── Static render for reduced motion ── */
    if (reducedMotion) {
      resize();
      const rect = root.getBoundingClientRect();
      const cellW = rect.width / cols, cellH = rect.height / rows;
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (let i = 0; i < total; i++) {
        const w = patternCache[0][i];
        const col = i % cols, row = Math.floor(i / cols);
        const size = (0.15 + w * 0.85) * Math.min(cellW, cellH) * 0.8;
        const cx = col * cellW + cellW / 2, cy = row * cellH + cellH / 2;
        ctx.globalAlpha = 0.10 + w * 0.90;
        ctx.fillStyle = "#111";
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      }
      return;
    }

    /* ── Animation ── */
    const frame = (time) => {
      const rect = root.getBoundingClientRect();
      const cellW = rect.width / cols, cellH = rect.height / rows;
      const dotMax = Math.min(cellW, cellH) * 0.82;
      const t = time * 0.001;

      // Precompute pattern blend weights
      const pw = new Float32Array(patternCache.length);
      let anyActive = false;
      for (let p = 0; p < patternCache.length; p++) {
        pw[p] = getCurrentWeight(p, time);
        if (pw[p] > 0) anyActive = true;
      }

      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < total; i++) {
        const col = i % cols, row = Math.floor(i / cols);

        // Blend figure weight
        let figW = 0;
        for (let p = 0; p < patternCache.length; p++) {
          if (pw[p] > 0) figW += patternCache[p][i] * pw[p];
        }
        if (figW > 1) figW = 1;

        // Background wave
        const wave = (Math.sin(col * 0.5 + t * 1.2) +
                       Math.cos(row * 0.45 - t * 1.6) + 2) / 4;

        const inFig = figW > 0.02 ? 1 : 0;
        const scale = (0.12 + wave * 0.18) * (1 - inFig) + (0.15 + figW * 0.85) * inFig;
        const opacity = (0.06 + wave * 0.14) * (1 - inFig) + (0.10 + figW * 0.90) * inFig;

        const size = scale * dotMax;
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;

        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#111";
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      }

      window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
  }
})();
