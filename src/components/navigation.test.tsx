import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { iNavigation } from '@/models/navigation';
import { Navigation } from './navigation';

const router = vi.hoisted(() => ({ back: vi.fn(), push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

const navigation: iNavigation[] = [
  { nav: 'voltar', action: 'goBack', applyDisable: true },
  { nav: 'home', action: 'goHome', applyDisable: false },
  { nav: 'salvar', applyDisable: true },
  { nav: 'deletar', applyDisable: true },
  { nav: 'print', action: 'print', applyDisable: false },
  { nav: 'refresh', action: 'refresh', applyDisable: false },
];

describe('Navigation', () => {
  it('omits delete when there is no record id', () => {
    render(<Navigation navigation={navigation} />);
    expect(screen.queryByTitle('deletar')).not.toBeInTheDocument();
  });

  it('routes back and home and invokes print and refresh callbacks', () => {
    const onPrint = vi.fn();
    const onRefresh = vi.fn();
    render(<Navigation navigation={navigation} onPrint={onPrint} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByTitle('voltar'));
    fireEvent.click(screen.getByTitle('home'));
    fireEvent.click(screen.getByTitle('imprimir'));
    fireEvent.click(screen.getByTitle('atualizar'));
    expect(router.back).toHaveBeenCalledOnce();
    expect(router.push).toHaveBeenCalledWith('/');
    expect(onPrint).toHaveBeenCalledOnce();
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it('requires confirmation before deleting', () => {
    const onDelete = vi.fn();
    render(<Navigation id="1" navigation={navigation} onDelete={onDelete} />);

    fireEvent.click(screen.getByTitle('deletar'));
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByText('Tem certeza que deseja continuar?')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Confirmar'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('disables applicable actions on secondary tabs', () => {
    render(<Navigation id="1" navigation={navigation} isMainTab={false} />);

    expect(screen.getByTitle('voltar')).toBeDisabled();
    expect(screen.getByTitle('salvar')).toBeDisabled();
    expect(screen.getByTitle('deletar')).toBeDisabled();
    expect(screen.getByTitle('home')).toBeEnabled();
  });

  it('applies disabled only to configured buttons', () => {
    render(<Navigation navigation={navigation} disabled />);

    expect(screen.getByTitle('voltar')).toBeDisabled();
    expect(screen.getByTitle('salvar')).toBeDisabled();
    expect(screen.getByTitle('home')).toBeEnabled();
  });
});
