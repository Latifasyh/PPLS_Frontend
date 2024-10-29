// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous d'importer axios
import SidebarRr from './SidebarRr';
import MyInformation from './MyInformation';
import Pets from './pets';
import Profil from './Profil'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
//import MyBusiness from './MyBusiness';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('information'); // Gérer l'onglet actif
  const [userData, setUserData] = useState({ // Ajout de setUserData pour mettre à jour les données utilisateur
    firstName: '',
    lastName: '',
    username: '',
    bio: 'This is a brief bio about the user.',
    coverPhoto: '', // Grande couverture
    picture: '', // Avatar
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const account = userResponse.data.account || {};
        const user = account.user || {};

        // Mettez à jour l'état avec les données extraites
        setUserData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          picture: user.picture ? `http://localhost:8000/storage/profil_picture/${user.picture}` : '',
          username: account.username || '',
          bio: user.bio || 'This is a brief bio about the user.', // Utilisez une bio si disponible
          coverPhoto: user.coverPhoto || '', // Assurez-vous que la couverture est définie
        });
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // N'oubliez pas d'appeler fetchData
  }, []); // Ajoutez [] pour ne l'exécuter qu'une seule fois


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('picture', file);
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.post('/api/user', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setUserData((prevData) => ({
          ...prevData,
          picture: `http://localhost:8000/storage/profil_picture/${response.data.picture}`, // Mettre à jour l'URL de l'image
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Afficher le chargement ou l'erreur si nécessaire
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex">
      <SidebarRr />
      <div className="flex-grow">
        <div className="max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden">
          {/* Grande photo de couverture */}
          <div className="relative">
            <img
              src={userData.coverPhoto}
              alt="Cover"
              className="w-full h-96 object-cover" // Couverture plus grande
            />
            {/* Avatar */}
             <div className="absolute left-6 -bottom-16 transform translate-y-1/2">
              <img
                src={userData.picture}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div> 

         {/*  <div className="absolute left-6 -bottom-16 transform translate-y-1/2">
              <img
                src={userData.picture}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <label
                htmlFor="picture-upload"
                className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full cursor-pointer"
              >
                <FontAwesomeIcon icon={faEdit} />
              </label>
              <input
                id="picture-upload"
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
           */}
          </div>

          {/* Informations utilisateur */}
          <div className="pt-20 pb-8 px-6 bg-white text-center">
            <h2 className="text-3xl font-semibold">{`${userData.firstName} ${userData.lastName}`}</h2>
            <p className="text-gray-600">{userData.username}</p>
            <p className="mt-2 text-gray-700">{userData.bio}</p>
          </div>

          {/* Barre séparée avec onglets */}
          <div className="bg-gray-100 border-t border-b py-4">
            <div className="flex justify-around">
            <button
                onClick={() => handleTabChange('profil')}
                className={`px-4 py-2 ${
                  activeTab === 'profil' ? 'text-orange-900 font-semibold' : 'text-gray-600'
                }`}
              >
                My Profil
              </button>
              
              <button
                onClick={() => handleTabChange('pets')}
                className={`px-4 py-2 ${
                  activeTab === 'pets' ? 'text-orange-900  font-semibold' : 'text-gray-600'
                }`}
              >
                My Pets
              </button>

              <button
                onClick={() => handleTabChange('information')}
                className={`px-4 py-2 ${
                  activeTab === 'information' ? 'text-orange-900 font-semibold' : 'text-gray-600'
                }`}
              >
                My Information
              </button>

              <button
                onClick={() => handleTabChange('business')}
                className={`px-4 py-2 ${
                  activeTab === 'business' ? 'text-orange-900 font-semibold' : 'text-gray-600'
                }`}
              >
                My Business
              </button>
            </div>
          </div>

          {/* Contenu dynamique basé sur l'onglet actif */}
          <div className="p-6">
          {activeTab === 'profil' && <Profil userData={userData} />} {/* Passez userData en prop */}
          {activeTab === 'pets' && <Pets />} 
           {activeTab === 'information' && <MyInformation userData={userData} />} {/* Passez userData en prop */}

            {/* {activeTab === 'business' && <MyBusiness />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
