// Convierte un Date a "YYYY-MM-DD" usando la hora local del usuario.
export function fechaLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Suma (o resta) días a una fecha "YYYY-MM-DD" y devuelve "YYYY-MM-DD".
export function sumarDias(fecha, dias) {
  const [y, m, d] = fecha.split('-').map(Number);
  return fechaLocal(new Date(y, m - 1, d + dias));
}

// "2026-10-08" -> "Miércoles, 8 de octubre"
export function formatearFecha(fecha) {
  const [y, m, d] = fecha.split('-').map(Number);
  const texto = new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function calcularRacha(sesiones, hoy = fechaLocal(new Date())) {
  const fechasConSesion = new Set(sesiones.map((sesion) => sesion.fecha));
  let fecha = hoy;

  if (!fechasConSesion.has(fecha)) {
    fecha = sumarDias(fecha, -1);
  }

  let racha = 0;
  while (fechasConSesion.has(fecha)) {
    racha += 1;
    fecha = sumarDias(fecha, -1);
  }
  return racha;
}
