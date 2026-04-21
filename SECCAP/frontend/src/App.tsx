import { AuthProvider } from './auth/AuthContext.tsx';
import { AppRouter } from './router/AppRouter.tsx';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
