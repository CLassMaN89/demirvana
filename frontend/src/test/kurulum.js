import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// JSDOM canvas çizmez; bileşenin yaşam döngüsünü gerçek DOM ile test edebilmek için yalnız eksik çizim sınırını taklit ederiz.
HTMLCanvasElement.prototype.getContext = () => ({
  setTransform: () => {},
  fillRect: () => {},
  clearRect: () => {},
  save: () => {},
  restore: () => {},
  drawImage: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  fill: () => {},
  createRadialGradient: () => ({ addColorStop: () => {} }),
  globalCompositeOperation: 'source-over',
  fillStyle: ''
});

// Her test temiz bir sayfada başlamalı; aksi halde önceki bileşenlerin DOM'u sonucu etkiler.
afterEach(() => cleanup());
