import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { List } from './list';
import { iItensProps } from '@/models/itens';

// Mock UI components
vi.mock('./ui/button', () => ({
  Button: ({ children, onClick, ...props }: React.ComponentProps<'button'>) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('./ui/item', () => ({
  Item: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="list-item">{children}</div>
  ),
  ItemContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ItemDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  ItemActions: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="item-actions">{children}</div>
  ),
}));

vi.mock('./empty-data', () => ({
  EmptyData: () => <div data-testid="empty-data">No items</div>,
}));

describe('List', () => {
  const mockItems: iItensProps[] = [
    { id: '1', value: 'Item 1' },
    { id: '2', value: 'Item 2' },
  ];

  it('renders list container', () => {
    const handleAction = vi.fn();

    const { container } = render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  it('renders add new button', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const button = screen.getByTitle('inserir novo registro');
    expect(button).toBeInTheDocument();
  });

  it('calls onAction with new action when add button is clicked', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const button = screen.getByTitle('inserir novo registro');
    fireEvent.click(button);

    expect(handleAction).toHaveBeenCalledWith({ action: 'new' });
  });

  it('renders all items', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders edit button for each item', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const editButtons = screen.getAllByTitle('Editar');
    expect(editButtons).toHaveLength(2);
  });

  it('renders delete button for each item', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const deleteButtons = screen.getAllByTitle('Excluir');
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onAction with edit action when edit button is clicked', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const editButtons = screen.getAllByTitle('Editar');
    fireEvent.click(editButtons[0]);

    expect(handleAction).toHaveBeenCalledWith({
      idOrValue: '1',
      fieldForm: 'testField',
      action: 'edit',
    });
  });

  it('calls onAction with delete action when delete button is clicked', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(handleAction).toHaveBeenCalledWith({
      idOrValue: '1',
      fieldForm: 'testField',
      action: 'delete',
    });
  });

  it('shows empty data when items array is empty', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={[]}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
  });

  it('does not show items when empty', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={[]}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    expect(screen.queryByTestId('list-item')).not.toBeInTheDocument();
  });

  it('renders children component', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div data-testid="child-component">Child Content</div>
      </List>
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const handleAction = vi.fn();

    const { container } = render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const wrapper = container.querySelector('.flex.w-full.flex-col.gap-6');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with md responsive padding', () => {
    const handleAction = vi.fn();

    const { container } = render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const wrapper = container.querySelector('.md\\:px-20');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders action buttons container for each item', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const actionContainers = screen.getAllByTestId('item-actions');
    expect(actionContainers).toHaveLength(2);
  });

  it('renders with correct add button styling', () => {
    const handleAction = vi.fn();

    render(
      <List
        itens={mockItems}
        fieldForm="testField"
        onAction={handleAction}
      >
        <div>Children</div>
      </List>
    );

    const button = screen.getByTitle('inserir novo registro');
    expect(button).toHaveClass('h-10', 'w-auto', 'cursor-pointer');
  });
});
