(function(){
  const KEY = 'simplify_admin';
  localStorage.setItem(KEY, 'true');        // siempre ON en local
  window.__SIMPLIFY_ADMIN__ = true;

  // Tecla toggle por si quieres apagar/encender
  window.addEventListener('keydown', (e)=>{
    if(e.ctrlKey && e.altKey && e.key.toLowerCase()==='a'){
      const on = !localStorage.getItem(KEY);
      if(on) localStorage.setItem(KEY,'true'); else localStorage.removeItem(KEY);
      window.__SIMPLIFY_ADMIN__ = on;
      const n = document.createElement('div');
      Object.assign(n.style,{position:'fixed',right:'16px',top:'16px',background:'rgba(0,0,0,.7)',color:'#fff',padding:'10px 14px',borderRadius:'10px',zIndex:9999,fontWeight:'800'});
      n.textContent = on?'Admin ACTIVADO':'Admin DESACTIVADO'; document.body.appendChild(n);
      setTimeout(()=>n.remove(),1500);
    }
  });

  // Oculta elementos de pago si tienen estas clases/atributos (opcional)
  document.querySelectorAll('[data-paywall], .paywall, .pricing-cta').forEach(el=> el.style.display='none');
})();
