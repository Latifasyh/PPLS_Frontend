import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import ResetPasswordPage from './ResetPasswordPage';
import ProfileCompletionPage from './ProfileCompletionPage';
import Marketplace from './Marketplace';
import MessagingPage from './MessagingPage';
import EventsPage from './EventsPage';
import UrgencePage from './UrgencePage';
import AstucesPage from './AstucesPage';
import AccountPage from './AccountPage';
import { AppContext } from './Context/AppContext';
import ProtectedRoute from './Context/ProtectedRoute'; // Importation par défaut
import './index.css';
import Header from './Header';
import Footer from './Footer';
//import RightSidebar from './RightSidebar';
import Profile from './Profile';
import Userinformation from './Userinformation';
import LeftSidebar from './LeftSidebar';
import UserProfile from './UserProfile';
import SidebarRr from './SidebarRr';
import MyInformation from './MyInformation';
import Pets from './pets';
import Discussion from './Discussion';
import Profil from './Profil';

const App = () => {
  const { user } = useContext(AppContext);

  return (
    <BrowserRouter>
      {user && <Header />}
      <Routes>
         <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/home" />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />

        <Route path="/Discussion" element={<ProtectedRoute element={<Discussion/>} />} />

        <Route path="/userinformation" element={<ProtectedRoute element={<Userinformation/>} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/userprofile" element={<ProtectedRoute element={<UserProfile/>} />} />
        <Route path="/MyInformation" element={<ProtectedRoute element={<MyInformation/>} />} />
        <Route path="/Profil" element={<ProtectedRoute element={<Profil/>} />} />
         <Route path="/pets" element={<ProtectedRoute element={<Pets/>} />} />
 
        <Route path="/profile-completion" element={<ProfileCompletionPage />} />
        
        <Route path="/marketplace" element={<ProtectedRoute element={<Marketplace />} />} />
        <Route path="/messages" element={<ProtectedRoute element={<MessagingPage />} />} />
        <Route path="/events" element={<ProtectedRoute element={<EventsPage />} />} />
        <Route path="/emergencies" element={<ProtectedRoute element={<UrgencePage />} />} />
        <Route path="/tips" element={<ProtectedRoute element={<AstucesPage />} />} />
        <Route path="/account" element={<ProtectedRoute element={<AccountPage />} />} />

     
      </Routes>
     
      <Footer />
    </BrowserRouter>
  );
};

export default App;
