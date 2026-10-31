import { toast } from 'sonner';
import { useState, useCallback } from 'react';

interface UseWarningOptions {
  initialTab?: string;
  mainTab?: string;
}

export const useWarning = (options: UseWarningOptions = {}) => {
  const { initialTab = 'dados', mainTab = 'dados' } = options;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (mainTab !== newTab && activeTab === mainTab) {
        toast.warning(
          'Não esqueça de salvar o formulário após fazer alterações nos registros.'
        );
      }

      setActiveTab(newTab);
    },
    [mainTab, activeTab]
  );

  return {
    activeTab,
    setActiveTab: handleTabChange,
    handleTabChange,
  };
};
