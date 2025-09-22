(function(){
  const k='simplify_uses';
  const max=Number(window.SIMPLIFY_MAX_FREE||3);
  const get=()=>Number(localStorage.getItem(k)||0);
  const inc=()=>localStorage.setItem(k, get()+1);
  const chooseLink=()=>{
    const L=window.SIMPLIFY_PAYLINKS||{};
    return L.ONE||L.PACK10||L.SUB||'/legal/checkout.html';
  };
  const ofetch=window.fetch.bind(window);
  window.fetch=async function(u,o){
    const isAI= typeof u==='string' && u.includes('/api/ai') && String((o&&o.method)||'POST').toUpperCase()==='POST';
    if(isAI && get()>=max){
      alert('Has agotado tus 3 usos gratis. Te llevamos a Stripe para comprar créditos.');
      window.open(chooseLink(),'_blank');
      return new Response(JSON.stringify({ok:false,error:'Free quota exceeded'}),{status:402,headers:{'Content-Type':'application/json'}});
    }
    const r=await ofetch(u,o);
    if(isAI && r.ok){ try{inc();}catch{} }
    return r;
  };
})();
