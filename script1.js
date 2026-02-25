// --- NAVEGACIÓN ---
function irAlJuego(id) {
    const destino = document.getElementById(id);
    if (destino) {
        window.scrollTo({ top: destino.offsetTop - 80, behavior: 'smooth' });
    }
}

// --- JUEGO 1: COLORES ---
const colorBoxes = document.querySelectorAll('.color-box');
const retoMsg = document.getElementById('reto-msg');
const startRetoBtn = document.getElementById('start-reto');
let secuencia = [];
let usuarioSecuencia = [];
let bloqueado = true;

async function iniciarColores() {
    bloqueado = true;
    usuarioSecuencia = [];
    secuencia = Array.from({length: 3}, () => ['rojo','azul','verde','amarillo'][Math.floor(Math.random()*4)]);
    retoMsg.textContent = "Observa la secuencia...";
    startRetoBtn.style.visibility = "hidden";

    for (const color of secuencia) {
        await new Promise(r => setTimeout(r, 800));
        const box = document.querySelector(`.color-box.${color}`);
        box.classList.add('active-glow');
        setTimeout(() => box.classList.remove('active-glow'), 500);
    }
    retoMsg.textContent = "¡Tu turno!";
    bloqueado = false;
}

colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        if (bloqueado) return;
        const color = box.dataset.color;
        box.classList.add('active-glow');
        setTimeout(() => box.classList.remove('active-glow'), 300);
        usuarioSecuencia.push(color);
        
        const i = usuarioSecuencia.length - 1;
        if (usuarioSecuencia[i] !== secuencia[i]) {
            retoMsg.textContent = "¡Incorrecto! Intenta de nuevo.";
            bloqueado = true;
            startRetoBtn.style.visibility = "visible";
            return;
        }
        if (usuarioSecuencia.length === secuencia.length) {
            retoMsg.textContent = "¡Excelente! Memoria perfecta.";
            bloqueado = true;
            startRetoBtn.style.visibility = "visible";
        }
    });
});
startRetoBtn.addEventListener('click', iniciarColores);

// --- JUEGO 2: REFRANES ---
const banco = [
    { i: "A quien madruga...", c: "Dios le ayuda", o: ["Sale el sol", "Dios le ayuda", "Poco le ayuda"] },
    { i: "Al mal tiempo...", c: "buena cara", o: ["buena cara", "mucho abrigo", "paraguas nuevo"] },
     { i: "A falta de pan...", c: "buenas son tortas", o: ["nada que comer", "buenas son tortas", "comemos lo que hay"] },
      { i: "A caballo regalado...", c: "no se le mira el colmillo", o: ["no se le mira el colmillo", "algo hay que regalar", "no sabemos lo que quiere"] },
       { i: "A buen entendedor...", c: "pocas palabras bastan", o: ["mucho que agradecer", "ausencia y olvido", "pocas palabras bastan"] }
];
let refIdx = 0;

function cargarRefran() {
    const data = banco[refIdx];
    document.getElementById('refran-inicio').textContent = `"${data.i}"`;
    document.getElementById('refran-destino').textContent = "¿?";
    const cont = document.getElementById('opciones-refranes');
    cont.innerHTML = "";
    data.o.forEach(opt => {
        const b = document.createElement('button');
        b.className = "opcion-btn";
        b.textContent = opt;
        b.onclick = () => {
            if(opt === data.c) {
                document.getElementById('refran-destino').textContent = opt;
                document.getElementById('refran-feedback').textContent = "¡Correcto!";
                b.classList.add('opcion-correcta');
                if(refIdx < banco.length-1) document.getElementById('next-refran').style.display = "inline-block";
            } else {
                b.classList.add('opcion-incorrecta');
            }
        };
        cont.appendChild(b);
    });
}
document.getElementById('next-refran').onclick = () => {
    refIdx++;
    document.getElementById('next-refran').style.display = "none";
    document.getElementById('refran-feedback').textContent = "";
    cargarRefran();
};
cargarRefran();

