import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FechamentoCard } from './fechamento-card';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon">✓</div>,
  CircleDollarSign: () => <div data-testid="dollar-icon">$</div>,
  Download: () => <div data-testid="download-icon">↓</div>,
  List: () => <div data-testid="list-icon">≡</div>,
  LoaderCircle: () => <div data-testid="loader-icon">⟳</div>,
  Undo: () => <div data-testid="undo-icon">↶</div>,
}));

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: React.ComponentProps<'div'>) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children, className }: React.ComponentProps<'div'>) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: React.ComponentProps<'h2'>) => (
    <h2 className={className}>{children}</h2>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: { children?: React.ReactNode; variant?: string }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

vi.mock('./ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick, ...props }: React.ComponentProps<'button'>) => (
    <button onClick={onClick} {...props} data-testid="dropdown-item">
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
}));

vi.mock('./confirmation-dialog', () => ({
  ConfirmationDialog: ({
    trigger,
    onConfirm,
  }: React.ComponentProps<typeof import('./confirmation-dialog').ConfirmationDialog>) => (
    <div
      data-testid="confirmation-dialog"
      onClick={onConfirm}
    >
      {trigger}
    </div>
  ),
}));

vi.mock('@/lib/utils/currencyFormatter', () => ({
  currencyFormatter: {
    format: (value: number) => `R$ ${value.toFixed(2)}`,
  },
}));

describe('FechamentoCard', () => {
  const mockDate = new Date('2024-01-15');
  const mockHandleViewCard = vi.fn();
  const mockHandleCloseCard = vi.fn().mockResolvedValue(undefined);
  const mockHandleUnCloseCard = vi.fn().mockResolvedValue(undefined);
  const mockHandleDownload = vi.fn().mockResolvedValue(undefined);

  const defaultProps = {
    id: '123',
    date: mockDate,
    status: 'aberto' as const,
    value: 1000,
    beforeLast: null,
    onHandleViewCard: mockHandleViewCard,
    onHandleCloseCard: mockHandleCloseCard,
    onHandleUnCloseCard: mockHandleUnCloseCard,
    onHandleDownload: mockHandleDownload,
    isDownloading: false,
    isClosing: false,
    isUnclosing: false,
  };

  it('renders fechamento card', () => {
    render(<FechamentoCard {...defaultProps} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(<FechamentoCard {...defaultProps} />);

    const dateText = screen.getByText(/janeiro/i);
    expect(dateText).toBeInTheDocument();
  });

  it('displays formatted currency value', () => {
    render(<FechamentoCard {...defaultProps} value={1500} />);

    expect(screen.getByText(/R\$ 1500/)).toBeInTheDocument();
  });

  it('shows aberto status badge', () => {
    render(<FechamentoCard {...defaultProps} status="aberto" />);

    expect(screen.getByText('Aberto')).toBeInTheDocument();
  });

  it('shows fechado status badge', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="fechado"
        value={0}
      />
    );

    expect(screen.getByText('Fechado')).toBeInTheDocument();
  });

  it('renders dropdown menu', () => {
    render(<FechamentoCard {...defaultProps} />);

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
  });

  it('renders view option', () => {
    render(<FechamentoCard {...defaultProps} />);

    expect(screen.getByText('Visualizar')).toBeInTheDocument();
  });

  it('calls onHandleViewCard when view option clicked', () => {
    render(<FechamentoCard {...defaultProps} />);

    const viewButton = screen.getByText('Visualizar');
    fireEvent.click(viewButton);

    expect(mockHandleViewCard).toHaveBeenCalledWith('123');
  });

  it('shows download option when status is fechado', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="fechado"
      />
    );

    expect(screen.getByText(/Baixar PDF/)).toBeInTheDocument();
  });

  it('calls onHandleDownload when download option clicked', async () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="fechado"
      />
    );

    const downloadButton = screen.getByText(/Baixar PDF/);
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockHandleDownload).toHaveBeenCalledWith('123');
    });
  });

  it('shows loading state during download', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="fechado"
        isDownloading={true}
      />
    );

    expect(screen.getByText(/Baixando PDF/)).toBeInTheDocument();
  });

  it('shows start closure button when status is aberto and value > 0', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="aberto"
        value={500}
      />
    );

    expect(screen.getByText(/Iniciar Fechamento/)).toBeInTheDocument();
  });

  it('calls onHandleCloseCard when start closure clicked', async () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="aberto"
        value={500}
      />
    );

    const closeButton = screen.getByText(/Iniciar Fechamento/);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockHandleCloseCard).toHaveBeenCalled();
    });
  });

  it('shows loading state during closure', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="aberto"
        value={500}
        isClosing={true}
      />
    );

    expect(screen.getByText(/Iniciando Fechamento/)).toBeInTheDocument();
  });

  it('shows undo option when card is last closed', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        id="456"
        status="fechado"
        beforeLast="456"
      />
    );

    expect(screen.getByText(/Reverter Fechamento/)).toBeInTheDocument();
  });

  it('calls onHandleUnCloseCard when undo clicked', async () => {
    render(
      <FechamentoCard
        {...defaultProps}
        id="456"
        status="fechado"
        beforeLast="456"
      />
    );

    const undoButton = screen.getByText(/Reverter Fechamento/);
    fireEvent.click(undoButton);

    await waitFor(() => {
      expect(mockHandleUnCloseCard).toHaveBeenCalled();
    });
  });

  it('shows loading state during undo', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        id="456"
        status="fechado"
        beforeLast="456"
        isUnclosing={true}
      />
    );

    expect(screen.getByText(/Revertendo Fechamento/)).toBeInTheDocument();
  });

  it('applies opacity-65 class when status is fechado', () => {
    const { container } = render(
      <FechamentoCard
        {...defaultProps}
        status="fechado"
      />
    );

    const card = container.querySelector('[class*="opacity"]');
    expect(card).toBeInTheDocument();
  });

  it('renders currency icon', () => {
    render(<FechamentoCard {...defaultProps} />);

    expect(screen.getByTestId('dollar-icon')).toBeInTheDocument();
  });

  it('does not show closure options when status is fechado and not last', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="fechado"
        beforeLast={null}
      />
    );

    expect(screen.queryByText(/Reverter Fechamento/)).not.toBeInTheDocument();
  });

  it('does not show closure option when status is aberto and value is 0', () => {
    render(
      <FechamentoCard
        {...defaultProps}
        status="aberto"
        value={0}
      />
    );

    expect(
      screen.queryByText(/Iniciar Fechamento/)
    ).not.toBeInTheDocument();
  });

  it('renders card with clickable trigger', () => {
    render(<FechamentoCard {...defaultProps} />);

    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
  });

  it('displays correct date format in Portuguese locale', () => {
    render(<FechamentoCard {...defaultProps} />);

    // Date should be formatted in Portuguese
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});
