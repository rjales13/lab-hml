import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-4 text-blue-950 bg-clip-text"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
        <Image
          src="/lm.png"
          width={300}
          height={300}
          alt="Laboratorio Marcelo"
          className="object-cover"
        />
      </div>
      <span className="hidden md:block">Laboratório Marcelo</span>
    </Link>
  );
};
