import { useEffect } from 'react';
import { usePhotoStore } from '../store/photoStore';

export function OAuthCallback() {
  const { setAccessToken } = usePhotoStore();

  useEffect(() => {
    // Extraire le token de l'URL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Retourner au login
      window.location.hash = '';
      return;
    }

    if (accessToken) {
      console.log('✅ Received access token:', accessToken.substring(0, 20) + '...');

      // Vérifier les scopes du token
      fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
        .then(r => r.json())
        .then(data => {
          console.log('📋 Token info:', data);
          console.log('🔐 Scopes granted:', data.scope);
        });

      setAccessToken(accessToken);

      // Nettoyer l'URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [setAccessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authenticating...
          </h2>
          <p className="text-gray-600">Processing your Google login</p>
        </div>
      </div>
    </div>
  );
}
