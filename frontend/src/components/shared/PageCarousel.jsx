import { useState, useEffect } from 'react';
import { carouselService } from '@/services/carouselService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PageCarousel({ page, height = '400px', children }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await carouselService.getCarouselImages(page);
        setImages(data);
      } catch (err) {
        console.error('Failed to fetch carousel images:', err);
        setImages([]);
      }
    };
    fetchImages();
  }, [page]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const prev = () =>
    setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () =>
    setCurrent(c => (c + 1) % images.length);

  return (
    <div
      className="relative w-full overflow-hidden min-h-100 md:min-h-120"
      style={{ height }}
    >
      {images.length > 0 ? (
        images.map((img, i) => (
          <div
            key={img._id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={img.image}
              alt={img.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #d97757, #c4623d)' }}
        />
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2
                       bg-white/20 hover:bg-white/40 text-white
                       rounded-full p-2 z-30 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       bg-white/20 hover:bg-white/40 text-white
                       rounded-full p-2 z-30 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2
                          -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition
                  ${i === current ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute inset-0 flex items-center
                      justify-center z-20">
        {children}
      </div>
    </div>
  );
}
