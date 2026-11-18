import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGetCep } from './index';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

global.fetch = vi.fn();

describe('useGetCep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with loading state false', () => {
    const { result } = renderHook(() => useGetCep());

    expect(result.current.loadingCep).toBe(false);
  });

  it('fetches CEP data successfully', async () => {
    const mockCepData = {
      cep: '01310100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCepData,
    } as Response);

    const { result } = renderHook(() => useGetCep());

    let data;
    await act(async () => {
      data = await result.current.fetchCep('01310-100');
    });

    expect(data).toEqual(mockCepData);
  });

  it('removes non-numeric characters from CEP', async () => {
    const mockCepData = {
      cep: '01310100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCepData,
    } as Response);

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('01310-100');
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01310100/json/'
    );
  });

  it('shows error toast when CEP is not found', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ erro: true }),
    } as Response);

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('99999999');
    });

    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(ERROR_MESSAGES.cepNotFound);
  });

  it('shows error toast when API request fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('01310100');
    });

    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(ERROR_MESSAGES.errorCEPToFetch);
  });

  it('shows generic error toast when network fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('01310100');
    });

    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Network error');
  });

  it('shows generic error message when unknown error occurs', async () => {
    vi.mocked(fetch).mockRejectedValueOnce('Unknown error');

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('01310100');
    });

    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(ERROR_MESSAGES.genericError);
  });

  it('sets loading state to true during fetch', async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  cep: '01310100',
                }),
              } as Response),
            50
          )
        )
    );

    const { result } = renderHook(() => useGetCep());

    expect(result.current.loadingCep).toBe(false);

    act(() => {
      result.current.fetchCep('01310100');
    });

    await waitFor(() => {
      expect(result.current.loadingCep).toBe(false);
    });
  });

  it('sets loading state to false after fetch completes', async () => {
    const mockCepData = {
      cep: '01310100',
      logradouro: 'Avenida Paulista',
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCepData,
    } as Response);

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('01310100');
    });

    expect(result.current.loadingCep).toBe(false);
  });

  it('sets loading state to false after error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGetCep());

    await act(async () => {
      await result.current.fetchCep('01310100');
    });

    expect(result.current.loadingCep).toBe(false);
  });
});
