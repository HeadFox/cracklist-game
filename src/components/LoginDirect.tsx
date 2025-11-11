import { usePhotoStore } from '../store/photoStore';

const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/photoslibrary.appendonly',
];

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = window.location.origin + window.location.pathname;

export function LoginDirect() {
  const { setLivePhotos, setPhase } = usePhotoStore();

  const loginWithGoogle = () => {
    // Utiliser le flux OAuth2 complet au lieu de @react-oauth/google
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', REQUIRED_SCOPES.join(' '));

    window.location.href = authUrl.toString();
  };

  const enterDemoMode = () => {
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

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Test du nouveau flux OAuth:</strong> Cette version utilise le flux OAuth2 complet pour obtenir les bonnes permissions.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={loginWithGoogle}
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
            <span>Sign in with Google (NEW)</span>
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
        </div>
      </div>
    </div>
  );
}
