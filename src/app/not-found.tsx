import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <FileQuestion size={64} className="mx-auto mb-6 text-black" />
      </div>

      <div className="relative mb-3 inline-block font-sans">
        <span className="inline-block -translate-x-1 -translate-y-2 -rotate-12 transform text-8xl font-bold text-black">
          4
        </span>
        <span className="inline-block text-8xl font-bold text-black">0</span>
        <span className="inline-block text-8xl font-bold text-black">4</span>
      </div>
      <p className="mb-8 text-black">Página não encontrada</p>
      <div className="mt-6 flex justify-center gap-4">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
