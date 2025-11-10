import { useEffect, useState } from 'react';
import { usePhotoStore } from '../store/photoStore';
import { fetchLivePhotos } from '../utils/googlePhotosApi';

export function Loading() {
  const { accessToken, setLivePhotos, setError, setPhase } = usePhotoStore();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Connecting to Google Photos...');

  useEffect(() => {
    if (!accessToken) {
      setPhase('login');
      return;
    }

    const loadPhotos = async () => {
      try {
        setStatus('Fetching your photos...');

        const photos = await fetchLivePhotos(accessToken, (count) => {
          setProgress(count);
          setStatus(`Found ${count} photos so far...`);
        });

        if (photos.length === 0) {
          setStatus('No Live Photos found in your library');
          setTimeout(() => {
            setError('No Live Photos found. Make sure you have motion photos in your Google Photos library.');
          }, 2000);
        } else {
          setStatus(`Found ${photos.length} Live Photos!`);
          setTimeout(() => {
            setLivePhotos(photos);
          }, 1000);
        }
      } catch (error: any) {
        console.error('Error loading photos:', error);
        setError(error.message || 'Failed to load photos from Google Photos');
      }
    };

    loadPhotos();
  }, [accessToken, setLivePhotos, setError, setPhase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Your Photos
          </h2>

          <p className="text-gray-600 mb-6">{status}</p>

          {progress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (progress / 1000) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {progress} photos scanned
              </p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-1 text-gray-400 text-sm">
            <svg
              className="animate-pulse w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
