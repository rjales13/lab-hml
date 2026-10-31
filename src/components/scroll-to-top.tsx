import { scrollToTop } from '@/lib/utils/scrollToTop';
import { CircleArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  return (
    <div className="flex justify-end">
      <CircleArrowUp
        onClick={scrollToTop}
        className="animate-pulse cursor-pointer rounded-2xl"
        size={25}
      >
        <title>Top</title>
      </CircleArrowUp>
    </div>
  );
};
