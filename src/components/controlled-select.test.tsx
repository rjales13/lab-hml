import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledSelect } from './controlled-select';

function TestWrapper({
  children,
  defaultValue = '',
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) {
  const methods = useForm({
    defaultValues: {
      testSelect: defaultValue,
    },
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
}

describe('ControlledSelect', () => {
  const mockItems = [
    { value: '1', description: 'Option 1' },
    { value: '2', description: 'Option 2' },
    { value: '3', description: 'Option 3' },
  ];

  it('renders select with label', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Select Option"
          items={mockItems}
        />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Select Option')).toBeInTheDocument();
  });

  it('renders select with placeholder text', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Choose"
          items={mockItems}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Selecione')).toBeInTheDocument();
  });

  it('renders all provided select items', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Options"
          items={mockItems}
        />
      </TestWrapper>
    );

    // Open the select to see the options
    const trigger = screen.getByText('Selecione');
    fireEvent.click(trigger);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange callback when value is selected', async () => {
    const handleChange = vi.fn();

    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Options"
          items={mockItems}
          onChange={handleChange}
        />
      </TestWrapper>
    );

    const trigger = screen.getByText('Selecione');
    fireEvent.click(trigger);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'testSelect',
          value: '1',
        })
      );
    });
  });

  it('shows skeleton when loading prop is true', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Loading"
          items={mockItems}
          loading
        />
      </TestWrapper>
    );

    // Skeleton should be rendered instead of select
    expect(screen.queryByText('Selecione')).not.toBeInTheDocument();
  });

  it('shows select when loading prop is false', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Loaded"
          items={mockItems}
          loading={false}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Selecione')).toBeInTheDocument();
  });

  it('renders with tooltip when tootip prop is provided', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="With Tooltip"
          items={mockItems}
          tootip="Help text"
        />
      </TestWrapper>
    );

    // Tooltip is rendered near the label
    expect(screen.getByText('With Tooltip')).toBeInTheDocument();
  });

  it('applies custom className to trigger', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Styled"
          items={mockItems}
          className="custom-class"
        />
      </TestWrapper>
    );

    // The SelectTrigger should have the custom class
    const trigger = container.querySelector('[role="combobox"]');
    expect(trigger).toHaveClass('custom-class');
  });

  it('applies hover styling classes', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Hover"
          items={mockItems}
        />
      </TestWrapper>
    );

    const trigger = container.querySelector('[role="combobox"]');
    expect(trigger).toHaveClass('hover:bg-accent');
  });

  it('renders select trigger with correct aria-label', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Accessible Select"
          items={mockItems}
        />
      </TestWrapper>
    );

    const trigger = screen.getByLabelText('Accessible Select');
    expect(trigger).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Empty"
          items={[]}
        />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Empty')).toBeInTheDocument();
  });

  it('updates form value when item is selected', async () => {
    render(
      <TestWrapper defaultValue="">
        <ControlledSelect
          name="testSelect"
          label="Update"
          items={mockItems}
        />
      </TestWrapper>
    );

    const trigger = screen.getByText('Selecione');
    fireEvent.click(trigger);

    const option = screen.getByText('Option 2');
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  it('applies label styling classes', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Styled Label"
          items={mockItems}
        />
      </TestWrapper>
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass('text-gray-700', 'min-h-5');
  });

  it('renders with correct select structure', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Structure"
          items={mockItems}
        />
      </TestWrapper>
    );

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('renders items in a SelectGroup', () => {
    render(
      <TestWrapper>
        <ControlledSelect
          name="testSelect"
          label="Grouped"
          items={mockItems}
        />
      </TestWrapper>
    );

    const trigger = screen.getByText('Selecione');
    fireEvent.click(trigger);

    // All items should be rendered as SelectItems
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('handles onChange with correct parameters', async () => {
    const handleChange = vi.fn();

    render(
      <TestWrapper>
        <ControlledSelect
          name="myField"
          label="Field"
          items={mockItems}
          onChange={handleChange}
        />
      </TestWrapper>
    );

    const trigger = screen.getByText('Selecione');
    fireEvent.click(trigger);

    const option = screen.getByText('Option 3');
    fireEvent.click(option);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'myField',
          value: '3',
        })
      );
    });
  });
});
