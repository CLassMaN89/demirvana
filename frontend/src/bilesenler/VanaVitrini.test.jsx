import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import VanaVitrini from './VanaVitrini';

describe('VanaVitrini', () => {
  it('yönetilebilir başlık ve vana görsellerini doğru bağlantılarla gösterir', () => {
    const kategoriler = [{ id: 1, ad: 'Küresel Vanalar', slug: 'kuresel-vanalar', gorsel_yolu: '/vana.webp', alternatif_metin: 'Küresel vana' }];
    render(<MemoryRouter><VanaVitrini kategoriler={kategoriler} siteAyarlari={{ vana_vitrini_basligi: 'Özel Vitrin' }} /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Özel Vitrin' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Küresel vana' })).toHaveAttribute('src', '/vana.webp');
    expect(screen.getByRole('link', { name: /Küresel Vanalar/i })).toHaveAttribute('href', '/kategoriler/kuresel-vanalar');
  });
});