// --- JUEGO 3: LA DESPENSA ---
const productos = ['🍎', '🥛', '🍞', '🥚', '🧀', '🍌', '🍗', '🥦', '🥫'];
let listaCorrecta = [];
let aciertosDespensa = 0;

const contLista = document.getElementById('lista-memorizar');
const contEstanteria = document.getElementById('estanteria');
const msgDespensa = document.getElementById('despensa-msg');
const btnDespensa = document.getElementById('start-despensa');

async function iniciarDespensa() {
    btnDespensa.style.visibility = "hidden";
    contEstanteria.style.display = "none";
    contLista.style.display = "grid";
    aciertosDespensa = 0;
    
    // Elegir 3 productos aleatorios
    listaCorrecta = [...productos].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Mostrar lista para memorizar
    contLista.innerHTML = listaCorrecta.map(p => `<div class="item-card">${p}</div>`).join('');
    msgDespensa.textContent = "Memoriza estos 3 productos...";
    
    await new Promise(r => setTimeout(r, 4000)); // 4 segundos para memorizar
    
    // Pasar a la estantería
    contLista.style.display = "none";
    contEstanteria.style.display = "grid";
    msgDespensa.textContent = "¿Qué productos había en la lista?";
    
    // Mezclar todos los productos en la estantería
    const mezcla = [...productos].sort(() => 0.5 - Math.random());
    contEstanteria.innerHTML = mezcla.map(p => `<div class="item-card" onclick="validarCompra(this, '${p}')">${p}</div>`).join('');
}

function validarCompra(elemento, emoji) {
    if (listaCorrecta.includes(emoji)) {
        elemento.classList.add('item-correct');
        elemento.onclick = null; // Evitar doble clic
        aciertosDespensa++;
        if (aciertosDespensa === 3) {
            msgDespensa.textContent = "¡Cesta completa! Memoria de hierro. 🛒✨";
            btnDespensa.style.visibility = "visible";
            btnDespensa.textContent = "Jugar otra vez";
        }
    } else {
        elemento.classList.add('item-incorrect');
        msgDespensa.textContent = "Ese no estaba... ¡Sigue intentando!";
    }
}

btnDespensa.addEventListener('click', iniciarDespensa);

// --- JUEGO 4: EL INTRUSO ---
const nivelesIntruso = [
  { grupo: ['🍎', '🍌', '🍓'], intruso: '🔨', msg: "¡Correcto! El martillo no es una fruta." },
  { grupo: ['🐶', '🐱', '🦁'], intruso: '🚲', msg: "¡Bien hecho! La bici no es un animal." },
  { grupo: ['🚗', '✈️', '🚢'], intruso: '🥦', msg: "¡Exacto! El brócoli no es un transporte." },
  { grupo: ['🎸', '🎺', '🎻'], intruso: '👟', msg: "¡Genial! La zapatilla no es un instrumento." }
];

let nivelIntrusoActual = 0;
const gridIntruso = document.getElementById('intruso-grid');
const msgIntruso = document.getElementById('intruso-feedback');
const btnNextIntruso = document.getElementById('next-intruso');

function cargarNivelIntruso() {
    const data = nivelesIntruso[nivelIntrusoActual];
    msgIntruso.textContent = "";
    btnNextIntruso.style.display = "none";
    gridIntruso.innerHTML = "";

    // Mezclar grupo + intruso
    const opciones = [...data.grupo, data.intruso].sort(() => 0.5 - Math.random());

    opciones.forEach(emoji => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.textContent = emoji;
        div.onclick = () => {
            if (emoji === data.intruso) {
                div.classList.add('item-correct');
                msgIntruso.textContent = data.msg;
                msgIntruso.style.color = "#27AE60";
                desactivarOpcionesIntruso();
                if(nivelIntrusoActual < nivelesIntruso.length - 1) {
                    btnNextIntruso.style.display = "inline-block";
                } else {
                    msgIntruso.textContent = "¡Has completado todos los niveles! 🏆";
                }
            } else {
                div.classList.add('item-incorrect');
                msgIntruso.textContent = "Ese sí pertenece al grupo. ¡Sigue buscando!";
                msgIntruso.style.color = "#E74C3C";
            }
        };
        gridIntruso.appendChild(div);
    });
}

