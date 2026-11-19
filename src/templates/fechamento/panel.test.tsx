import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadFechamento, getFechamentos, handleFechamento } from './actions';
import { downloadFechamentoPdfs } from '@/lib/download-fechamento-pdfs';
import { Panel } from './panel';

const { routerPush, handleMutation } = vi.hoisted(() => ({
  routerPush: vi.fn(),
  handleMutation: vi.fn(),
}));

vi.mock('./actions', () => ({
  downloadFechamento: vi.fn(),
  getFechamentos: vi.fn(),
  handleFechamento: vi.fn(),
}));

vi.mock('@/lib/download-fechamento-pdfs', () => ({
  downloadFechamentoPdfs: vi.fn(),
}));

vi.mock('@/hooks/mutation', () => ({
  useMutation: () => ({ handleMutation }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange: (value: string) => void;
  }) => (
    <select aria-label="Ano" onChange={(event) => onValueChange(event.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => children,
  SelectGroup: ({ children }: { children: React.ReactNode }) => children,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => children,
  SelectValue: () => null,
}));

vi.mock('@/components/fechamento-card', () => ({
  FechamentoCard: ({
    id,
    onHandleViewCard,
    onHandleCloseCard,
    onHandleUnCloseCard,
    onHandleDownload,
  }: {
    id: string;
    onHandleViewCard: (id: string) => void;
    onHandleCloseCard: (data: { id: string; date: Date }) => Promise<void>;
    onHandleUnCloseCard: (data: { id: string }) => Promise<void>;
    onHandleDownload: (id: string) => Promise<void>;
  }) => (
    <div>
      <span>{id}</span>
      <button onClick={() => onHandleViewCard(id)}>View closeout</button>
      <button
        onClick={() =>
          void onHandleCloseCard({
            id,
            date: new Date('2026-03-01T00:00:00.000Z'),
          })
        }
      >
        Close closeout
      </button>
      <button onClick={() => void onHandleUnCloseCard({ id })}>
        Reopen closeout
      </button>
      <button onClick={() => void onHandleDownload(id)}>Download closeout</button>
    </div>
  ),
}));

describe('Panel', () => {
  beforeEach(() => {
    vi.mocked(getFechamentos).mockResolvedValue([]);
    vi.mocked(handleFechamento).mockResolvedValue(undefined);
    vi.mocked(downloadFechamento).mockResolvedValue([]);
    vi.mocked(downloadFechamentoPdfs).mockResolvedValue(undefined);
    handleMutation.mockImplementation(
      async ({ mutationFn }: { mutationFn: () => Promise<unknown> }) =>
        mutationFn()
    );
  });

  function renderPanel() {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Panel />
      </QueryClientProvider>
    );
  }

  it('displays the empty state when no closeouts are returned', async () => {
    renderPanel();

    expect(await screen.findByText('Não há registros...')).toBeInTheDocument();
    expect(getFechamentos).toHaveBeenCalledWith(new Date().getFullYear());
  });

  it('loads the selected year and navigates to a selected closeout', async () => {
    vi.mocked(getFechamentos).mockResolvedValue([
      {
        id: 'fechamento-1',
        fechado: true,
        valor: 100,
        data: new Date('2026-03-01T00:00:00.000Z'),
      },
    ]);
    renderPanel();

    fireEvent.change(screen.getByLabelText('Ano'), {
      target: { value: '2025' },
    });
    expect(await screen.findByText('fechamento-1')).toBeInTheDocument();
    await waitFor(() => {
      expect(getFechamentos).toHaveBeenCalledWith(2025);
    });

    fireEvent.click(screen.getByRole('button', { name: 'View closeout' }));
    expect(routerPush).toHaveBeenCalledWith('/fechamento/list/fechamento-1');
  });

  it('closes, reopens, and downloads a closeout through their server actions', async () => {
    vi.mocked(getFechamentos).mockResolvedValue([
      {
        id: 'fechamento-1',
        fechado: true,
        valor: 100,
        data: new Date('2026-03-01T00:00:00.000Z'),
      },
    ]);
    renderPanel();

    fireEvent.click(await screen.findByRole('button', { name: 'Close closeout' }));
    await waitFor(() => {
      expect(handleFechamento).toHaveBeenCalledWith({
        date: new Date('2026-03-01T00:00:00.000Z'),
      });
    });

    fireEvent.click(
      await screen.findByRole('button', { name: 'Reopen closeout' })
    );
    await waitFor(() => {
      expect(handleFechamento).toHaveBeenCalledWith({ id: 'fechamento-1' });
    });

    fireEvent.click(
      await screen.findByRole('button', { name: 'Download closeout' })
    );
    await waitFor(() => {
      expect(downloadFechamento).toHaveBeenCalledWith('fechamento-1');
      expect(downloadFechamentoPdfs).toHaveBeenCalledWith([]);
    });
  });
});
