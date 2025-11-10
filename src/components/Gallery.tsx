import { usePhotoStore } from '../store/photoStore';

export function Gallery() {
  const { livePhotos, reviews, setPhase, goToPhoto, logout } = usePhotoStore();

  const getPhotoDecision = (photoId: string) => {
    return reviews.find((r) => r.mediaItem.id === photoId)?.decision;
  };

  const startReview = () => {
    setPhase('review');
    goToPhoto(0);
  };

  const reviewedCount = reviews.length;
  const convertCount = reviews.filter((r) => r.decision === 'convert').length;
  const keepCount = reviews.filter((r) => r.decision === 'keep').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Your Live Photos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {livePhotos.length} Live Photos found
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {reviewedCount > 0 && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {reviewedCount} reviewed
                  </p>
                  <p className="text-xs text-gray-500">
                    {keepCount} keep • {convertCount} convert
                  </p>
                </div>
              )}
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={startReview}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {reviewedCount > 0 ? 'Continue Review' : 'Start Review'}
          </button>

          {reviewedCount > 0 && (
            <button
              onClick={() => setPhase('processing')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Process {convertCount} Conversions
            </button>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {livePhotos.map((photo, index) => {
            const decision = getPhotoDecision(photo.id);
            return (
              <div
                key={photo.id}
                className="relative group cursor-pointer"
                onClick={() => {
                  goToPhoto(index);
                  setPhase('review');
                }}
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`${photo.baseUrl}=w400-h400-c`}
                    alt={photo.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Live Photo Badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  LIVE
                </div>

                {/* Decision Badge */}
                {decision && (
                  <div
                    className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded font-medium ${
                      decision === 'keep'
                        ? 'bg-green-600'
                        : decision === 'convert'
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    {decision === 'keep'
                      ? '✓ Keep'
                      : decision === 'convert'
                      ? '→ Convert'
                      : 'Skip'}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {livePhotos.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Live Photos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No Live Photos were found in your library.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
