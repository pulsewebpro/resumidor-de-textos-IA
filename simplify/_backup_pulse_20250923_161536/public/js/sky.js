(function(){
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
  const canvas = document.getElementById('sky') || (()=>{const c=document.createElement('canvas');c.id='sky';document.body.prepend(c);return c;})();
  const ctx = canvas.getContext('2d', { alpha:true });
  let W=0,H=0;
  const stars=[], comets=[], rocks=[];
  const STAR_COUNT_BASE = 220, COMET_CHANCE = 0.003, ROCK_COUNT = 10;
  function resize(){ W=Math.floor(innerWidth*dpr); H=Math.floor(innerHeight*dpr); canvas.width=W; canvas.height=H; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; }
  function r(a,b){ return Math.random()*(b-a)+a; }
  function star(){ const s=r(.02,.25); return {x:r(0,W),y:r(0,H),r:r(.4,1.8)*dpr,s,tw:r(0,Math.PI*2),tws:r(.005,.02)};}
  function comet(){ const t=Math.random()<.5; const x=t?r(-W*.2,W*.2):r(W*.8,W*1.2); const y=r(-H*.2,H*.2);
    const vx=t?r(3,5)*dpr:r(-5,-3)*dpr, vy=r(2,3.5)*dpr; return {x,y,vx,vy,life:1,tail:[]};}
  function rock(){ const size=r(2,5)*dpr; return {x:r(0,W),y:r(0,H),vx:r(-.08,.08)*dpr,vy:r(.02,.12)*dpr,r:size,rot:r(0,Math.PI*2),rs:r(-.01,.01)};}
  function init(){ resize(); stars.length=0; const n=Math.floor(STAR_COUNT_BASE*(Math.min(W,H)/900)); for(let i=0;i<n;i++) stars.push(star()); rocks.length=0; for(let i=0;i<ROCK_COUNT;i++) rocks.push(rock());}
  addEventListener('resize', resize);
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const st of stars){ st.y+=st.s; if(st.y>H){st.y=0; st.x=r(0,W);} st.tw+=st.tws; const a=(Math.sin(st.tw)*.5+.5)*.8+.2;
      ctx.globalAlpha=a; ctx.beginPath(); ctx.arc(st.x,st.y,st.r,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,.95)'; ctx.fill(); }
    if(Math.random()<COMET_CHANCE) comets.push(comet());
    for(let i=comets.length-1;i>=0;i--){ const c=comets[i]; c.x+=c.vx; c.y+=c.vy; c.life*=.995; c.tail.unshift({x:c.x,y:c.y}); if(c.tail.length>30)c.tail.pop();
      const g=ctx.createLinearGradient(c.x,c.y,c.x-c.vx*8,c.y-c.vy*8); g.addColorStop(0,'rgba(255,255,255,.9)'); g.addColorStop(1,'rgba(0,224,255,0)');
      ctx.strokeStyle=g; ctx.lineWidth=2*dpr; ctx.beginPath(); for(let t=0;t<c.tail.length;t++){ const p=c.tail[t]; t?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);} ctx.stroke();
      ctx.beginPath(); ctx.arc(c.x,c.y,1.6*dpr,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,.95)'; ctx.fill();
      if(c.life<.2||c.x<-W*.3||c.x>W*1.3||c.y>H*1.3) comets.splice(i,1);
    }
    ctx.save(); ctx.globalAlpha=.35;
    for(const rck of rocks){ rck.x+=rck.vx; rck.y+=rck.vy; rck.rot+=rck.rs; if(rck.y>H+40*dpr){ rck.y=-40*dpr; rck.x=r(0,W); }
      ctx.translate(rck.x,rck.y); ctx.rotate(rck.rot); ctx.fillStyle='rgba(160,180,200,.25)'; const R=rck.r;
      ctx.beginPath(); ctx.moveTo(-R,0); ctx.lineTo(-R*.3,-R*.8); ctx.lineTo(R*.8,-R*.2); ctx.lineTo(R*.5,R*.7); ctx.closePath(); ctx.fill(); ctx.setTransform(1,0,0,1,0,0);
    }
    ctx.restore(); requestAnimationFrame(draw);
  } init(); draw();
})();
