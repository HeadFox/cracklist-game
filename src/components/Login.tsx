import { useGoogleLogin } from '@react-oauth/google';
import { usePhotoStore } from '../store/photoStore';

const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/photoslibrary.appendonly',
];

export function Login() {
  const { setAccessToken, setError, setLivePhotos, setPhase } = usePhotoStore();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setError('Failed to authenticate with Google. Please try again.');
    },
    scope: REQUIRED_SCOPES.join(' '),
  });

  // Demo mode for testing without Google credentials
  const enterDemoMode = () => {
    // Create mock Live Photos for demo
    const mockPhotos = [
      {
        id: 'demo-1',
        productUrl: 'https://photos.google.com/demo',
        baseUrl: 'https://via.placeholder.com/800',
        mimeType: 'image/jpeg',
        filename: 'IMG_demo_001.jpg',
        mediaMetadata: {
          creationTime: new Date().toISOString(),
          width: '800',
          height: '600',
          photo: { cameraMake: 'Demo Camera', cameraModel: 'Demo Model' },
          video: { fps: 30, status: 'READY' },
        },
      },
      {
        id: 'demo-2',
        productUrl: 'https://photos.google.com/demo',
        baseUrl: 'https://via.placeholder.com/800/0000FF',
        mimeType: 'image/jpeg',
        filename: 'IMG_demo_002.jpg',
        mediaMetadata: {
          creationTime: new Date().toISOString(),
          width: '800',
          height: '600',
          photo: { cameraMake: 'Demo Camera', cameraModel: 'Demo Model' },
          video: { fps: 30, status: 'READY' },
        },
      },
      {
        id: 'demo-3',
        productUrl: 'https://photos.google.com/demo',
        baseUrl: 'https://via.placeholder.com/800/00FF00',
        mimeType: 'image/jpeg',
        filename: 'IMG_demo_003.jpg',
        mediaMetadata: {
          creationTime: new Date().toISOString(),
          width: '800',
          height: '600',
          photo: { cameraMake: 'Demo Camera', cameraModel: 'Demo Model' },
          video: { fps: 30, status: 'READY' },
        },
      },
    ];

    // Set photos and go directly to gallery (skip loading)
    setLivePhotos(mockPhotos as any);
    setPhase('gallery');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-indigo-600"
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
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Photos Live Converter
          </h1>
          <p className="text-gray-600">
            Review and convert your Live Photos to still images
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Fetch all your Live Photos
              </p>
              <p className="text-xs text-gray-500">
                Automatically identify motion photos in your library
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Review each photo
              </p>
              <p className="text-xs text-gray-500">
                Play the motion and decide what to keep
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Convert to still images
              </p>
              <p className="text-xs text-gray-500">
                Save space and simplify your library
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => login()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <button
            onClick={enterDemoMode}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Try Demo Mode</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            We only access your photos to help you manage them.
            <br />
            Your data stays private and is never stored.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Demo mode lets you explore the UI without connecting to Google Photos
          </p>
        </div>
      </div>
    </div>
  );
}
