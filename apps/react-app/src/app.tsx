import AuthProvider from './providers/AuthProvider.tsx';
import FriendsProvider from './providers/FriendsProvider.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterComponent from './router/index.tsx';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <FriendsProvider>
          <RouterComponent />
        </FriendsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
