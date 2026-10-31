import { LucideIcon } from 'lucide-react';
import { Separator } from './ui/separator';

interface iAboutSectionProps {
  title: string | undefined;
  subtitle: string | undefined;
  icon: LucideIcon;
}

export const AboutSection = ({
  title,
  subtitle,
  icon: Icon,
}: iAboutSectionProps) => {
  return (
    <div className="py-5">
      <div className="text-foreground flex items-center justify-center gap-3 text-2xl font-medium">
        {<Icon className="hidden text-blue-400 md:block" />}
        <span className="text-center">{title}</span>
      </div>
      <Separator className="mt-2 mb-2" />
      <div className="flex justify-center text-lg font-light text-gray-950">
        <span className="text-center">{subtitle}</span>
      </div>
    </div>
  );
};
