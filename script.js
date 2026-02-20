 // script.js

// Pasos interactivos
const steps = document.querySelectorAll('.step');
const stepMsg = document.getElementById('step-msg');

steps.forEach(step => {
  step.addEventListener('click', () => {
    steps.forEach(s => s.classList.remove('active-step'));
    step.classList.add('active-step');
    stepMsg.textContent = step.getAttribute('data-msg');
  });
});

// Botón micro-reto
const startBtn = document.querySelector('.btn-comenzar');
const microMsg = document.getElementById('micro-reto-msg');

startBtn.addEventListener('click', () => {
  microMsg.textContent = "¡Comienza tu primer reto! 🧠 2 minutos de atención";
  microMsg.style.opacity = 0;
  setTimeout(() => { microMsg.style.opacity = 1; }, 50);
});

// Micro-reto de memoria visual
const startRetoBtn = document.getElementById('start-reto');
const colorBoxes = document.querySelectorAll('.color-box');
const retoMsg = document.getElementById('reto-msg');

// Secuencia correcta (puede variar)
const secuencia = ['rojo', 'azul', 'verde', 'amarillo'];
let usuarioSecuencia = [];
let indexMostrar = 0;

// Función para mostrar colores uno a uno
function mostrarSecuencia() {
  if(indexMostrar >= secuencia.length) {
    indexMostrar = 0;
    usuarioSecuencia = [];
    retoMsg.textContent = "¡Ahora es tu turno! Haz clic en los colores en el mismo orden.";
    return;
  }
  const color = secuencia[indexMostrar];
  const box = Array.from(colorBoxes).find(b => b.dataset.color === color);
  box.classList.add('active');
  setTimeout(() => {
    box.classList.remove('active');
    indexMostrar++;
    setTimeout(mostrarSecuencia, 500);
  }, 800);
}

// Al iniciar el reto
startRetoBtn.addEventListener('click', () => {
  retoMsg.textContent = "Observa la secuencia...";
  indexMostrar = 0;
  mostrarSecuencia();
});

// Click del usuario
colorBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const color = box.dataset.color;
    usuarioSecuencia.push(color);
    box.classList.add('active');
    setTimeout(() => box.classList.remove('active'), 300);

    // Validar secuencia hasta el momento
    const index = usuarioSecuencia.length - 1;
    if(usuarioSecuencia[index] !== secuencia[index]) {
      retoMsg.textContent = "¡Ups! Intentemos otra vez.";
      usuarioSecuencia = [];
      return;
    }

    // Si completó correctamente
    if(usuarioSecuencia.length === secuencia.length) {
      retoMsg.textContent = "¡Perfecto! Has recordado toda la secuencia 🎉";
      usuarioSecuencia = [];
    }
  });
});