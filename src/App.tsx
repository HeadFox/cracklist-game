import { usePhotoStore } from './store/photoStore';
import { LoginDirect } from './components/LoginDirect';
import { OAuthCallback } from './components/OAuthCallback';
import { Loading } from './components/Loading';
import { Gallery } from './components/Gallery';
import { Review } from './components/Review';
import { Processing } from './components/Processing';
import { Error } from './components/Error';

function App() {
  const { phase, error } = usePhotoStore();

  // Check if we're handling an OAuth callback
  if (window.location.hash.includes('access_token')) {
    return <OAuthCallback />;
  }

  // Show error if there's an error
  if (error) {
    return <Error />;
  }

  // Route based on phase
  switch (phase) {
    case 'login':
      return <LoginDirect />;
    case 'loading':
      return <Loading />;
    case 'gallery':
      return <Gallery />;
    case 'review':
      return <Review />;
    case 'processing':
      return <Processing />;
    default:
      return <LoginDirect />;
  }
}

export default App;
