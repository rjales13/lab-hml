import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListTabContent } from './list-tab-content';
import { iListTabContentProps } from '@/models/list-tab-content';

// Mock custom hook
vi.mock('@/hooks/custom-field', () => ({
  useCustomField: () => ({
    handleCustomField: vi.fn(),
  }),
}));

// Mock UI components
vi.mock('./ui/skeleton', () => ({
  Skeleton: ({ className }: Record<string, unknown>) => (
    <div data-testid="skeleton" className={className as string} />
  ),
}));

vi.mock('./list', () => ({
  List: ({ children, itens }: React.ComponentProps<typeof import('./list').List>) => (
    <div data-testid="list">
      {Array.isArray(itens) && itens.map((item: { id: string; value: string }) => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.value}
        </div>
      ))}
      {children}
    </div>
  ),
}));

vi.mock('./list-sheet', () => ({
  ListSheet: ({ fieldLabel }: React.ComponentProps<typeof import('./list-sheet').ListSheet>) => (
    <div data-testid="list-sheet">{fieldLabel}</div>
  ),
}));

vi.mock('@/lib/utils/monetaryFormat', () => ({
  monetaryFormat: (value: string) => `R$ ${value}`,
}));

describe('ListTabContent', () => {
  const defaultProps: iListTabContentProps = {
    type: 'input',
    isPending: false,
    itens: ['100', '200', '300'],
    fieldForm: 'testField',
    fieldLabel: 'Test Label',
    placeholder: 'Enter value',
    monetary: false,
    mask: undefined,
    commandData: undefined,
  };

  it('renders list tab content', () => {
    render(<ListTabContent {...defaultProps} />);

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('shows skeleton when isPending is true', () => {
    render(<ListTabContent {...defaultProps} isPending={true} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders list items', () => {
    render(<ListTabContent {...defaultProps} />);

    expect(screen.getByTestId('item-100')).toBeInTheDocument();
    expect(screen.getByTestId('item-200')).toBeInTheDocument();
    expect(screen.getByTestId('item-300')).toBeInTheDocument();
  });

  it('renders with input type', () => {
    render(<ListTabContent {...defaultProps} type="input" />);

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders with select type', () => {
    render(
      <ListTabContent
        {...defaultProps}
        type="select"
        commandData={[
          { id: '1', value: 'Option 1' },
          { id: '2', value: 'Option 2' },
        ]}
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('applies monetary formatting when monetary is true', () => {
    render(<ListTabContent {...defaultProps} monetary={true} type="input" />);

    expect(screen.getByText(/R\$ 100/)).toBeInTheDocument();
  });

  it('renders list sheet component', () => {
    render(<ListTabContent {...defaultProps} />);

    expect(screen.getByTestId('list-sheet')).toBeInTheDocument();
  });

  it('passes field label to list sheet', () => {
    render(
      <ListTabContent
        {...defaultProps}
        fieldLabel="Custom Label"
      />
    );

    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('renders with select type and command data', () => {
    const commandData = [
      { id: '100', value: 'Value 100' },
      { id: '200', value: 'Value 200' },
    ];

    render(
      <ListTabContent
        {...defaultProps}
        type="select"
        itens={['100', '200']}
        commandData={commandData}
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders with select type and optional command data', () => {
    render(
      <ListTabContent
        {...defaultProps}
        type="select"
        itens={['100', '200']}
        commandData={[
          { id: '100', value: 'Option 100' },
          { id: '200', value: 'Option 200' },
        ]}
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders with mask prop', () => {
    render(
      <ListTabContent
        {...defaultProps}
        mask="(##) #####-####"
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <ListTabContent
        {...defaultProps}
        placeholder="Enter custom value"
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders with empty items array', () => {
    render(
      <ListTabContent
        {...defaultProps}
        itens={[]}
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    const { rerender } = render(
      <ListTabContent {...defaultProps} isPending={false} />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();

    rerender(<ListTabContent {...defaultProps} isPending={true} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders with correct field form value', () => {
    render(
      <ListTabContent
        {...defaultProps}
        fieldForm="customFormField"
      />
    );

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders with select type and matches command data values', () => {
    const commandData = [
      { id: '100', value: 'First Item' },
      { id: '200', value: 'Second Item' },
    ];

    render(
      <ListTabContent
        {...defaultProps}
        type="select"
        itens={['100', '200']}
        commandData={commandData}
      />
    );

    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
  });

  it('handles monetary format with input type', () => {
    render(
      <ListTabContent
        {...defaultProps}
        type="input"
        monetary={true}
        itens={['50', '75', '100']}
      />
    );

    expect(screen.getByText(/R\$ 50/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 75/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 100/)).toBeInTheDocument();
  });

  it('renders skeleton with correct height class', () => {
    render(<ListTabContent {...defaultProps} isPending={true} />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-40');
  });

  it('renders all items without filtering', () => {
    const items = ['10', '20', '30', '40', '50'];

    render(
      <ListTabContent
        {...defaultProps}
        itens={items}
      />
    );

    items.forEach((item) => {
      expect(screen.getByTestId(`item-${item}`)).toBeInTheDocument();
    });
  });
});
