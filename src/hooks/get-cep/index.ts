import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useGetCep() {
  const [loadingCep, setLoadingCep] = useState(false);

  const fetchCep = useCallback(async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');

    setLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );

      if (!response.ok) throw new Error(ERROR_MESSAGES.errorCEPToFetch);

      const result = await response.json();

      if (result.erro) throw new Error(ERROR_MESSAGES.cepNotFound);

      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : ERROR_MESSAGES.genericError;
      toast.error(message);
    } finally {
      setLoadingCep(false);
    }
  }, []);

  return {
    fetchCep,
    loadingCep,
  };
}
