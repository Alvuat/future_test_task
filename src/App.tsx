import { AdminWorkspace } from './components/admin/AdminWorkspace';
import { FormsHome } from './components/FormsHome';
import { PublicPage } from './components/public/PublicPage';
import { useForms } from './hooks/useForms';
import './styles/responsive.css';

function App() {
  const store = useForms();
  const pathname = window.location.pathname;
  const isPublicRoute = pathname.startsWith('/f/');

  if (isPublicRoute) {
    const formId = pathname.split('/')[2] ?? '';
    return <PublicPage {...store} formId={formId} />;
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    return <AdminWorkspace {...store} />;
  }

  if (pathname === '/' || pathname === '') {
    return <FormsHome {...store} />;
  }

  return <FormsHome {...store} />;
}

export default App;
