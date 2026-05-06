import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpa o DOM virtual após cada teste para evitar contaminação.
afterEach(() => {
  cleanup();
});