export function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-lg opacity-90">{subtitle}</p>}
      </div>
    </div>
  );
}
