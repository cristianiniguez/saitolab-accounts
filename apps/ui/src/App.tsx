import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// components
import AppServicesProvider from './components/providers/AppServicesProvider';
import PublicRoute from './components/routes/PublicRoute';
import PrivateRoute from './components/routes/PrivateRoute';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';

const App = () => (
  <AppServicesProvider>
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<HomePage />} path='/' />
          <Route element={<SignInPage />} path='/sign-in' />
          <Route element={<SignUpPage />} path='/sign-up' />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardPage />} path='/dashboard' />
          <Route element={<AccountPage />} path='/account/:id' />
          <Route element={<ProfilePage />} path='/profile' />
        </Route>
      </Routes>
    </Router>
  </AppServicesProvider>
);

export default App;
