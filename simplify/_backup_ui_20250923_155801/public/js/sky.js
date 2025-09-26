(function(){
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
  const canvas = document.getElementById('sky') || (()=>{const c=document.createElement('canvas');c.id='sky';document.body.prepend(c);return c;})();
  const ctx = canvas.getContext('2d', { alpha:true });
  let W=0,H=0;

  const stars=[], comets=[], rocks=[];
  const STAR_COUNT_BASE = 220;     // ajusta densidad
  const COMET_CHANCE = 0.003;      // probabilidad por frame
  const ROCK_COUNT = 10;           // “asteroides” lentos

  function resize(){
    W = Math.floor(innerWidth * dpr);
    H = Math.floor(innerHeight * dpr);
    canvas.width = W; canvas.height = H;
    canvas.style.width = innerWidth+'px';
    canvas.style.height = innerHeight+'px';
  }

  function rand(a,b){ return Math.random()*(b-a)+a; }

  function spawnStar(){
    const speed = rand(.02,.25);
    return {
      x: rand(0,W), y: rand(0,H),
      r: rand(.4,1.8)*dpr,
      s: speed, tw: rand(0,Math.PI*2), tws: rand(.005,.02)
    };
  }

  function spawnComet(){
    const fromTop = Math.random()<.5;
    const x = fromTop ? rand(-W*0.2, W*0.2) : rand(W*0.8, W*1.2);
    const y = fromTop ? rand(-H*0.2, H*0.2) : rand(-H*0.2, H*0.2);
    const vx = fromTop ? rand(3,5)*dpr : rand(-5,-3)*dpr;
    const vy = rand(2,3.5)*dpr;
    return { x, y, vx, vy, life: 1, tail: [] };
  }

  function spawnRock(){
    const size = rand(2,5)*dpr;
    return {
      x: rand(0,W), y: rand(0,H),
      vx: rand(-.08,.08)*dpr, vy: rand(.02,.12)*dpr,
      r: size, rot: rand(0,Math.PI*2), rs: rand(-.01,.01)
    };
  }

  function init(){
    resize();
    stars.length = 0;
    const starTarget = Math.floor(STAR_COUNT_BASE * (Math.min(W,H)/900));
    for(let i=0;i<starTarget;i++) stars.push(spawnStar());
    rocks.length = 0;
    for(let i=0;i<ROCK_COUNT;i++) rocks.push(spawnRock());
  }

  addEventListener('resize', ()=>{ resize(); });

  function draw(){
    // fondo transparente: el body ya pinta gradientes
    ctx.clearRect(0,0,W,H);

    // 1) Estrellas
    ctx.save();
    for(const st of stars){
      st.y += st.s; if(st.y>H) { st.y=0; st.x=rand(0,W); }
      st.tw += st.tws; const twinkle = (Math.sin(st.tw)*0.5+0.5)*0.8 + 0.2;
      ctx.globalAlpha = twinkle;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();
    }
    ctx.restore();

    // 2) Cometas
    if(Math.random()<COMET_CHANCE) comets.push(spawnComet());
    for(let i=comets.length-1;i>=0;i--){
      const c = comets[i];
      c.x += c.vx; c.y += c.vy; c.life *= 0.995;
      c.tail.unshift({x:c.x,y:c.y});
      if(c.tail.length>30) c.tail.pop();

      // cola
      const grad = ctx.createLinearGradient(c.x,c.y, c.x-c.vx*8, c.y-c.vy*8);
      grad.addColorStop(0,'rgba(255,255,255,0.9)');
      grad.addColorStop(1,'rgba(0,224,255,0.0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2*dpr; ctx.beginPath();
      for(let t=0;t<c.tail.length;t++){
        const p = c.tail[t];
        if(t===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
      }
      ctx.stroke();

      // núcleo
      ctx.beginPath(); ctx.arc(c.x,c.y, 1.6*dpr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();

      if(c.life<0.2 || c.x<-W*0.3 || c.x>W*1.3 || c.y>H*1.3) comets.splice(i,1);
    }

    // 3) “Asteroides” lejanos (parallax lento)
    ctx.save();
    ctx.globalAlpha = .35;
    for(const r of rocks){
      r.x += r.vx; r.y += r.vy; r.rot += r.rs;
      if(r.y>H+40*dpr) { r.y = -40*dpr; r.x = rand(0,W); }
      ctx.translate(r.x, r.y); ctx.rotate(r.rot);
      ctx.fillStyle = 'rgba(160,180,200,0.25)';
      ctx.beginPath();
      const R=r.r;
      ctx.moveTo(-R,0); ctx.lineTo(-R*0.3,-R*0.8); ctx.lineTo(R*0.8,-R*0.2);
      ctx.lineTo(R*0.5,R*0.7); ctx.closePath(); ctx.fill();
      ctx.setTransform(1,0,0,1,0,0);
    }
    ctx.restore();

    requestAnimationFrame(draw);
  }

  init(); draw();
})();
