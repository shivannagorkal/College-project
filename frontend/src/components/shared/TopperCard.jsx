export function TopperCard({ topper }) {
  const typeBadgeClass = {
    Board: 'bg-blue-100 text-blue-700',
    NEET: 'bg-green-100 text-green-700',
    JEE: 'bg-orange-100 text-orange-700',
    KCET: 'bg-purple-100 text-purple-700',
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="w-full" style={{ height: '220px' }}>
        {topper.photo ? (
          <img
            src={topper.photo}
            alt={topper.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
              {topper.name?.charAt(0)}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            {'\u{1F3C6}'} Rank #{topper.rank}
          </span>
          <span className="text-xs text-gray-500">{topper.year}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mt-1">
          {topper.name}
        </h3>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${typeBadgeClass[topper.topperType] || ''}`}
        >
          {topper.topperType}
        </span>

        {topper.topperType === 'Board' && (
          <div className="space-y-1 mt-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Stream:</span> {topper.stream}
              {topper.group ? ` (${topper.group})` : ''}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Percentage:</span>
              <span className="text-primary font-bold ml-1">
                {topper.percentage}%
              </span>
            </p>
          </div>
        )}

        {(topper.topperType === 'NEET' ||
          topper.topperType === 'JEE' ||
          topper.topperType === 'KCET') && (
          <div className="space-y-1 mt-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Score:</span>
              <span className="text-primary font-bold ml-1">
                {topper.score}/{topper.outOf}
              </span>
            </p>
            {topper.percentile > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Percentile:</span>
                <span className="text-primary font-bold ml-1">
                  {topper.percentile}
                </span>
              </p>
            )}
            {topper.topperType === 'KCET' && topper.karnatakaRank > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Karnataka Rank:</span>
                <span className="text-primary font-bold ml-1">
                  #{topper.karnatakaRank}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
