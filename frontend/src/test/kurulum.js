import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Her test temiz bir sayfada başlamalı; aksi halde önceki bileşenlerin DOM'u sonucu etkiler.
afterEach(() => cleanup());
