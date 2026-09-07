import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MetinDongusu from './MetinDongusu';

describe('MetinDongusu', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('metinleri belirlenen aralıkla sırayla gösterir', () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    render(<MetinDongusu metinler={['TABLOLAR', 'KULLANMA TALİMATLARI']} gecisSuresi={2600} />);

    expect(screen.getByTestId('donen-metin')).toHaveTextContent('TABLOLAR');
    act(() => vi.advanceTimersByTime(2600));
    expect(screen.getByTestId('donen-metin')).toHaveTextContent('KULLANMA TALİMATLARI');
  });

  it('azaltılmış hareket tercihinde ilk metni sabit tutar', () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    render(<MetinDongusu metinler={['TABLOLAR', 'KULLANMA TALİMATLARI']} gecisSuresi={2600} />);

    act(() => vi.advanceTimersByTime(5200));
    expect(screen.getByTestId('donen-metin')).toHaveTextContent('TABLOLAR');
  });
});
