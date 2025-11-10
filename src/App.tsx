import { usePhotoStore } from './store/photoStore';
import { Login } from './components/Login';
import { Loading } from './components/Loading';
import { Gallery } from './components/Gallery';
import { Review } from './components/Review';
import { Processing } from './components/Processing';
import { Error } from './components/Error';

function App() {
  const { phase, error } = usePhotoStore();

  // Show error if there's an error
  if (error) {
    return <Error />;
  }

  // Route based on phase
  switch (phase) {
    case 'login':
      return <Login />;
    case 'loading':
      return <Loading />;
    case 'gallery':
      return <Gallery />;
    case 'review':
      return <Review />;
    case 'processing':
      return <Processing />;
    default:
      return <Login />;
  }
}

export default App;
