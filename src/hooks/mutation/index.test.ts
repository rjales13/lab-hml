import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMutation } from './index';
import { useRouter } from 'next/navigation';

interface MockedRouter {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (path: string) => void;
}

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(
    (): MockedRouter => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    })
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows success toast and returns true on successful mutation', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() => useMutation());

    let returnValue;
    await act(async () => {
      returnValue = await result.current.handleMutation({
        mutationFn: mockMutationFn,
        successMessage: 'Success!',
      });
    });

    const { toast } = await import('sonner');
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Success!');
    expect(returnValue).toBeUndefined();
  });

  it('shows error toast and returns false on mutation error', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue({
      error: 'Something went wrong',
    });

    const { result } = renderHook(() => useMutation());

    let returnValue;
    await act(async () => {
      returnValue = await result.current.handleMutation({
        mutationFn: mockMutationFn,
        successMessage: 'Success!',
      });
    });

    const { toast } = await import('sonner');
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Something went wrong');
    expect(returnValue).toBe(false);
  });

  it('redirects to specified path on success', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    const mockMutationFn = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() => useMutation());

    await act(async () => {
      await result.current.handleMutation({
        mutationFn: mockMutationFn,
        successMessage: 'Success!',
        redirectPath: 'consultorio',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/consultorio');
  });

  it('does not redirect if redirectPath is not provided', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    const mockMutationFn = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() => useMutation());

    await act(async () => {
      await result.current.handleMutation({
        mutationFn: mockMutationFn,
        successMessage: 'Success!',
      });
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not redirect on error even if redirectPath is provided', async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    const mockMutationFn = vi.fn().mockResolvedValue({
      error: 'Error occurred',
    });

    const { result } = renderHook(() => useMutation());

    await act(async () => {
      await result.current.handleMutation({
        mutationFn: mockMutationFn,
        successMessage: 'Success!',
        redirectPath: 'consultorio',
      });
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls the mutation function', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() => useMutation());

    await act(async () => {
      await result.current.handleMutation({
        mutationFn: mockMutationFn,
        successMessage: 'Success!',
      });
    });

    expect(mockMutationFn).toHaveBeenCalled();
  });
});
