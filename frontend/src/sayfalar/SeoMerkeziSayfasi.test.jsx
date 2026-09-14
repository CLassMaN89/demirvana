import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import SeoMerkeziSayfasi from './SeoMerkeziSayfasi';

describe('SeoMerkeziSayfasi', () => {
  test('yedi SEO sekmesini gösterir ve seçimi URL sorgusuna yazar', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=genel-bakis']}><SeoMerkeziSayfasi /></MemoryRouter>);
    const sekmeler = screen.getByRole('navigation', { name: 'SEO Merkezi bölümleri' });
    expect(sekmeler.querySelectorAll('button')).toHaveLength(7);
    fireEvent.click(screen.getByRole('button', { name: 'Site Sağlığı' }));
    expect(await screen.findByRole('heading', { name: 'Site Sağlığı' })).toBeInTheDocument();
  });

  test('geçersiz sekmede genel bakışı açar ve sahte değer göstermez', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=bilinmeyen']}><SeoMerkeziSayfasi /></MemoryRouter>);
    expect(await screen.findByText('Google Görünürlüğü')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(5);
  });
});
