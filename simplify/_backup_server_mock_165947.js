import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json({limit:'1mb'}));

// Health
app.get('/api/health', (req,res)=> res.json({ok:true, service:'simplify', ts:Date.now()}));

// Mock AI (dev): devuelve el texto en “TL;DR” y “Puntos clave”
app.post('/api/ai', (req,res)=>{
  const input = (req.body?.text || '').trim();
  const tldr = input ? (input.split(/[.!?]\s/)[0] || input).slice(0,180) : 'Escribe algo para resumir.';
  const bullets = input ? input.split(/\n+/).filter(Boolean).slice(0,5) : [];
  res.json({
    ok:true,
    outputs:[
      {label:'TL;DR', content: tldr + (tldr.endsWith('.')?'':'.')},
      {label:'Puntos clave', content: bullets.map(b=>`• ${b}`).join('\n') || '• Sin puntos destacados.'}
    ]
  });
});

// Estático
app.use(express.static('public'));

const PORT = process.env.PORT || 5500;
app.listen(PORT, ()=>console.log('Dev server on http://localhost:'+PORT));
