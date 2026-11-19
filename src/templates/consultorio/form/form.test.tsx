import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { tConsultorioFormData } from './form-schema';
import { saveConsultorio } from '../actions';
import { Form } from './form';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  getAll: vi.fn().mockResolvedValue([]),
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveConsultorio: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/hooks/get-cep', () => ({
  useGetCep: () => ({
    fetchCep: vi.fn().mockResolvedValue(undefined),
    loadingCep: false,
  }),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: () => <button type="submit">Save consultorio</button>,
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
}));

vi.mock('@/components/scroll-to-top', () => ({
  ScrollToTop: () => null,
}));

vi.mock('@/components/list-tab-content', () => ({
  ListTabContent: () => null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Consultorio Form', () => {
  const validConsultorio: tConsultorioFormData = {
    nome: 'Consultório Central',
    cobranca: 'consultorio',
    cep: '09078-580',
    numero: '203',
    email: 'contato@consultorio.com',
    complemento: '',
    cep_entrega: '',
    numero_entrega: '',
    complemento_entrega: '',
    observacao: '',
    telefones: ['(11) 98765-9876'],
    dentistas: ['dentista-id'],
    secretarias: ['secretaria-id'],
  };

  beforeEach(() => {
    vi.mocked(saveConsultorio).mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tConsultorioFormData> = validConsultorio) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Form {...data} />
      </QueryClientProvider>
    );
  }

  it('renders the consultorio fields and all form tabs', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Consultório Central'
    );
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveValue(
      'contato@consultorio.com'
    );
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Telefones' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Dentistas' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Secretárias' })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Dados de Entrega' })
    ).toBeInTheDocument();
  });

  it('submits valid consultorio data and redirects to the list', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save consultorio' }));

    await waitFor(() => {
      expect(saveConsultorio).toHaveBeenCalledWith({
        ...validConsultorio,
        id: '',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/consultorio');
  });

  it('shows validation errors and does not submit incomplete data', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save consultorio' }));

    expect(await screen.findAllByText('Campo obrigatório.')).not.toHaveLength(0);
    expect(saveConsultorio).not.toHaveBeenCalled();
  });
});
