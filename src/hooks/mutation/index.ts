import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface MutationResult {
  error?: string;
}

interface iHandleMutationProps {
  mutationFn: () => Promise<MutationResult | undefined>;
  redirectPath?: string;
  successMessage: string;
}

export const useMutation = () => {
  const router = useRouter();

  const handleMutation = async ({
    mutationFn,
    successMessage,
    redirectPath,
  }: iHandleMutationProps) => {
    const result = await mutationFn();
    if (result?.error) {
      toast.error(result.error);
      return false;
    }

    toast.success(successMessage);
    if (redirectPath) router.push(`/${redirectPath}`);
  };

  return { handleMutation };
};
