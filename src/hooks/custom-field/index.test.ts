import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { createElement } from 'react';
import { useCustomField } from './index';

type CustomFieldForm = { fields: string[] };

function getTestWrapper() {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const methods = useForm<CustomFieldForm>({
      defaultValues: {
        fields: ['field1', 'field2', 'field3'],
      },
    });

    // FormProvider accepts the form methods and children
    // For createElement, pass methods as first prop, then spread required props
    const props = { ...methods, children } as never;
    return createElement(FormProvider, props);
  }
  return TestWrapper;
}

describe('useCustomField', () => {
  let setFieldToEdit: ReturnType<typeof vi.fn>;
  let setOpenSheet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setFieldToEdit = vi.fn();
    setOpenSheet = vi.fn();
  });

  it('opens sheet for new field', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'new',
        idOrValue: undefined,
      });
    });

    expect(setFieldToEdit).toHaveBeenCalledWith('');
    expect(setOpenSheet).toHaveBeenCalledWith(true);
  });

  it('opens sheet for editing with field value', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'edit',
        idOrValue: 'field1',
      });
    });

    expect(setFieldToEdit).toHaveBeenCalledWith('field1');
    expect(setOpenSheet).toHaveBeenCalledWith(true);
  });

  it('deletes a field from the list', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'delete',
        idOrValue: 'field1',
        fieldForm: 'fields',
      });
    });

    expect(setOpenSheet).not.toHaveBeenCalled();
  });

  it('inserts a new field at the beginning', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'save',
        idOrValue: 'newField',
        fieldForm: 'fields',
      });
    });

    expect(setOpenSheet).not.toHaveBeenCalled();
  });

  it('updates an existing field value', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'save',
        idOrValue: 'updatedField',
        oldIdOrValue: 'field1',
        fieldForm: 'fields',
      });
    });

    expect(setOpenSheet).not.toHaveBeenCalled();
  });

  it('does not update field if new value already exists at same index', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'save',
        idOrValue: 'field1',
        oldIdOrValue: 'field1',
        fieldForm: 'fields',
      });
    });

    expect(setOpenSheet).not.toHaveBeenCalled();
  });

  it('handles missing fieldForm gracefully', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'delete',
        idOrValue: 'field1',
      });
    });

    expect(setOpenSheet).not.toHaveBeenCalled();
  });

  it('handles missing idOrValue gracefully', () => {
    const { result } = renderHook(
      () => useCustomField({ setFieldToEdit, setOpenSheet }),
      { wrapper: getTestWrapper() }
    );

    act(() => {
      result.current.handleCustomField({
        action: 'delete',
        fieldForm: 'fields',
      });
    });

    expect(setOpenSheet).not.toHaveBeenCalled();
  });
});
