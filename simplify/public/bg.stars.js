(() => {
  const cvs = document.getElementById('sky');
  if (!cvs) return;
  const ctx = cvs.getContext('2d', { alpha: true });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0, stars = [], comets = [], raf = 0;

  function resize(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = cvs.getBoundingClientRect();
    cvs.width  = Math.floor(rect.width  * dpr);
    cvs.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    W = rect.width; H = rect.height;

    const count = Math.min(600, Math.max(160, Math.floor((W*H)/5000)));
    stars = Array.from({length: count}, () => ({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.2 + 0.3,
      tw: Math.random()*Math.PI*2,
      sp: 0.02 + Math.random()*0.025
    }));
  }

  function drawStars(t){
    ctx.save();
    for (const s of stars){
      const alpha = 0.55 + 0.45 * Math.sin(s.tw + t*s.sp);
      ctx.globalAlpha = 0.35 * alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
    ctx.restore();
  }

  function spawnComet(){
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const y = Math.random() * (H * 0.6);
    const speed = 4 + Math.random()*3;
    comets.push({
      x: side === 'left' ? -50 : W + 50,
      y,
      vx: side === 'left' ? speed : -speed,
      vy: 0.6 + Math.random()*0.4,
      life: 0,
      max: 200 + Math.random()*120
    });
  }

  function drawComets(){
    ctx.save();
    for (let i = comets.length-1; i >= 0; i--){
      const c = comets[i];
      c.x += c.vx; c.y += c.vy; c.life++;

      const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx*12, c.y - c.vy*12);
      grad.addColorStop(0, 'rgba(255,255,255,.95)');
      grad.addColorStop(1, 'rgba(120,180,255,0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - c.vx*12, c.y - c.vy*12);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 1.8, 0, Math.PI*2);
      ctx.fill();

      if (c.life > c.max || c.x < -80 || c.x > W+80 || c.y > H+80) comets.splice(i,1);
    }
    ctx.restore();
  }

  function loop(t){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    drawStars(t/16.7);
    drawComets();
    if (Math.random() < 0.006) spawnComet();
    raf = requestAnimationFrame(loop);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(cvs);
  window.addEventListener('resize', resize);

  resize();
  if (reduce){
    drawStars(0); // estático si reduce motion
  } else {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }
})();