function desactivarOpcionesIntruso() {
    const cards = gridIntruso.querySelectorAll('.item-card');
    cards.forEach(c => c.onclick = null);
}

btnNextIntruso.onclick = () => {
    nivelIntrusoActual++;
    cargarNivelIntruso();
};

// Iniciar al cargar
cargarNivelIntruso();

// --- LÓGICA DEL FORMULARIO ---
const registroForm = document.getElementById('registro-form');
const formMsg = document.getElementById('form-msg');

registroForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se refresque
    
    const nombre = document.getElementById('nombre').value;
    
    // Simulamos el envío
    formMsg.textContent = `¡Gracias, ${nombre}! Pronto recibirás tu primer consejo. 📧`;
    formMsg.style.color = "#FFD700";
    
    // Limpiamos el formulario
    registroForm.reset();
    
    // Ocultar mensaje tras unos segundos
    setTimeout(() => { formMsg.textContent = ""; }, 5000);
});

/* =========================
   SOPA DE LETRAS MEJORADA
========================= */

const letrasSopa = [
  ["P","A","N","F","L","O"],
  ["E","C","A","S","A","R"],
  ["R","L","E","C","H","E"],
  ["R","M","E","S","A","T"],
  ["O","A","F","L","O","R"],
  ["T","E","R","R","O","P"]
];

const palabrasSopa = ["PAN","LECHE","CASA","MESA","FLOR","PERRO"];

const gridSopa = document.getElementById("grid-sopa");
const mensajeSopa = document.getElementById("sopa-msg");

let seleccion = [];
let bloqueadoSopa = false;

function iniciarSopa() {
  gridSopa.innerHTML = "";
  seleccion = [];
  bloqueadoSopa = false;

  letrasSopa.forEach((fila, filaIndex) => {
    fila.forEach((letra, colIndex) => {

      const div = document.createElement("div");
      div.textContent = letra;
      div.classList.add("celda-sopa");
      div.dataset.fila = filaIndex;
      div.dataset.col = colIndex;

      div.addEventListener("click", () => seleccionarCelda(div));

      gridSopa.appendChild(div);
    });
  });

  mensajeSopa.textContent = "Busca una palabra horizontal o vertical 🌿";
}

function seleccionarCelda(celda) {

  if (bloqueadoSopa) return;

  const fila = parseInt(celda.dataset.fila);
  const col = parseInt(celda.dataset.col);

  if (celda.classList.contains("encontrada-sopa")) return;

  // Primera selección
  if (seleccion.length === 0) {
    seleccion.push({fila, col, celda});
    celda.classList.add("seleccionada-sopa");
    return;
  }

  const ultima = seleccion[seleccion.length - 1];

  // Solo permitir contiguas horizontal o vertical
  const esContigua =
    (fila === ultima.fila && Math.abs(col - ultima.col) === 1) ||
    (col === ultima.col && Math.abs(fila - ultima.fila) === 1);

  if (!esContigua) return;

  seleccion.push({fila, col, celda});
  celda.classList.add("seleccionada-sopa");

  verificarSopa();
}

function verificarSopa() {

  const palabraFormada = seleccion.map(s => s.celda.textContent).join("");

  if (palabrasSopa.includes(palabraFormada)) {

    mensajeSopa.textContent = "Muy bien 👏 Encontraste: " + palabraFormada;

    seleccion.forEach(s => {
      s.celda.classList.remove("seleccionada-sopa");
      s.celda.classList.add("encontrada-sopa");
    });

    seleccion = [];

  } else if (palabraFormada.length >= 6) {

    // Si no coincide y ya es larga, reset
    mensajeSopa.textContent = "Intenta otra combinación 🌿";

    seleccion.forEach(s => {
      s.celda.classList.remove("seleccionada-sopa");
    });

    seleccion = [];
  }
}

document.addEventListener("DOMContentLoaded", iniciarSopa);