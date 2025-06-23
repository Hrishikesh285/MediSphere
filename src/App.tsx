import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Reminders from './components/Reminders/Reminders';
import Pharmacy from './components/Pharmacy/Pharmacy';
import Telemedicine from './components/Telemedicine/Telemedicine';
import AIAnalysis from './components/AIAnalysis/AIAnalysis';
import Profile from './components/Profile/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import LoadingScreen from './components/shared/LoadingScreen';

function App() {
  const { user, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !appReady) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="pharmacy" element={<Pharmacy />} />
        <Route path="telemedicine" element={<Telemedicine />} />
        <Route path="analysis" element={<AIAnalysis />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
