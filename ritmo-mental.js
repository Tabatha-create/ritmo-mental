// ==================== NAVEGACIÓN ====================
// Se inicializa tras cargar el DOM para que querySelectorAll encuentre los elementos
let mainContent, allGames;
document.addEventListener('DOMContentLoaded', () => {
  mainContent = document.getElementById('main-content');
  allGames    = document.querySelectorAll('.game-section');
});

function irAlJuego(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }
function mostrarJuego(id){
  mainContent.classList.add('hidden');
  allGames.forEach(g=>g.classList.remove('active'));
  const g=document.getElementById(id);
  if(g){g.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  if(id==='juego-colores')  resetColores();
  if(id==='juego-refranes') cargarRefran();
  if(id==='juego-despensa') resetDespensa();
  if(id==='juego-intruso')  cargarIntruso();
  if(id==='juego-sopa')     iniciarSopa();
  if(id==='juego-sudoku')   initSudoku();
}
function volverMenu(){
  allGames.forEach(g=>g.classList.remove('active'));
  mainContent.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(()=>document.getElementById('actividades').scrollIntoView({behavior:'smooth'}),100);
}
function volverInicio(){
  allGames.forEach(g=>g.classList.remove('active'));
  mainContent.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

// ==================== FORMULARIO ====================
function enviarFormulario(){
  const n=document.getElementById('nombre').value.trim();
  const e=document.getElementById('email').value.trim();
  const m=document.getElementById('form-msg');
  if(!n||!e){m.textContent='⚠️ Por favor rellena los dos campos.';return;}
  m.textContent=`✅ ¡Gracias, ${n}! Pronto recibirás tus consejos.`;
  document.getElementById('nombre').value='';document.getElementById('email').value='';
}

// ==================== JUEGO 1: COLORES ====================
let colorSeq=[],colorPaso=0,colorWait=false;
const COLS=['rojo','azul','verde','amarillo'];
function resetColores(){colorSeq=[];colorPaso=0;colorWait=false;document.getElementById('colores-msg').textContent='Pulsa el botón para empezar';document.getElementById('start-colores').style.display='inline-block';document.getElementById('start-colores').textContent='Iniciar Secuencia';}
function iniciarColores(){document.getElementById('start-colores').style.display='none';colorSeq=[];colorPaso=0;colorWait=false;ampliarSeq();}
function ampliarSeq(){colorWait=false;colorPaso=0;colorSeq.push(COLS[Math.floor(Math.random()*4)]);document.getElementById('colores-msg').textContent='👀 Observa la secuencia...';showSeq(0);}
function showSeq(i){if(i>=colorSeq.length){setTimeout(()=>{document.getElementById('colores-msg').textContent='🖱️ ¡Ahora tú!';colorWait=true;},500);return;}setTimeout(()=>{const b=document.querySelector(`#juego-colores .color-box.${colorSeq[i]}`);if(b){b.classList.add('active');setTimeout(()=>{b.classList.remove('active');showSeq(i+1);},450);}},400);}
function clicColor(box){
  if(!colorWait)return;
  const c=box.dataset.color;
  box.classList.add('active');setTimeout(()=>box.classList.remove('active'),300);
  if(c!==colorSeq[colorPaso]){colorWait=false;document.getElementById('colores-msg').textContent=`❌ Incorrecto. Tenías ${colorSeq.length} pasos. ¡Inténtalo de nuevo!`;box.classList.add('shake');setTimeout(()=>box.classList.remove('shake'),400);document.getElementById('start-colores').style.display='inline-block';document.getElementById('start-colores').textContent='Reiniciar';return;}
  colorPaso++;
  if(colorPaso===colorSeq.length){colorWait=false;document.getElementById('colores-msg').textContent=`✅ ¡Perfecto! Nivel ${colorSeq.length} superado 🎉`;setTimeout(ampliarSeq,1400);}
}

// ==================== JUEGO 2: REFRANES ====================
const refranes=[
  {i:"A quien madruga...",f:"Dios le ayuda",o:["Dios le ayuda","todo le sale bien","suerte le da","el cielo espera"]},
  {i:"Más vale pájaro en mano...",f:"que ciento volando",o:["que ciento volando","que ninguno en casa","que dos en el árbol","que mil en el nido"]},
  {i:"No hay mal que...",f:"por bien no venga",o:["nunca acabe","por bien no venga","al cielo ascienda","dure cien años"]},
  {i:"En boca cerrada...",f:"no entran moscas",o:["la vida es bella","no entran moscas","todo es silencio","duerme el corazón"]},
  {i:"A caballo regalado...",f:"no le mires el diente",o:["dale de comer","no le mires el diente","siempre hay que montar","hazle una fiesta"]},
  {i:"El que mucho abarca...",f:"poco aprieta",o:["todo lo logra","poco aprieta","mucho consigue","siempre gana"]},
  {i:"Camarón que se duerme...",f:"se lo lleva la corriente",o:["se lo lleva la corriente","pierde el banco","no come","se moja"]},
  {i:"Ojos que no ven...",f:"corazón que no siente",o:["corazón que no siente","mente que no piensa","alma que no llora","cara que no miente"]},
  {i:"Más vale tarde...",f:"que nunca",o:["que nunca","que pronto","que siempre","que hoy"]},
  {i:"A mal tiempo...",f:"buena cara",o:["buena cara","buen sombrero","mala suerte","gran paraguas"]},
];
let refrUsados=[];
function cargarRefran(){
  if(refrUsados.length===refranes.length)refrUsados=[];
  let idx;do{idx=Math.floor(Math.random()*refranes.length);}while(refrUsados.includes(idx));refrUsados.push(idx);
  const r=refranes[idx];
  document.getElementById('refran-inicio').textContent=r.i;
  document.getElementById('refran-destino').textContent='   ?   ';
  document.getElementById('refran-feedback').textContent='';
  document.getElementById('next-refran').style.display='none';
  const g=document.getElementById('opciones-refranes');g.innerHTML='';
  [...r.o].sort(()=>Math.random()-.5).forEach(op=>{const b=document.createElement('button');b.className='opcion-btn';b.textContent=op;b.onclick=()=>elegirRefran(b,op,r.f);g.appendChild(b);});
}
function elegirRefran(btn,elegida,correcta){
  document.querySelectorAll('.opcion-btn').forEach(b=>b.onclick=null);
  btn.classList.add(elegida===correcta?'correcto':'incorrecto');
  if(elegida!==correcta)document.querySelectorAll('.opcion-btn').forEach(b=>{if(b.textContent===correcta)b.classList.add('correcto');});
  document.getElementById('refran-feedback').textContent=elegida===correcta?'✅ ¡Correcto! Muy bien.':`❌ La respuesta era: "${correcta}"`;
  document.getElementById('refran-destino').textContent=correcta;
  document.getElementById('next-refran').style.display='inline-block';
}
function siguienteRefran(){cargarRefran();}

// ==================== JUEGO 3: DESPENSA ====================
const PRODS=[{e:'🍎',n:'Manzana'},{e:'🥛',n:'Leche'},{e:'🍞',n:'Pan'},{e:'🧀',n:'Queso'},{e:'🥚',n:'Huevos'},{e:'🍊',n:'Naranja'},{e:'🍌',n:'Plátano'},{e:'🥩',n:'Carne'},{e:'🍅',n:'Tomate'},{e:'🧅',n:'Cebolla'},{e:'🥕',n:'Zanahoria'},{e:'🫙',n:'Mermelada'}];
let dLista=[],dFase='inicio',dSelec=[];
function resetDespensa(){dFase='inicio';dSelec=[];document.getElementById('lista-memorizar').innerHTML='';document.getElementById('estanteria').style.display='none';document.getElementById('lista-memorizar').style.display='flex';document.getElementById('despensa-msg').textContent='Haz clic en Iniciar para ver la lista';document.getElementById('start-despensa').style.display='inline-block';document.getElementById('start-despensa').textContent='Iniciar';document.getElementById('start-despensa').onclick=iniciarDespensa;document.getElementById('despensa-instr').textContent='Memoriza los productos y luego encuéntralos.';}
function iniciarDespensa(){dLista=[...PRODS].sort(()=>Math.random()-.5).slice(0,4);dFase='memorizar';dSelec=[];const el=document.getElementById('lista-memorizar');el.innerHTML='';dLista.forEach(p=>{const d=document.createElement('div');d.className='item-emoji';d.textContent=p.e;el.appendChild(d);});document.getElementById('despensa-instr').textContent='👀 Memoriza bien estos productos. Tienes 5 segundos.';document.getElementById('despensa-msg').textContent='';document.getElementById('start-despensa').style.display='none';let c=5;const iv=setInterval(()=>{c--;document.getElementById('despensa-msg').textContent=c>0?`⏱ ${c}...`:'';if(c<=0){clearInterval(iv);pasarAEstanteria();}},1000);}
function pasarAEstanteria(){document.getElementById('lista-memorizar').style.display='none';const est=document.getElementById('estanteria');est.style.display='flex';est.innerHTML='';document.getElementById('despensa-instr').textContent='🛒 Haz clic en los productos que estaban en la lista.';document.getElementById('despensa-msg').textContent=`Quedan ${dLista.length} por encontrar.`;dFase='elegir';dSelec=[];[...PRODS].sort(()=>Math.random()-.5).forEach(p=>{const d=document.createElement('div');d.className='item-emoji';d.textContent=p.e;d.title=p.n;d.onclick=()=>clicDespensa(d,p);est.appendChild(d);});}
function clicDespensa(el,p){if(dFase!=='elegir')return;if(dLista.some(x=>x.n===p.n)){el.classList.add('correcto-d');el.onclick=null;dSelec.push(p.n);if(dSelec.length===dLista.length){document.getElementById('despensa-msg').textContent='🎉 ¡Muy bien! Encontraste todos.';dFase='fin';document.getElementById('start-despensa').style.display='inline-block';document.getElementById('start-despensa').textContent='Jugar de nuevo';document.getElementById('start-despensa').onclick=resetDespensa;}else{document.getElementById('despensa-msg').textContent=`✅ ¡Correcto! Quedan ${dLista.length-dSelec.length}.`;}}else{el.classList.add('incorrecto-d','shake');setTimeout(()=>el.classList.remove('shake'),400);document.getElementById('despensa-msg').textContent='❌ Ese no estaba. ¡Sigue buscando!';setTimeout(()=>el.classList.remove('incorrecto-d'),900);}}

// ==================== JUEGO 4: INTRUSO ====================
const INTRUSOS=[
  {items:[{e:'🍎',n:'Manzana'},{e:'🍊',n:'Naranja'},{e:'🍋',n:'Limón'},{e:'🥕',n:'Zanahoria',x:true}]},
  {items:[{e:'🐟',n:'Pez'},{e:'🦈',n:'Tiburón'},{e:'🐙',n:'Pulpo'},{e:'🐔',n:'Gallina',x:true}]},
  {items:[{e:'🚗',n:'Coche'},{e:'✈️',n:'Avión'},{e:'🚢',n:'Barco'},{e:'🍕',n:'Pizza',x:true}]},
  {items:[{e:'🛋️',n:'Sofá'},{e:'🪑',n:'Silla'},{e:'🛏️',n:'Cama'},{e:'🐠',n:'Pez tropical',x:true}]},
  {items:[{e:'🎸',n:'Guitarra'},{e:'🎹',n:'Piano'},{e:'🥁',n:'Batería'},{e:'⚽',n:'Balón',x:true}]},
  {items:[{e:'🌹',n:'Rosa'},{e:'🌻',n:'Girasol'},{e:'🌷',n:'Tulipán'},{e:'🦊',n:'Zorro',x:true}]},
  {items:[{e:'🍰',n:'Tarta'},{e:'🍩',n:'Donut'},{e:'🍪',n:'Galleta'},{e:'🥦',n:'Brócoli',x:true}]},
  {items:[{e:'⚽',n:'Fútbol'},{e:'🎾',n:'Tenis'},{e:'🏀',n:'Baloncesto'},{e:'🎻',n:'Violín',x:true}]},
];
let intrusoUsados=[];
function cargarIntruso(){
  if(intrusoUsados.length===INTRUSOS.length)intrusoUsados=[];
  let idx;do{idx=Math.floor(Math.random()*INTRUSOS.length);}while(intrusoUsados.includes(idx));intrusoUsados.push(idx);
  const g=document.getElementById('intruso-grid');g.innerHTML='';
  document.getElementById('intruso-feedback').textContent='';document.getElementById('next-intruso').style.display='none';
  [...INTRUSOS[idx].items].sort(()=>Math.random()-.5).forEach(item=>{const d=document.createElement('div');d.className='intruso-item pop';d.innerHTML=`<span class="emoji">${item.e}</span>${item.n}`;d.onclick=()=>clicIntruso(d,item.x||false);g.appendChild(d);});
}
function clicIntruso(el,isX){
  document.querySelectorAll('.intruso-item').forEach(b=>b.onclick=null);
  if(isX){el.classList.add('correcto');document.getElementById('intruso-feedback').textContent='✅ ¡Correcto! Ese no encajaba.';}
  else{el.classList.add('incorrecto','shake');setTimeout(()=>el.classList.remove('shake'),400);document.getElementById('intruso-feedback').textContent='❌ Ese sí pertenece al grupo. Siguiente vez lo tendrás.';}
  document.getElementById('next-intruso').style.display='inline-block';
}
function siguienteIntruso(){cargarIntruso();}

// ==================== JUEGO 5: SOPA DE LETRAS ====================
const SOPAS_TEMAS={
  '🐾 Animales':[
    ['PERRO','GATO','CABALLO','CONEJO','LORO','TIGRE'],
    ['LEON','RANA','PATO','BUHO','LINCE','NUTRIA'],
    ['BALLENA','DELFIN','PULPO','SALMON','TORTUGA','LOBO'],
  ],
  '🍓 Frutas':[
    ['MANZANA','PERA','NARANJA','LIMON','UVA','MELON'],
    ['FRESA','CEREZA','SANDIA','MANGO','KIWI','CIRUELA'],
    ['PLATANO','HIGO','PAPAYA','GRANADA','MANDARINA','PINA'],
  ],
  '🌍 Países':[
    ['ESPANA','FRANCIA','ITALIA','GRECIA','AUSTRIA','BELGICA'],
    ['MEXICO','BRASIL','ARGENTINA','CHILE','COLOMBIA','PERU'],
    ['JAPON','CHINA','INDIA','RUSIA','CANADA','EGIPTO'],
  ],
  '🌸 Flores':[
    ['ROSA','TULIPAN','JAZMIN','CLAVEL','LIRIO','DALIA'],
    ['MARGARITA','GIRASOL','LAVANDA','AZALEA','VIOLETA','CAMELIA'],
    ['HORTENSIA','MAGNOLIA','CAPUCHINA','AMAPOLA','BEGONIA','LOTO'],
  ],
  '⚽ Deportes':[
    ['FUTBOL','TENIS','NATACION','CICLISMO','BOXEO','GOLF'],
    ['VOLEIBOL','BALONCESTO','ATLETISMO','ESQUI','JUDO','REMO'],
    ['PADEL','BADMINTON','ESGRIMA','RUGBY','SURF','HIPICA'],
  ],
};
const SOPA_N=12;
let sopaGrid=[],sopaEnc=[],sopaSel=[],sopaTema=null,sopaPalabras=[];

function iniciarSopa(){
  const temasEl=document.getElementById('sopa-temas');temasEl.innerHTML='';
  Object.keys(SOPAS_TEMAS).forEach((t,i)=>{
    const btn=document.createElement('button');btn.className='sopa-tema-btn'+(i===0?' activo':'');btn.textContent=t;
    btn.onclick=()=>{document.querySelectorAll('.sopa-tema-btn').forEach(b=>b.classList.remove('activo'));btn.classList.add('activo');cargarSopaTema(t);};
    temasEl.appendChild(btn);
  });
  cargarSopaTema(Object.keys(SOPAS_TEMAS)[0]);
}
function cargarSopaTema(tema){
  sopaTema=tema;
  const puzzles=SOPAS_TEMAS[tema];
  sopaPalabras=puzzles[Math.floor(Math.random()*puzzles.length)];
  buildSopa(sopaPalabras);
}
function nuevaSopaMismaTema(){if(sopaTema)cargarSopaTema(sopaTema);}
function buildSopa(palabras){
  sopaEnc=[];sopaSel=[];
  sopaGrid=Array.from({length:SOPA_N},()=>Array(SOPA_N).fill(''));
  // Directions: horizontal, vertical, diagonal-right, diagonal-left
  const dirs=[[0,1],[1,0],[1,1],[1,-1]];
  palabras.forEach(pal=>{
    let ok=false,t=0;
    while(!ok&&t<400){t++;
      const d=dirs[Math.floor(Math.random()*dirs.length)],len=pal.length;
      let r0,c0;
      const maxR=SOPA_N-(d[0]>0?len:0);
      const minC=d[1]<0?len-1:0;
      const maxC=d[1]>0?SOPA_N-len:d[1]<0?SOPA_N-1:SOPA_N;
      if(maxR<=0||maxC<minC){continue;}
      r0=Math.floor(Math.random()*maxR);
      c0=minC+Math.floor(Math.random()*(maxC-minC+1));
      let ok2=true;
      for(let i=0;i<len;i++){const r=r0+d[0]*i,c=c0+d[1]*i;if(r<0||r>=SOPA_N||c<0||c>=SOPA_N||sopaGrid[r][c]!==''&&sopaGrid[r][c]!==pal[i]){ok2=false;break;}}
      if(ok2){for(let i=0;i<len;i++){const r=r0+d[0]*i,c=c0+d[1]*i;sopaGrid[r][c]=pal[i];}ok=true;}
    }
  });
  const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let r=0;r<SOPA_N;r++)for(let c=0;c<SOPA_N;c++)if(sopaGrid[r][c]==='')sopaGrid[r][c]=abc[Math.floor(Math.random()*26)];
  // word list
  const ul=document.getElementById('lista-palabras');ul.innerHTML='';
  palabras.forEach(p=>{const li=document.createElement('li');li.textContent=p;li.id='pal-'+p;ul.appendChild(li);});
  // grid
  const gEl=document.getElementById('grid-sopa');gEl.innerHTML='';
  gEl.style.gridTemplateColumns=`repeat(${SOPA_N},1fr)`;
  for(let r=0;r<SOPA_N;r++)for(let c=0;c<SOPA_N;c++){
    const cell=document.createElement('div');cell.className='sopa-cell';cell.textContent=sopaGrid[r][c];cell.dataset.r=r;cell.dataset.c=c;
    cell.addEventListener('click',()=>clicSopa(cell,r,c));gEl.appendChild(cell);
  }
  document.getElementById('sopa-msg').textContent=`Encuentra las ${palabras.length} palabras. ¡Ánimo!`;
}
function clicSopa(cell,r,c){
  if(cell.classList.contains('found'))return;
  const key=`${r},${c}`;
  if(sopaSel.includes(key)){sopaSel=sopaSel.filter(k=>k!==key);cell.classList.remove('selected');}
  else{sopaSel.push(key);cell.classList.add('selected');}
  const str=sopaSel.map(k=>{const[rr,cc]=k.split(',').map(Number);return sopaGrid[rr][cc];}).join('');
  const rev=str.split('').reverse().join('');
  for(const pal of sopaPalabras){
    if(sopaEnc.includes(pal))continue;
    if(str===pal||rev===pal){
      sopaSel.forEach(k=>{const[rr,cc]=k.split(',').map(Number);const ce=document.querySelector(`.sopa-cell[data-r="${rr}"][data-c="${cc}"]`);if(ce){ce.classList.remove('selected');ce.classList.add('found');}});
      sopaSel=[];sopaEnc.push(pal);
      const li=document.getElementById('pal-'+pal);if(li)li.classList.add('encontrada');
      if(sopaEnc.length===sopaPalabras.length){document.getElementById('sopa-msg').textContent='🎉 ¡Enhorabuena! Encontraste todas las palabras.';}
      else{document.getElementById('sopa-msg').textContent=`✅ ¡"${pal}" encontrada! Quedan ${sopaPalabras.length-sopaEnc.length}.`;}
      return;
    }
  }
}

// ==================== JUEGO 6: SUDOKU ====================
// Multiple puzzles per difficulty level
const SUDOKUS={
  facil:[
    {g:[5,3,0,0,7,0,0,0,0, 6,0,0,1,9,5,0,0,0, 0,9,8,0,0,0,0,6,0, 8,0,0,0,6,0,0,0,3, 4,0,0,8,0,3,0,0,1, 7,0,0,0,2,0,0,0,6, 0,6,0,0,0,0,2,8,0, 0,0,0,4,1,9,0,0,5, 0,0,0,0,8,0,0,7,9],
     s:[5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7, 8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6, 9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9]},
    {g:[0,0,3,0,2,0,6,0,0, 9,0,0,3,0,5,0,0,1, 0,0,1,8,0,6,4,0,0, 0,0,8,1,0,2,9,0,0, 7,0,0,0,0,0,0,0,8, 0,0,6,7,0,8,2,0,0, 0,0,2,6,0,9,5,0,0, 8,0,0,2,0,3,0,0,9, 0,0,5,0,1,0,3,0,0],
     s:[4,8,3,9,2,1,6,5,7, 9,6,7,3,4,5,8,2,1, 2,5,1,8,7,6,4,9,3, 5,4,8,1,3,2,9,7,6, 7,2,9,5,6,4,1,3,8, 1,3,6,7,9,8,2,4,5, 3,7,2,6,8,9,5,1,4, 8,1,4,2,5,3,7,6,9, 6,9,5,4,1,7,3,8,2]},
    {g:[0,6,0,1,0,4,0,5,0, 0,0,8,3,0,5,6,0,0, 2,0,0,0,0,0,0,0,1, 8,0,0,4,0,7,0,0,6, 0,0,6,0,0,0,3,0,0, 7,0,0,9,0,1,0,0,4, 5,0,0,0,0,0,0,0,2, 0,0,7,2,0,6,9,0,0, 0,4,0,5,0,8,0,7,0],
     s:[9,6,3,1,7,4,2,5,8, 1,7,8,3,2,5,6,4,9, 2,5,4,6,8,9,7,3,1, 8,2,9,4,3,7,1,5,6, 4,1,6,8,5,2,3,9,7, 7,3,5,9,6,1,8,2,4, 5,9,1,7,4,3,4,6,2, 3,8,7,2,1,6,9,8,5, 6,4,2,5,9,8,1,7,3]},
  ],
  medio:[
    {g:[0,2,0,0,0,0,0,0,0, 0,0,0,6,0,0,0,0,3, 0,7,4,0,8,0,0,0,0, 0,0,0,0,0,3,0,0,2, 0,8,0,0,4,0,0,1,0, 6,0,0,5,0,0,0,0,0, 0,0,0,0,1,0,7,8,0, 5,0,0,0,0,9,0,0,0, 0,0,0,0,0,0,0,4,0],
     s:[1,2,6,4,3,7,9,5,8, 8,9,5,6,2,1,4,7,3, 3,7,4,9,8,5,1,2,6, 4,5,7,1,9,3,8,6,2, 9,8,3,2,4,6,5,1,7, 6,1,2,5,7,8,3,9,4, 2,6,9,3,1,4,7,8,5, 5,4,8,7,6,9,2,3,1, 7,3,1,8,5,2,6,4,9]},
    {g:[0,0,0,2,6,0,7,0,1, 6,8,0,0,7,0,0,9,0, 1,9,0,0,0,4,5,0,0, 8,2,0,1,0,0,0,4,0, 0,0,4,6,0,2,9,0,0, 0,5,0,0,0,3,0,2,8, 0,0,9,3,0,0,0,7,4, 0,4,0,0,5,0,0,3,6, 7,0,3,0,1,8,0,0,0],
     s:[4,3,5,2,6,9,7,8,1, 6,8,2,5,7,1,4,9,3, 1,9,7,8,3,4,5,6,2, 8,2,6,1,9,5,3,4,7, 3,7,4,6,8,2,9,1,5, 9,5,1,7,4,3,6,2,8, 5,1,9,3,2,6,8,7,4, 2,4,8,9,5,7,1,3,6, 7,6,3,4,1,8,2,5,9]},
  ],
  dificil:[
    {g:[8,0,0,0,0,0,0,0,0, 0,0,3,6,0,0,0,0,0, 0,7,0,0,9,0,2,0,0, 0,5,0,0,0,7,0,0,0, 0,0,0,0,4,5,7,0,0, 0,0,0,1,0,0,0,3,0, 0,0,1,0,0,0,0,6,8, 0,0,8,5,0,0,0,1,0, 0,9,0,0,0,0,4,0,0],
     s:[8,1,2,7,5,3,6,4,9, 9,4,3,6,8,2,1,7,5, 6,7,5,4,9,1,2,8,3, 1,5,4,2,3,7,8,9,6, 3,6,9,8,4,5,7,2,1, 2,8,7,1,6,9,5,3,4, 5,2,1,9,7,4,3,6,8, 4,3,8,5,2,6,9,1,7, 7,9,6,3,1,8,4,5,2]},
    {g:[0,0,0,0,0,0,0,0,1, 0,0,0,0,3,7,0,0,0, 0,5,0,6,0,0,9,0,0, 0,3,0,0,0,8,0,0,0, 0,0,9,0,0,0,7,0,0, 0,0,0,5,0,0,0,8,0, 0,0,4,0,0,9,0,3,0, 0,0,0,2,7,0,0,0,0, 6,0,0,0,0,0,0,0,0],
     s:[3,9,6,8,4,5,2,7,1, 1,4,2,9,3,7,8,5,6, 7,5,8,6,1,2,9,4,3, 4,3,5,7,9,8,6,1,2, 2,6,9,1,5,4,7,3,8, 8,1,7,5,2,3,4,9,6, 5,2,4,4,8,9,1,3,7, 9,8,1,2,7,6,3,6,4, 6,7,3,3,6,1,5,2,9]},
  ]
};

let sdNivel='facil',sdPuzzle=null,sdSelected=null,sdErrores=0,sdPistas=0,sdUser=[],sdGiven=new Set();

function elegirNivel(nv,btn){
  sdNivel=nv;
  document.querySelectorAll('.nivel-btn').forEach(b=>b.classList.remove('activo'));
  btn.classList.add('activo');
  nuevoSudoku();
}
function initSudoku(){
  document.querySelectorAll('.nivel-btn').forEach(b=>b.classList.remove('activo'));
  document.getElementById('btn-facil').classList.add('activo');
  sdNivel='facil';nuevoSudoku();
}
function nuevoSudoku(){
  const arr=SUDOKUS[sdNivel];sdPuzzle=arr[Math.floor(Math.random()*arr.length)];
  sdErrores=0;sdPistas=0;sdSelected=null;
  document.getElementById('sudoku-errores').textContent='0';
  document.getElementById('sudoku-pistas').textContent='0';
  document.getElementById('sudoku-msg').textContent='';
  document.getElementById('sudoku-msg').className='sudoku-msg';
  sdUser=[...sdPuzzle.g];sdGiven=new Set();sdPuzzle.g.forEach((v,i)=>{if(v!==0)sdGiven.add(i);});
  renderBoard();renderNumpad();
}
function renderBoard(){
  const bd=document.getElementById('sudoku-board');bd.innerHTML='';
  for(let i=0;i<81;i++){
    const r=Math.floor(i/9),c=i%9;
    const el=document.createElement('div');el.className='sudoku-cell';el.dataset.idx=i;
    if(c===2||c===5)el.classList.add('thick-right');
    if(r===2||r===5)el.classList.add('thick-bottom');
    if(sdGiven.has(i)){el.classList.add('given');el.textContent=sdUser[i];}
    else if(sdUser[i]!==0){el.textContent=sdUser[i];el.classList.add('filled');}
    el.addEventListener('click',()=>selectCell(el,i));
    bd.appendChild(el);
  }
  if(sdSelected!==null){
    const sel=document.querySelector(`.sudoku-cell[data-idx="${sdSelected}"]`);
    if(sel){sel.classList.add('selected');highlightRelated(sdSelected);}
  }
}
function renderNumpad(){
  const np=document.getElementById('sudoku-numpad');np.innerHTML='';
  for(let n=1;n<=9;n++){const b=document.createElement('button');b.className='num-btn';b.textContent=n;b.onclick=()=>inputNum(n);np.appendChild(b);}
  const erase=document.createElement('button');erase.className='num-btn special';erase.textContent='⌫ Borrar';erase.onclick=()=>inputNum(0);np.appendChild(erase);
  const hint=document.createElement('button');hint.className='num-btn special';hint.textContent='💡 Pista';hint.onclick=darPista;np.appendChild(hint);
}
function selectCell(el,idx){
  document.querySelectorAll('.sudoku-cell').forEach(c=>c.classList.remove('selected','highlight'));
  sdSelected=idx;el.classList.add('selected');highlightRelated(idx);
}
function highlightRelated(idx){
  const r=Math.floor(idx/9),c=idx%9,bR=Math.floor(r/3)*3,bC=Math.floor(c/3)*3;
  document.querySelectorAll('.sudoku-cell').forEach(ce=>{
    const ci=parseInt(ce.dataset.idx),cr=Math.floor(ci/9),cc=ci%9;
    if(ci!==idx&&(cr===r||cc===c||(Math.floor(cr/3)*3===bR&&Math.floor(cc/3)*3===bC)))ce.classList.add('highlight');
  });
}
function inputNum(num){
  if(sdSelected===null||sdGiven.has(sdSelected))return;
  const el=document.querySelector(`.sudoku-cell[data-idx="${sdSelected}"]`);if(!el)return;
  el.classList.remove('error');
  if(num===0){sdUser[sdSelected]=0;el.textContent='';el.classList.remove('filled');return;}
  sdUser[sdSelected]=num;el.textContent=num;
  if(sdPuzzle.s[sdSelected]===num){
    el.classList.add('filled');el.classList.remove('error');
    document.getElementById('sudoku-msg').textContent='';
    if(sdUser.every((v,i)=>v===sdPuzzle.s[i])){document.getElementById('sudoku-msg').textContent='🎉 ¡Enhorabuena! ¡Sudoku completado!';document.getElementById('sudoku-msg').className='sudoku-msg win-msg';}
  }else{
    el.classList.add('error');sdErrores++;document.getElementById('sudoku-errores').textContent=sdErrores;
    document.getElementById('sudoku-msg').textContent=`❌ Número incorrecto. Errores: ${sdErrores}/5`;
    document.getElementById('sudoku-msg').className='sudoku-msg error-msg';
    if(sdErrores>=5){document.getElementById('sudoku-msg').textContent='😔 Demasiados errores. ¡Inténtalo de nuevo!';document.getElementById('sudoku-msg').className='sudoku-msg error-msg';}
    else setTimeout(()=>{if(document.getElementById('sudoku-msg').className.includes('error-msg')&&sdErrores<5)document.getElementById('sudoku-msg').textContent='';},2000);
  }
}
function darPista(){
  const cands=[];for(let i=0;i<81;i++){if(!sdGiven.has(i)&&sdUser[i]!==sdPuzzle.s[i])cands.push(i);}
  if(cands.length===0)return;
  const idx=cands[Math.floor(Math.random()*cands.length)];
  sdUser[idx]=sdPuzzle.s[idx];sdPistas++;document.getElementById('sudoku-pistas').textContent=sdPistas;
  renderBoard();sdSelected=idx;
  const el=document.querySelector(`.sudoku-cell[data-idx="${idx}"]`);if(el){el.classList.add('selected');highlightRelated(idx);}
  document.getElementById('sudoku-msg').textContent='💡 Pista aplicada.';document.getElementById('sudoku-msg').className='sudoku-msg';
  setTimeout(()=>{document.getElementById('sudoku-msg').textContent='';},2000);
  if(sdUser.every((v,i)=>v===sdPuzzle.s[i])){document.getElementById('sudoku-msg').textContent='🎉 ¡Completado con ayuda!';document.getElementById('sudoku-msg').className='sudoku-msg win-msg';}
}