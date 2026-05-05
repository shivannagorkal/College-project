import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { GalleryCard } from '@/components/shared/GalleryCard';
import { Spinner } from '@/components/ui/spinner';
import { useFetch } from '@/hooks/useFetch';
import { galleryService } from '@/services/galleryService';
import { GALLERY_CATEGORIES, YEARS } from '@/utils/constants';


export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('Sports');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { data: images, loading } = useFetch(() => galleryService.getImages());

  const displayImages = Array.isArray(images) ? images : [];
  const filtered = selectedCategory === 'all'
  ? displayImages
  : displayImages.filter((img) => img.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Gallery" page="gallery" subtitle="Photo gallery of college activities" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Category:</label>
                <ToggleGroup type="single" value={selectedCategory} onValueChange={setSelectedCategory}>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <ToggleGroupItem key={cat} value={cat}>
                      {cat}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-semibold">Year:</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div>
              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No images found for selected filters</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((image) => (
                    <GalleryCard key={image.id || image._id} {...image} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
