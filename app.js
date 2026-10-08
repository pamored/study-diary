// Diario de Estudio — v1
// Todo el estado vive en localStorage; no hay servidor.

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
// Fechas en hora local (nunca UTC)
// ============================================================

// Convierte un Date a "YYYY-MM-DD" usando la hora local del usuario.
function fechaLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Suma (o resta) días a una fecha "YYYY-MM-DD" y devuelve "YYYY-MM-DD".
function sumarDias(fecha, dias) {
  const [y, m, d] = fecha.split('-').map(Number);
  return fechaLocal(new Date(y, m - 1, d + dias));
}

// "2026-10-08" -> "Miércoles, 8 de octubre"
function formatearFecha(fecha) {
  const [y, m, d] = fecha.split('-').map(Number);
  const texto = new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ============================================================
// Racha
// ============================================================

function calcularRacha(sesiones) {
  const fechasConSesion = new Set(sesiones.map((sesion) => sesion.fecha));

  let fecha = fechaLocal(new Date()); // hoy

  // Si hoy todavía no hay sesión, la racha sigue viva: empezamos desde ayer.
  if (!fechasConSesion.has(fecha)) {
    fecha = sumarDias(fecha, -1);
  }

  // Contamos días consecutivos hacia atrás mientras haya sesión.
  let racha = 0;
  while (fechasConSesion.has(fecha)) {
    racha += 1;
    fecha = sumarDias(fecha, -1);
  }
  return racha;
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
