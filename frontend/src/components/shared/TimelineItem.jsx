export function TimelineItem({ year, title, description, isLeft }) {
  return (
    <div className={`flex gap-8 mb-8 ${isLeft ? 'flex-row-reverse' : ''}`}>
      {/* Timeline node */}
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary mb-4"></div>
        <div className="w-1 h-32 bg-gray-300"></div>
      </div>
      {/* Content */}
      <div className={`pt-2 ${isLeft ? 'text-right' : ''}`}>
        <span className="text-primary font-bold text-lg">{year}</span>
        <h3 className="text-xl font-bold mt-1 mb-2">{title}</h3>
        <p className="text-gray-700 max-w-md">{description}</p>
      </div>
    </div>
  );
}
