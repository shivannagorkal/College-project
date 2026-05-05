import { PageCarousel } from '@/components/shared/PageCarousel';

export function PageHeader({ title, subtitle, page }) {
  return (
    <PageCarousel page={page} height="280px">
      <div className="text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-white/90">{subtitle}</p>
        )}
      </div>
    </PageCarousel>
  );
}
