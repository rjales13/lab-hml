import { render, screen } from '@testing-library/react';
import { Info } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { AboutSection } from './about-section';

describe('AboutSection', () => {
  it('displays the title, subtitle and separator', () => {
    const { container } = render(<AboutSection title="Sobre nós" subtitle="Nosso laboratório" icon={Info} />);

    expect(screen.getByText('Sobre nós')).toBeInTheDocument();
    expect(screen.getByText('Nosso laboratório')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
  });

  it('supports undefined title and subtitle', () => {
    const { container } = render(<AboutSection title={undefined} subtitle={undefined} icon={Info} />);

    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
  });
});
