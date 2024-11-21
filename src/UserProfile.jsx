// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous d'importer axios
import SidebarRr from './SidebarRr';
import MyInformation from './MyInformation';
import Pets from './Pets';
import Business from './Business';
import Profil from './Profil'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faCancel, faRotateBack, faSave } from '@fortawesome/free-solid-svg-icons';

//import MyBusiness from './MyBusiness';

const UserProfile = () => {
 
  const [activeTab, setActiveTab] = useState('information'); // Gérer l'onglet actif
  const [userData, setUserData] = useState({ // Ajout de setUserData pour mettre à jour les données utilisateur
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    cover: '', // Grande couverture
    picture: '', // Avatar
  });

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false); // État pour gérer l'édition de la bio
  const [bio, setBio] = useState(''); // État pour la nouvelle bio


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
      //  console.log("User API response:", userResponse.data);


        const account = userResponse.data.account || {};
        const user = account.user || {};
        
        //cover
        const coverResponse = await axios.get('http://localhost:8000/api/coverpic/cover', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
       // console.log("Cover API response:", coverResponse.data);

        // Utilisez seulement le nom du fichier pour construire l'URL de la photo de couverture
        const coverPhoto = coverResponse.data.cover_url 
        ? coverResponse.data.cover_url 
        : '';

        //bio
        const bioCover = await axios.get('/api/coverpic/bio', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
       // console.log("Bio API response:", bioCover.data);

        // Mettez à jour l'état avec les données extraites
        setUserData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          picture: user.picture ? `http://localhost:8000/storage/profil_picture/${user.picture}` : '',
          username: account.username || '',
          bio: bioCover.data.bio || '', // Utilisez une bio si disponible
          // coverPhoto: user.coverPhoto || '', // Assurez-vous que la couverture est définie
         /* over: coverResponse.data.cover 
          ? `http://localhost:8000/storage/cover/${coverResponse.data.cover}` 
          : '',  */  // Utilise l'image de couverture si disponible
         // cover: coverResponse.cover
         cover: coverPhoto,
        });
        console.log("Updated user data:", userData);


      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // N'oubliez pas d'appeler fetchData
  }, []); // Ajoutez [] pour ne l'exécuter qu'une seule fois

  const updateBio = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.put('http://localhost:8000/api/coverpic/bio', 
        { bio }, // Envoyer la bio mise à jour
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setUserData((prevData) => ({
        ...prevData,
        bio: response.data.bio, // Mettez à jour l'état avec la nouvelle bio
      }));
      setIsEditingBio(false); // Fermer l'édition de la bio

    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

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

  const handleCoverChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Ajoutez ceci pour déboguer
    if (file) {
      const formData = new FormData();
      formData.append('cover', file);
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post('http://localhost:8000/api/coverpic/cover', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setUserData((prevData) => ({
          ...prevData,
          cover:  response.data.cover_url,
        }));
      } catch (error) {
        console.error("Error uploading cover photo:", error);
      }
    }
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage('');
  };

  
  
  // Afficher le chargement ou l'erreur si nécessaire
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex">
      <SidebarRr />
      <div className="pt-14 flex-grow ">
        <div className="max-w-5xl mx-auto rounded-lg shadow-lg  overflow-hidden ">
          {/* Grande photo de couverture */}
          <div className="relative">
            <img
               key={userData.cover + Date.now()} // Nouvelle clé à chaque mise à jour de cover
              src={userData.cover || 'default-cover.jpg'} // Utiliser une image de couverture par défaut
              alt="Cover"
              className="w-full h-96 object-cover "
             // style={{ position: 'relative', zIndex: 10 }} // Assurez-vous que l'image de couverture est au-dessus

             // style={{ backgroundColor: userData.cover ? 'transparent' : 'black' }} // Fond noir si pas de couverture
             onClick={() => openModal(userData.cover || 'default-cover.jpg')}

            />
            <label
              htmlFor="cover-upload"
              className="absolute top-4 right-4 bg-gray-700 text-white p-1 rounded-full cursor-pointer"
            >
              <FontAwesomeIcon icon={faEdit} />
            </label>
            <input
              id="cover-upload"
              type="file"
              name="cover"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          


            {/* Avatar */}
             <div className="absolute left-6 -bottom-16 transform translate-y-1/2">
              <img
                src={userData.picture}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                onClick={() => openModal(userData.picture)}
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
            {/* <p className="mt-2 text-gray-700">{userData.bio}</p> */}

            {isEditingBio ? (
              <div>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="border rounded p-2 mt-2 w-full"
                  placeholder="Enter your bio..."
                />
                <div className="flex justify-end mt-2">
                  <button onClick={updateBio} 
                  className="bg-green-950 text-white p-2 rounded mr-2"
                 
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button onClick={() => setIsEditingBio(false)} className="bg-gray-500 text-white p-2 rounded">
                    <FontAwesomeIcon icon={faRotateBack} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-gray-700">{userData.bio ||'No bio available'}</p>
                <button onClick={() => { setIsEditingBio(true); setBio(userData.bio); }} 
                      className="text-green-950"
                       title="Ajouter votre Bio"
                      >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            )}
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

           {activeTab === 'business' && <Business />} 

           {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal} // Ferme le modal en cliquant sur le fond
          >
            <div 
              className="bg-white p-4 rounded shadow-lg"
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant sur l'image
            >
              <button 
                onClick={closeModal} 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
              <img src={currentImage} alt="Aperçu" className="max-w-full max-h-screen" />
            </div>
          </div>
        )}
         
        </div>
      </div>
        
      </div>
    </div>
  );
};

export default UserProfile;
