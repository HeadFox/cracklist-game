import { useState, useEffect, useCallback } from 'react';
import { usePhotoStore } from '../store/photoStore';

export function Review() {
  const {
    livePhotos,
    currentIndex,
    reviews,
    nextPhoto,
    previousPhoto,
    addReview,
    setPhase,
  } = usePhotoStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const currentPhoto = livePhotos[currentIndex];
  const currentReview = reviews.find((r) => r.mediaItem.id === currentPhoto?.id);

  // Get image and video URLs
  const imageUrl = currentPhoto ? `${currentPhoto.baseUrl}=d` : '';
  const videoUrl = currentPhoto?.mediaMetadata.video
    ? `${currentPhoto.baseUrl}=dv`
    : '';

  const handleDecision = useCallback((decision: 'keep' | 'convert' | 'skip') => {
    addReview(decision);

    // Auto-advance to next photo
    if (currentIndex < livePhotos.length - 1) {
      nextPhoto();
      setIsPlaying(false);
    } else {
      // Finished reviewing all photos
      setPhase('gallery');
    }
  }, [addReview, currentIndex, livePhotos.length, nextPhoto, setPhase]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (currentIndex > 0) previousPhoto();
        break;
      case 'ArrowRight':
        if (currentIndex < livePhotos.length - 1) nextPhoto();
        break;
      case ' ':
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        break;
      case 'k':
        handleDecision('keep');
        break;
      case 'c':
        handleDecision('convert');
        break;
      case 's':
        handleDecision('skip');
        break;
    }
  }, [currentIndex, livePhotos.length, previousPhoto, nextPhoto, handleDecision]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (!currentPhoto) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">No photos to review</p>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / livePhotos.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPhase('gallery')}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold">
                  Photo {currentIndex + 1} of {livePhotos.length}
                </h1>
                <p className="text-sm text-gray-400">{currentPhoto.filename}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {reviews.length} reviewed
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Display */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
              {isPlaying && videoUrl ? (
                <video
                  key={currentPhoto.id}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  controls
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={currentPhoto.filename}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Play Button Overlay */}
              {!isPlaying && videoUrl && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
                >
                  <div className="bg-white bg-opacity-90 rounded-full p-6">
                    <svg
                      className="w-12 h-12 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </button>
              )}

              {/* Live Badge */}
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                LIVE PHOTO
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              <span className="text-sm text-gray-400">
                {isPlaying ? 'Playing motion' : 'Press space to play'}
              </span>
            </div>
          </div>

          {/* Decision Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">What would you like to do?</h2>

              <div className="space-y-3">
                {/* Keep Live */}
                <button
                  onClick={() => handleDecision('keep')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    currentReview?.decision === 'keep'
                      ? 'border-green-500 bg-green-500 bg-opacity-20'
                      : 'border-gray-700 hover:border-green-500 bg-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-500">
                        Keep as Live Photo
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Preserve the motion. No changes will be made.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Keyboard: K
                      </p>
                    </div>
                  </div>
                </button>

                {/* Convert to Still */}
                <button
                  onClick={() => handleDecision('convert')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    currentReview?.decision === 'convert'
                      ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                      : 'border-gray-700 hover:border-blue-500 bg-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-500">
                        Convert to Still Image
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Remove motion and keep only the still frame. Saves space.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Keyboard: C
                      </p>
                    </div>
                  </div>
                </button>

                {/* Skip */}
                <button
                  onClick={() => handleDecision('skip')}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    currentReview?.decision === 'skip'
                      ? 'border-gray-500 bg-gray-500 bg-opacity-20'
                      : 'border-gray-700 hover:border-gray-500 bg-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-400">
                        Skip for Now
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Decide later. Won't be processed.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Keyboard: S
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousPhoto}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Previous</span>
              </button>

              <button
                onClick={nextPhoto}
                disabled={currentIndex === livePhotos.length - 1}
                className="flex items-center space-x-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>← / → : Navigate</div>
                <div>Space : Play/Pause</div>
                <div>K : Keep Live</div>
                <div>C : Convert</div>
                <div>S : Skip</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
