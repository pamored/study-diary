// Diario de Estudio — v1
// Todo el estado vive en localStorage; no hay servidor.
import { calcularRacha, fechaLocal, formatearFecha } from './study-logic.js';

// ============================================================
// Almacenamiento (localStorage)
// ============================================================

const CLAVE_STORAGE = 'diario-estudio:sesiones';

function cargarSesiones() {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE);
    if (!texto) return [];
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    // Si los datos guardados están corruptos, empezamos de cero.
    return [];
  }
}

function guardarSesiones(sesiones) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(sesiones));
}

// ============================================================
// Interfaz
// ============================================================

const rachaNumero = document.getElementById('rachaNumero');
const listaSesiones = document.getElementById('listaSesiones');
const mensajeVacio = document.getElementById('mensajeVacio');
const formulario = document.getElementById('formularioSesion');
const inputFecha = document.getElementById('fecha');
const inputTema = document.getElementById('tema');
const inputMinutos = document.getElementById('minutos');

let sesiones = cargarSesiones();

function renderizar() {
  // 1. Racha actual
  rachaNumero.textContent = calcularRacha(sesiones);

  // 2. Sesiones, de la más reciente a la más antigua.
  const ordenadas = [...sesiones].sort((a, b) => {
    if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
    return b.creadoEn - a.creadoEn; // mismo día: la última añadida, primero
  });

  listaSesiones.textContent = '';
  mensajeVacio.hidden = ordenadas.length > 0;

  for (const sesion of ordenadas) {
    const li = document.createElement('li');

    const fecha = document.createElement('span');
    fecha.className = 'sesion-fecha';
    fecha.textContent = formatearFecha(sesion.fecha);

    const tema = document.createElement('span');
    tema.className = 'sesion-tema';
    tema.textContent = sesion.tema;

    const minutos = document.createElement('span');
    minutos.className = 'sesion-minutos';
    minutos.textContent = `${sesion.minutos} min`;

    li.append(fecha, tema, minutos);
    listaSesiones.appendChild(li);
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const fecha = inputFecha.value;
  const tema = inputTema.value.trim();
  const minutos = Number(inputMinutos.value);

  // Validación de seguridad (el HTML ya exige campos obligatorios y min="1").
  if (!fecha || tema === '' || !Number.isFinite(minutos) || minutos < 1) {
    return;
  }

  sesiones.push({
    fecha,
    tema,
    minutos,
    creadoEn: Date.now(), // solo para ordenar sesiones del mismo día
  });

  guardarSesiones(sesiones);
  renderizar();

  // Dejamos el formulario listo para la siguiente sesión.
  formulario.reset();
  inputFecha.value = fechaLocal(new Date());
  inputTema.focus();
});

// Fecha por defecto del formulario: hoy (en hora local).
inputFecha.value = fechaLocal(new Date());

renderizar();
