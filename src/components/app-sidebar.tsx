import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { features } from '@/data/features';
import { Menu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import Link from 'next/link';

interface AppSidebarProps {
  isAdmin: boolean;
}

export const AppSidebar = ({ isAdmin }: AppSidebarProps) => {
  const visibleFeatures = features.filter(
    (item) => !item?.adminOnly || isAdmin
  );

  return (
    <div className="absolute left-0 flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Escolha uma das opções abaixo para navegar
            </SheetDescription>
          </SheetHeader>
          <div className="no-scrollbar overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-6 p-2">
              {visibleFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <SheetClose asChild key={item.title}>
                    <Link href={item.link}>
                      <Card className="cursor-pointer border-b border-blue-800/30 bg-linear-to-r from-gray-50 to-gray-100 text-center text-xs shadow-lg backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/80">
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="mx-auto">
                          <Icon size={30} className="text-blue-950" />
                        </CardContent>
                      </Card>
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
