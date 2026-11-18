import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWarning } from './index';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
  },
}));

describe('useWarning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default tab', () => {
    const { result } = renderHook(() => useWarning());

    expect(result.current.activeTab).toBe('dados');
  });

  it('initializes with custom initial tab', () => {
    const { result } = renderHook(() =>
      useWarning({ initialTab: 'custom' })
    );

    expect(result.current.activeTab).toBe('custom');
  });

  it('updates active tab when changing to a different tab', () => {
    const { result } = renderHook(() => useWarning());

    act(() => {
      result.current.handleTabChange('new-tab');
    });

    expect(result.current.activeTab).toBe('new-tab');
  });

  it('shows warning toast when changing from main tab to another tab', () => {
    const { result } = renderHook(() =>
      useWarning({ mainTab: 'dados', initialTab: 'dados' })
    );

    act(() => {
      result.current.handleTabChange('other-tab');
    });

    expect(vi.mocked(toast.warning)).toHaveBeenCalledWith(
      'Não esqueça de salvar o formulário após fazer alterações nos registros.'
    );
  });

  it('does not show warning when changing to the same tab', () => {
    const { result } = renderHook(() =>
      useWarning({ mainTab: 'dados', initialTab: 'dados' })
    );

    act(() => {
      result.current.handleTabChange('dados');
    });

    expect(vi.mocked(toast.warning)).not.toHaveBeenCalled();
  });

  it('does not show warning when active tab is not the main tab', () => {
    const { result } = renderHook(() =>
      useWarning({ mainTab: 'dados', initialTab: 'other' })
    );

    act(() => {
      result.current.handleTabChange('another-tab');
    });

    expect(vi.mocked(toast.warning)).not.toHaveBeenCalled();
  });

  it('shows warning only once when changing away from main tab', () => {
    const { result } = renderHook(() =>
      useWarning({ mainTab: 'dados', initialTab: 'dados' })
    );

    act(() => {
      result.current.handleTabChange('tab1');
    });

    expect(vi.mocked(toast.warning)).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleTabChange('tab2');
    });

    expect(vi.mocked(toast.warning)).toHaveBeenCalledTimes(1);
  });

  it('provides setActiveTab function that updates tab', () => {
    const { result } = renderHook(() => useWarning());

    act(() => {
      result.current.setActiveTab('new-tab');
    });

    expect(result.current.activeTab).toBe('new-tab');
  });
});
