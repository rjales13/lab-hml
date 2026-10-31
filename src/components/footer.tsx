'use client';

import Link from 'next/link';
import { features } from '@/data/features';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 max-h-20 w-full border-t border-blue-800/30 bg-linear-to-r from-blue-200 to-blue-300/90 shadow-lg backdrop-blur-md">
      <div className="flex justify-center gap-8 py-4">
        <nav className="flex items-center gap-3 text-sm text-blue-950 lg:gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.link}
                className="hover:text-blue-900"
              >
                <Icon className="w-5 md:w-fit">
                  <title>{item.title}</title>
                </Icon>
              </Link>
            );
          })}
        </nav>
      </div>
    </footer>
  );
};
