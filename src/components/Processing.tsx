import { useEffect, useState } from 'react';
import { usePhotoStore } from '../store/photoStore';
import { convertLivePhotoToStill } from '../utils/googlePhotosApi';

interface ProcessingStatus {
  itemId: string;
  filename: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  stage?: string;
  error?: string;
}

export function Processing() {
  const {
    accessToken,
    reviews,
    setPhase,
    incrementProcessedCount,
  } = usePhotoStore();

  const [processingItems, setProcessingItems] = useState<ProcessingStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const convertItems = reviews.filter((r) => r.decision === 'convert');

  useEffect(() => {
    // Initialize processing items
    const items: ProcessingStatus[] = convertItems.map((review) => ({
      itemId: review.mediaItem.id,
      filename: review.mediaItem.filename,
      status: 'pending',
    }));
    setProcessingItems(items);

    // Start processing
    processItems(items);
  }, []);

  const processItems = async (items: ProcessingStatus[]) => {
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const review = convertItems[i];

      // Update status to processing
      setProcessingItems((prev) =>
        prev.map((p) =>
          p.itemId === item.itemId ? { ...p, status: 'processing' } : p
        )
      );

      try {
        const result = await convertLivePhotoToStill(
          accessToken,
          review.mediaItem,
          (stage) => {
            setProcessingItems((prev) =>
              prev.map((p) =>
                p.itemId === item.itemId ? { ...p, stage } : p
              )
            );
          }
        );

        if (result.success) {
          setProcessingItems((prev) =>
            prev.map((p) =>
              p.itemId === item.itemId
                ? { ...p, status: 'success', stage: 'Complete!' }
                : p
            )
          );
        } else {
          setProcessingItems((prev) =>
            prev.map((p) =>
              p.itemId === item.itemId
                ? {
                    ...p,
                    status: 'error',
                    error: result.error || 'Unknown error',
                  }
                : p
            )
          );
        }
      } catch (error: any) {
        setProcessingItems((prev) =>
          prev.map((p) =>
            p.itemId === item.itemId
              ? { ...p, status: 'error', error: error.message }
              : p
          )
        );
      }

      incrementProcessedCount();
    }

    setIsComplete(true);
  };

  const successCount = processingItems.filter((p) => p.status === 'success').length;
  const errorCount = processingItems.filter((p) => p.status === 'error').length;
  const progress = processingItems.length > 0
    ? ((successCount + errorCount) / processingItems.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {isComplete ? 'Processing Complete' : 'Processing Conversions'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isComplete
              ? `${successCount} successful, ${errorCount} failed`
              : `Converting ${processingItems.length} Live Photos...`}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-gray-900">
                {successCount + errorCount} / {processingItems.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {isComplete && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    {successCount} successful
                  </span>
                </div>
                {errorCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      {errorCount} failed
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setPhase('gallery')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Back to Gallery
              </button>
            </div>
          )}
        </div>

        {/* Processing Items */}
        <div className="space-y-3">
          {processingItems.map((item) => (
            <div
              key={item.itemId}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4"
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {item.status === 'pending' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                    </svg>
                  </div>
                )}
                {item.status === 'processing' && (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                {item.status === 'success' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {item.status === 'error' && (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.filename}
                </p>
                {item.stage && (
                  <p className="text-xs text-gray-500 mt-1">{item.stage}</p>
                )}
                {item.error && (
                  <p className="text-xs text-red-600 mt-1">{item.error}</p>
                )}
              </div>

              {/* Status Label */}
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'pending'
                      ? 'bg-gray-100 text-gray-800'
                      : item.status === 'processing'
                      ? 'bg-indigo-100 text-indigo-800'
                      : item.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status === 'pending'
                    ? 'Pending'
                    : item.status === 'processing'
                    ? 'Processing'
                    : item.status === 'success'
                    ? 'Success'
                    : 'Failed'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        {isComplete && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">
                  Important Note
                </h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Google Photos API does not support automatic deletion of the original
                  Live Photos. You'll need to manually delete them from your Google
                  Photos library if desired. The converted still images have been
                  uploaded with "_still" suffix in their filenames.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
