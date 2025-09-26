(function(){
  const img = document.getElementById('pulse-side');
  if(!img) return;
  let rx = 0, ry = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    rx = (e.clientX - cx) / cx;      // -1..1
    ry = (e.clientY - cy) / cy;
  });
  function loop(){
    tx += (rx*8 - tx)*0.06;          // easing
    ty += (ry*6 - ty)*0.06;
    img.style.transform = `translate(${tx}px, ${-8+ty}px)`;  // -8px por la flotación base
    requestAnimationFrame(loop);
  }
  loop();
})();
