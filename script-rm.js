 // ==================== NAVEGACIÓN ====================
  const mainContent = document.getElementById('main-content');
  const allGames = document.querySelectorAll('.game-section');

  function irAlJuego(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function mostrarJuego(id) {
    mainContent.classList.add('hidden');
    allGames.forEach(g => g.classList.remove('active'));
    const g = document.getElementById(id);
    if (g) {
      g.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (id === 'juego-colores') resetColores();
    if (id === 'juego-refranes') cargarRefran();
    if (id === 'juego-despensa') resetDespensa();
    if (id === 'juego-intruso') cargarIntruso();
    if (id === 'juego-sopa') iniciarSopa();
  }

  function volverMenu() {
    allGames.forEach(g => g.classList.remove('active'));
    mainContent.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.getElementById('actividades').scrollIntoView({ behavior: 'smooth' }), 100);
  }

  function volverInicio() {
    allGames.forEach(g => g.classList.remove('active'));
    mainContent.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== FORMULARIO ====================
  function enviarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email  = document.getElementById('email').value.trim();
    const msg    = document.getElementById('form-msg');
    if (!nombre || !email) {
      msg.textContent = '⚠️ Por favor rellena los dos campos.';
      return;
    }
    msg.textContent = `✅ ¡Gracias, ${nombre}! Pronto recibirás tus consejos.`;
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
  }

  // ==================== JUEGO 1: COLORES ====================
  let colorSecuencia = [];
  let colorInputUser  = [];
  let colorPaso       = 0;
  let colorEsperando  = false;

  const colores = ['rojo', 'azul', 'verde', 'amarillo'];
  const colorBoxes = () => document.querySelectorAll('#juego-colores .color-box');

  function resetColores() {
    colorSecuencia = [];
    colorInputUser = [];
    colorPaso = 0;
    colorEsperando = false;
    document.getElementById('colores-msg').textContent = 'Pulsa el botón para empezar';
    document.getElementById('start-colores').style.display = 'inline-block';
    colorBoxes().forEach(b => b.classList.remove('active'));
  }

  function iniciarColores() {
    document.getElementById('start-colores').style.display = 'none';
    colorSecuencia = [];
    colorInputUser = [];
    colorPaso = 0;
    colorEsperando = false;
    ampliarSecuencia();
  }

  function ampliarSecuencia() {
    colorEsperando = false;
    colorInputUser = [];
    colorPaso = 0;
    colorSecuencia.push(colores[Math.floor(Math.random() * 4)]);
    document.getElementById('colores-msg').textContent = '👀 Observa la secuencia...';
    mostrarSecuencia(0);
  }

  function mostrarSecuencia(i) {
    if (i >= colorSecuencia.length) {
      setTimeout(() => {
        document.getElementById('colores-msg').textContent = '🖱️ ¡Ahora tú! Repite la secuencia';
        colorEsperando = true;
      }, 500);
      return;
    }
    setTimeout(() => {
      iluminarColor(colorSecuencia[i]);
      setTimeout(() => mostrarSecuencia(i + 1), 700);
    }, 400);
  }

  function iluminarColor(color) {
    const box = document.querySelector(`#juego-colores .color-box.${color}`);
    if (!box) return;
    box.classList.add('active');
    setTimeout(() => box.classList.remove('active'), 450);
  }

  function clicColor(box) {
    if (!colorEsperando) return;
    const color = box.dataset.color;
    box.classList.add('active');
    setTimeout(() => box.classList.remove('active'), 300);
    colorInputUser.push(color);

    if (color !== colorSecuencia[colorPaso]) {
      // Error
      colorEsperando = false;
      document.getElementById('colores-msg').textContent = `❌ ¡Incorrecto! La secuencia tenía ${colorSecuencia.length} paso(s). ¡Inténtalo de nuevo!`;
      box.classList.add('shake');
      setTimeout(() => { box.classList.remove('shake'); }, 400);
      document.getElementById('start-colores').style.display = 'inline-block';
      document.getElementById('start-colores').textContent = 'Reiniciar';
      return;
    }

    colorPaso++;
    if (colorPaso === colorSecuencia.length) {
      colorEsperando = false;
      document.getElementById('colores-msg').textContent = `✅ ¡Perfecto! Nivel ${colorSecuencia.length} superado 🎉`;
      setTimeout(() => ampliarSecuencia(), 1400);
    }
  }

  // ==================== JUEGO 2: REFRANES ====================
  const refranes = [
    { inicio: "A quien madruga...", fin: "Dios le ayuda", opciones: ["Dios le ayuda", "todo le sale bien", "suerte le da", "el cielo espera"] },
    { inicio: "Más vale pájaro en mano...", fin: "que ciento volando", opciones: ["que ciento volando", "que ninguno en casa", "que dos en el árbol", "que mil en el nido"] },
    { inicio: "No hay mal que...", fin: "por bien no venga", opciones: ["nunca acabe", "por bien no venga", "al cielo ascienda", "dure cien años"] },
    { inicio: "En boca cerrada...", fin: "no entran moscas", opciones: ["la vida es bella", "no entran moscas", "todo es silencio", "duerme el corazón"] },
    { inicio: "A caballo regalado...", fin: "no le mires el diente", opciones: ["dale de comer", "no le mires el diente", "siempre hay que montar", "hazle una fiesta"] },
    { inicio: "El que mucho abarca...", fin: "poco aprieta", opciones: ["todo lo logra", "poco aprieta", "mucho consigue", "siempre gana"] },
    { inicio: "Camarón que se duerme...", fin: "se lo lleva la corriente", opciones: ["se lo lleva la corriente", "pierde el banco", "no come", "se moja"] },
    { inicio: "Ojos que no ven...", fin: "corazón que no siente", opciones: ["corazón que no siente", "mente que no piensa", "alma que no llora", "cara que no miente"] },
  ];

  let refrIdx = 0;
  let refrUsados = [];

  function cargarRefran() {
    if (refrUsados.length === refranes.length) refrUsados = [];
    let idx;
    do { idx = Math.floor(Math.random() * refranes.length); } while (refrUsados.includes(idx));
    refrUsados.push(idx);
    refrIdx = idx;

    const r = refranes[idx];
    document.getElementById('refran-inicio').textContent = r.inicio;
    document.getElementById('refran-destino').textContent = '   ?   ';
    document.getElementById('refran-feedback').textContent = '';
    document.getElementById('next-refran').style.display = 'none';

    const grid = document.getElementById('opciones-refranes');
    grid.innerHTML = '';
    const mezc = [...r.opciones].sort(() => Math.random() - 0.5);
    mezc.forEach(op => {
      const btn = document.createElement('button');
      btn.className = 'opcion-btn';
      btn.textContent = op;
      btn.onclick = () => elegirRefran(btn, op, r.fin);
      grid.appendChild(btn);
    });
  }

  function elegirRefran(btn, elegida, correcta) {
    document.querySelectorAll('.opcion-btn').forEach(b => b.onclick = null);
    if (elegida === correcta) {
      btn.classList.add('correcto');
      document.getElementById('refran-feedback').textContent = '✅ ¡Correcto! Muy bien.';
      document.getElementById('refran-destino').textContent = correcta;
    } else {
      btn.classList.add('incorrecto');
      document.getElementById('refran-feedback').textContent = `❌ La respuesta era: "${correcta}"`;
      document.querySelectorAll('.opcion-btn').forEach(b => {
        if (b.textContent === correcta) b.classList.add('correcto');
      });
      document.getElementById('refran-destino').textContent = correcta;
    }
    document.getElementById('next-refran').style.display = 'inline-block';
  }

  function siguienteRefran() { cargarRefran(); }

  // ==================== JUEGO 3: DESPENSA ====================
  const todosProductos = [
    { emoji: '🍎', nombre: 'Manzana' },
    { emoji: '🥛', nombre: 'Leche' },
    { emoji: '🍞', nombre: 'Pan' },
    { emoji: '🧀', nombre: 'Queso' },
    { emoji: '🥚', nombre: 'Huevos' },
    { emoji: '🍊', nombre: 'Naranja' },
    { emoji: '🍌', nombre: 'Plátano' },
    { emoji: '🥩', nombre: 'Carne' },
    { emoji: '🍅', nombre: 'Tomate' },
    { emoji: '🧅', nombre: 'Cebolla' },
    { emoji: '🥕', nombre: 'Zanahoria' },
    { emoji: '🫙', nombre: 'Mermelada' },
  ];

  let despensaLista = [];
  let despensaFase  = 'inicio';
  let despensaSelec = [];

  function resetDespensa() {
    despensaFase = 'inicio';
    despensaSelec = [];
    document.getElementById('lista-memorizar').innerHTML = '';
    document.getElementById('estanteria').style.display = 'none';
    document.getElementById('lista-memorizar').style.display = 'flex';
    document.getElementById('despensa-msg').textContent = 'Haz clic en Iniciar para ver la lista';
    document.getElementById('start-despensa').style.display = 'inline-block';
    document.getElementById('start-despensa').textContent = 'Iniciar';
    document.getElementById('start-despensa').onclick = iniciarDespensa;
    document.getElementById('despensa-instr').textContent = 'Memoriza los productos y luego encuéntralos.';
  }

  function iniciarDespensa() {
    const mezcla = [...todosProductos].sort(() => Math.random() - 0.5);
    despensaLista = mezcla.slice(0, 4);
    despensaFase = 'memorizar';
    despensaSelec = [];

    const lista = document.getElementById('lista-memorizar');
    lista.innerHTML = '';
    despensaLista.forEach(p => {
      const d = document.createElement('div');
      d.className = 'item-emoji';
      d.title = p.nombre;
      d.textContent = p.emoji;
      lista.appendChild(d);
    });

    document.getElementById('despensa-instr').textContent = '👀 Memoriza bien estos productos. Tienes 5 segundos.';
    document.getElementById('despensa-msg').textContent = '';
    document.getElementById('start-despensa').style.display = 'none';

    let cuenta = 5;
    const interval = setInterval(() => {
      cuenta--;
      document.getElementById('despensa-msg').textContent = cuenta > 0 ? `⏱ ${cuenta}...` : '';
      if (cuenta <= 0) {
        clearInterval(interval);
        pasarAEstanteria();
      }
    }, 1000);
  }

  function pasarAEstanteria() {
    document.getElementById('lista-memorizar').style.display = 'none';
    const estanteria = document.getElementById('estanteria');
    estanteria.style.display = 'flex';
    estanteria.innerHTML = '';

    const mezcla = [...todosProductos].sort(() => Math.random() - 0.5);
    document.getElementById('despensa-instr').textContent = '🛒 Haz clic en los productos que estaban en la lista.';
    document.getElementById('despensa-msg').textContent = `Quedan ${despensaLista.length} productos por encontrar.`;
    despensaFase = 'elegir';
    despensaSelec = [];

    mezcla.forEach(p => {
      const d = document.createElement('div');
      d.className = 'item-emoji';
      d.textContent = p.emoji;
      d.title = p.nombre;
      d.onclick = () => clicDespensa(d, p);
      estanteria.appendChild(d);
    });
  }

  function clicDespensa(el, producto) {
    if (despensaFase !== 'elegir') return;
    const esCorr = despensaLista.some(p => p.nombre === producto.nombre);
    if (esCorr) {
      el.classList.add('correcto-d');
      el.onclick = null;
      despensaSelec.push(producto.nombre);
      if (despensaSelec.length === despensaLista.length) {
        document.getElementById('despensa-msg').textContent = '🎉 ¡Muy bien! Encontraste todos los productos.';
        despensaFase = 'fin';
        document.getElementById('start-despensa').style.display = 'inline-block';
        document.getElementById('start-despensa').textContent = 'Jugar de nuevo';
        document.getElementById('start-despensa').onclick = resetDespensa;
      } else {
        document.getElementById('despensa-msg').textContent = `✅ ¡Correcto! Quedan ${despensaLista.length - despensaSelec.length} por encontrar.`;
      }
    } else {
      el.classList.add('incorrecto-d');
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 400);
      document.getElementById('despensa-msg').textContent = '❌ Ese no estaba. ¡Sigue buscando!';
      setTimeout(() => el.classList.remove('incorrecto-d'), 900);
    }
  }

  // ==================== JUEGO 4: INTRUSO ====================
  const retosIntruso = [
    { grupo: 'Frutas', items: [
        { emoji: '🍎', nombre: 'Manzana' },
        { emoji: '🍊', nombre: 'Naranja' },
        { emoji: '🍋', nombre: 'Limón' },
        { emoji: '🥕', nombre: 'Zanahoria', intruso: true },
      ]
    },
    { grupo: 'Animales del mar', items: [
        { emoji: '🐟', nombre: 'Pez' },
        { emoji: '🦈', nombre: 'Tiburón' },
        { emoji: '🐙', nombre: 'Pulpo' },
        { emoji: '🐔', nombre: 'Gallina', intruso: true },
      ]
    },
    { grupo: 'Medios de transporte', items: [
        { emoji: '🚗', nombre: 'Coche' },
        { emoji: '✈️', nombre: 'Avión' },
        { emoji: '🚢', nombre: 'Barco' },
        { emoji: '🍕', nombre: 'Pizza', intruso: true },
      ]
    },
    { grupo: 'Muebles', items: [
        { emoji: '🛋️', nombre: 'Sofá' },
        { emoji: '🪑', nombre: 'Silla' },
        { emoji: '🛏️', nombre: 'Cama' },
        { emoji: '🐠', nombre: 'Pez tropical', intruso: true },
      ]
    },
    { grupo: 'Instrumentos', items: [
        { emoji: '🎸', nombre: 'Guitarra' },
        { emoji: '🎹', nombre: 'Piano' },
        { emoji: '🥁', nombre: 'Batería' },
        { emoji: '⚽', nombre: 'Balón', intruso: true },
      ]
    },
    { grupo: 'Flores', items: [
        { emoji: '🌹', nombre: 'Rosa' },
        { emoji: '🌻', nombre: 'Girasol' },
        { emoji: '🌷', nombre: 'Tulipán' },
        { emoji: '🦊', nombre: 'Zorro', intruso: true },
      ]
    },
  ];

  let intrusoIdx = 0;
  let intrusoUsados = [];

  function cargarIntruso() {
    if (intrusoUsados.length === retosIntruso.length) intrusoUsados = [];
    let idx;
    do { idx = Math.floor(Math.random() * retosIntruso.length); } while (intrusoUsados.includes(idx));
    intrusoUsados.push(idx);
    intrusoIdx = idx;

    const reto = retosIntruso[idx];
    const grid = document.getElementById('intruso-grid');
    grid.innerHTML = '';
    document.getElementById('intruso-feedback').textContent = '';
    document.getElementById('next-intruso').style.display = 'none';

    const mezc = [...reto.items].sort(() => Math.random() - 0.5);
    mezc.forEach(item => {
      const d = document.createElement('div');
      d.className = 'intruso-item';
      d.innerHTML = `<span class="emoji">${item.emoji}</span>${item.nombre}`;
      d.onclick = () => clicIntruso(d, item.intruso);
      grid.appendChild(d);
    });
  }

  function clicIntruso(el, esIntruso) {
    document.querySelectorAll('.intruso-item').forEach(b => b.onclick = null);
    if (esIntruso) {
      el.classList.add('correcto');
      document.getElementById('intruso-feedback').textContent = '✅ ¡Correcto! Ese no encajaba.';
    } else {
      el.classList.add('incorrecto');
      document.getElementById('intruso-feedback').textContent = '❌ Ese sí pertenece al grupo.';
      document.querySelectorAll('.intruso-item').forEach(b => {
        // find the intruder
        const nom = b.querySelector(':last-child') ? b.innerText.replace(/\n/g,'') : '';
      });
    }
    document.getElementById('next-intruso').style.display = 'inline-block';
  }

  function siguienteIntruso() { cargarIntruso(); }

  // ==================== JUEGO 5: SOPA DE LETRAS ====================
  const sopaConfig = {
    palabras: ['PAN', 'LECHE', 'CASA', 'MESA', 'FLOR', 'PERRO'],
    tam: 10,
  };

  let sopaGrid = [];
  let sopaEncontradas = [];
  let sopaSeleccionadas = [];
  let sopaDragging = false;

  function iniciarSopa() {
    sopaEncontradas = [];
    sopaSeleccionadas = [];
    sopaGrid = Array.from({ length: sopaConfig.tam }, () => Array(sopaConfig.tam).fill(''));

    // Update word list
    const ul = document.getElementById('lista-palabras');
    ul.innerHTML = '';
    sopaConfig.palabras.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      li.id = 'pal-' + p;
      ul.appendChild(li);
    });

    // Place words
    const placed = [];
    sopaConfig.palabras.forEach(pal => {
      let ok = false;
      let tries = 0;
      while (!ok && tries < 200) {
        tries++;
        const dir = Math.random() < 0.5 ? 'h' : 'v';
        const len = pal.length;
        const row = Math.floor(Math.random() * (sopaConfig.tam - (dir === 'v' ? len : 0)));
        const col = Math.floor(Math.random() * (sopaConfig.tam - (dir === 'h' ? len : 0)));
        let canPlace = true;
        for (let i = 0; i < len; i++) {
          const r = dir === 'v' ? row + i : row;
          const c = dir === 'h' ? col + i : col;
          if (sopaGrid[r][c] !== '' && sopaGrid[r][c] !== pal[i]) { canPlace = false; break; }
        }
        if (canPlace) {
          for (let i = 0; i < len; i++) {
            const r = dir === 'v' ? row + i : row;
            const c = dir === 'h' ? col + i : col;
            sopaGrid[r][c] = pal[i];
          }
          placed.push({ pal, row, col, dir });
          ok = true;
        }
      }
    });

    // Fill blanks
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < sopaConfig.tam; r++)
      for (let c = 0; c < sopaConfig.tam; c++)
        if (sopaGrid[r][c] === '') sopaGrid[r][c] = letras[Math.floor(Math.random() * letras.length)];

    // Render grid
    const gEl = document.getElementById('grid-sopa');
    gEl.innerHTML = '';
    gEl.style.gridTemplateColumns = `repeat(${sopaConfig.tam}, 1fr)`;

    for (let r = 0; r < sopaConfig.tam; r++) {
      for (let c = 0; c < sopaConfig.tam; c++) {
        const cell = document.createElement('div');
        cell.className = 'sopa-cell';
        cell.textContent = sopaGrid[r][c];
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.addEventListener('click', () => clicSopa(cell, r, c));
        gEl.appendChild(cell);
      }
    }

    document.getElementById('sopa-msg').textContent = 'Haz clic en las letras para marcarlas.';
  }

  function clicSopa(cell, r, c) {
    if (cell.classList.contains('found')) return;

    const key = `${r},${c}`;
    if (sopaSeleccionadas.includes(key)) {
      sopaSeleccionadas = sopaSeleccionadas.filter(k => k !== key);
      cell.classList.remove('selected');
    } else {
      sopaSeleccionadas.push(key);
      cell.classList.add('selected');
    }

    // Build selected string
    const letrasSelec = sopaSeleccionadas.map(k => {
      const [rr, cc] = k.split(',').map(Number);
      return sopaGrid[rr][cc];
    }).join('');

    // Check against words
    for (const pal of sopaConfig.palabras) {
      if (sopaEncontradas.includes(pal)) continue;
      if (letrasSelec === pal || letrasSelec.split('').reverse().join('') === pal) {
        // Mark as found
        sopaSeleccionadas.forEach(k => {
          const [rr, cc] = k.split(',').map(Number);
          const cellEl = document.querySelector(`.sopa-cell[data-r="${rr}"][data-c="${cc}"]`);
          if (cellEl) { cellEl.classList.remove('selected'); cellEl.classList.add('found'); }
        });
        sopaSeleccionadas = [];
        sopaEncontradas.push(pal);
        const li = document.getElementById('pal-' + pal);
        if (li) li.classList.add('encontrada');
        document.getElementById('sopa-msg').textContent = `✅ ¡"${pal}" encontrada!`;

        if (sopaEncontradas.length === sopaConfig.palabras.length) {
          document.getElementById('sopa-msg').textContent = '🎉 ¡Encontraste todas las palabras! ¡Enhorabuena!';
        }
        return;
      }
    }
  }
