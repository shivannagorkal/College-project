import { useEffect, useRef, useState } from 'react';
import { CircleAlert as AlertCircle } from 'lucide-react';

export function AnnouncementTicker({ announcements = [] }) {
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!scrollContainerRef.current || announcements.length === 0) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    if (scrollWidth <= clientWidth) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        let newPos = prev + 2;
        if (newPos > scrollWidth - clientWidth) {
          newPos = 0;
        }
        return newPos;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [announcements]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  if (!announcements.length) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-hidden scroll-smooth"
          >
            {announcements.map((announcement, index) => (
              <div key={index} className="shrink-0 whitespace-nowrap">
                <p className="text-sm font-medium">{announcement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
