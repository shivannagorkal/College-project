import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export function GalleryCard({ image, category, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-lg bg-secondary cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="aspect-square bg-secondary">
          {imageLoading && <Skeleton className="w-full h-full" />}
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground text-4xl opacity-50">🖼️</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
          <div className="text-white opacity-0 group-hover:opacity-100 transition">
            {category && <Badge variant="secondary">{category}</Badge>}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          {image ? (
            <img src={image} alt={title} className="w-full h-auto rounded-lg" />
          ) : (
            <div className="w-full bg-linear-to-br from-primary to-secondary flex items-center justify-center py-32 rounded-lg">
              <span className="text-primary-foreground text-6xl opacity-50">🖼️</span>
            </div>
          )}
          {title && <p className="text-center font-semibold mt-2">{title}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
