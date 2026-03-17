import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home        from './pages/Home';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Events      from './pages/Events';
import EventDetail from './pages/EventDetail';
import Dashboard   from './pages/Dashboard';
import Profile     from './pages/Profile';
import Certificates from './pages/Certificates';
import VerifyCert  from './pages/VerifyCert';
import ScanQR      from './pages/ScanQR';
import CreateEvent from './pages/CreateEvent';
import Analytics   from './pages/Analytics';
import EntryLogs   from './pages/EntryLogs';

const Guard = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner spinner-lg"/></div>;
  if (!user) return <Navigate to="/login" replace/>;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace/>;
  return children;
};

function AppInner() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/"             element={<Home/>}/>
        <Route path="/login"        element={<Login/>}/>
        <Route path="/register"     element={<Register/>}/>
        <Route path="/events"       element={<Events/>}/>
        <Route path="/events/:id"   element={<EventDetail/>}/>
        <Route path="/verify/:certId" element={<VerifyCert/>}/>
        <Route path="/profile"      element={<Guard><Profile/></Guard>}/>
        <Route path="/certificates" element={<Guard><Certificates/></Guard>}/>
        <Route path="/dashboard"    element={<Guard roles={['organizer','admin']}><Dashboard/></Guard>}/>
        <Route path="/scan"         element={<Guard roles={['organizer','admin']}><ScanQR/></Guard>}/>
        <Route path="/create-event" element={<Guard roles={['organizer','admin']}><CreateEvent/></Guard>}/>
        <Route path="/analytics"    element={<Guard roles={['organizer','admin']}><Analytics/></Guard>}/>
        <Route path="/entry-logs/:eventId" element={<Guard roles={['organizer','admin']}><EntryLogs/></Guard>}/>
        <Route path="*"             element={<Navigate to="/" replace/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: 'DM Sans,sans-serif', fontSize: 14 }}}/>
        <AppInner/>
      </AuthProvider>
    </BrowserRouter>
  );
}
