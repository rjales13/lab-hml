'use client';
import { authCLient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { LogOut, User } from 'lucide-react';
import { Logo } from './logo';
import { Button } from './ui/button';
import { AppSidebar } from './app-sidebar';
import { useAuth } from '@/contexts/user-contexts';

export const Header = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const handleLogout = () => {
    authCLient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace('/login'); // redirect to login page
        },
      },
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-blue-800/30 bg-linear-to-r from-blue-200 to-blue-300/90 shadow-lg backdrop-blur-md">
      <div className="ls:px-8 mx-auto max-w-7xl px-8 sm:px-6 md:px-4">
        <div className="flex h-16 items-center justify-between">
          <AppSidebar isAdmin={isAdmin} />
          <Logo />
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex cursor-pointer gap-2 bg-transparent">
                  <User size={20} />
                  Olá {user?.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-33.75 gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="cursor-pointer flex-row items-center gap-2"
                          onClick={handleLogout}
                        >
                          <LogOut />
                          Sair
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};
