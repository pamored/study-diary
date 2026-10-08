import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularRacha, fechaLocal, formatearFecha, sumarDias } from '../study-logic.js';

test('fechaLocal usa la fecha local y rellena mes y día', () => {
  assert.equal(fechaLocal(new Date(2026, 0, 5, 12)), '2026-01-05');
});

test('sumarDias cruza correctamente fin de mes y fin de año', () => {
  assert.equal(sumarDias('2026-01-01', -1), '2025-12-31');
  assert.equal(sumarDias('2026-01-31', 1), '2026-02-01');
});

test('formatearFecha muestra la fecha en español', () => {
  assert.equal(formatearFecha('2026-10-08'), 'Jueves, 8 de octubre');
});

test('calcularRacha devuelve cero cuando no hay sesiones', () => {
  assert.equal(calcularRacha([], '2026-10-08'), 0);
});

test('calcularRacha cuenta días consecutivos hasta hoy', () => {
  const sesiones = [
    { fecha: '2026-10-08' },
    { fecha: '2026-10-07' },
    { fecha: '2026-10-06' },
  ];

  assert.equal(calcularRacha(sesiones, '2026-10-08'), 3);
});

test('calcularRacha conserva la racha si todavía no hay sesión hoy', () => {
  const sesiones = [
    { fecha: '2026-10-07' },
    { fecha: '2026-10-06' },
  ];

  assert.equal(calcularRacha(sesiones, '2026-10-08'), 2);
});

test('calcularRacha se interrumpe cuando falta un día', () => {
  const sesiones = [
    { fecha: '2026-10-08' },
    { fecha: '2026-10-06' },
  ];

  assert.equal(calcularRacha(sesiones, '2026-10-08'), 1);
});
