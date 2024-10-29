// src/Header.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserFriends, faStore, faBell, faEnvelope, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from './Context/AppContext';
import axios from 'axios';

const Header = () => {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const toggleNotificationsDropdown = () => {
    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout',{}, {
        
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour Sanctum
      });
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-green-onion text-white p-2 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center">
        <h1 className="text-3xl font-bold mr-6" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.5px' }}>
        <button onClick={() => navigate('/home')}>
           PetPals
       </button>
        </h1>
        <div className="flex items-center bg-white rounded-full p-1 w-1/2 max-w-md mx-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full px-4 py-1 rounded-full border-none focus:outline-none text-gray-800"
          />
          <FontAwesomeIcon icon={faSearch} className="text-gray-500 ml-2" />
        </div>
        <nav className="ml-auto flex items-center">
          <ul className="flex space-x-4">
            <li>
              <Link to="/home" className="flex items-center space-x-1 text-white hover:underline text-sm">
                <FontAwesomeIcon icon={faHome} />
                <span>Accueil</span>
              </Link>
            </li>
            <li>
              <Link to="/friends" className="flex items-center space-x-1 text-white hover:underline text-sm">
                <FontAwesomeIcon icon={faUserFriends} />
                <span>Amis</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" className="flex items-center space-x-1 text-white hover:underline text-sm">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Messagerie</span>
              </Link>
            </li>
            <li className="relative">
              <button
                className="flex items-center space-x-1 text-white hover:underline text-sm"
                onClick={toggleNotificationsDropdown}
              >
                <FontAwesomeIcon icon={faBell} />
                <span>Notifications</span>
              </button>
              {isNotificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md text-gray-800">
                  <ul className="py-1">
                    <li className="px-2 py-2 hover:bg-gray-200">Aucune notification pour le moment</li>
                  </ul>
                </div>
              )}
            </li>
            <li className="relative">
              <button
                className="flex items-center space-x-1 text-white hover:underline text-sm"
                onClick={toggleAccountDropdown}
              >
                  {/* //added */}
                  {/* <span className="relative inline-block">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                    <Link to="/userprofil">Profil</Link>
                  </span> */}
                <FontAwesomeIcon icon={faUser} />
                <span>Compte</span>
              </button>
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-gray-800">
                  <ul className="py-2">
                  
                  {/* //added */}
                  <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to="/userinformation">Information</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to="/userprofile">Profile</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link to="/account">Accéder au compte</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                      Déconnexion
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
