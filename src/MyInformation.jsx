import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useHistory } from 'react-router-dom'; // Importer useHistory pour la redirection
import { Icon } from 'leaflet';
import { Navigate, useNavigate } from 'react-router-dom';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const UserInformation = () => {
    const Navigate = useNavigate(); // Initialiser useHistory

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        birthday: '',
        country: '',
        ville: '',
        phonecode: '',
        number_phone: '',
        family_situation: '',
        gender: '',
        picture: '',
        username: '',
        email: ''
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
                    birthday: user.birthday || '',
                    country: user.country || '',
                    ville: user.ville || '',
                    phonecode: user.phonecode || '',
                    number_phone: user.number_phone || '',
                    family_situation: user.family_situation || '',
                    gender: user.gender || '',
                    picture: user.picture ? `http://localhost:8000/storage/profil_picture/${user.picture}` : '',
                    username: account.username || '',
                    email: account.email || ''
                });
            } catch (err) {
                console.error("API Error:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleEditClick = () => {
        // Rediriger vers la page UserInformation
        Navigate('/userinformation');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Information</h2>
                <button onClick={handleEditClick} className="text-blue-500">
                    <FontAwesomeIcon icon={faEdit} className="text-xl" />
                </button>
            </div>  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <span className="font-medium">Prénom:</span>
          <span>{userData.firstName || 'Non renseigné'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Nom:</span>
          <span>{userData.lastName || 'Non renseigné'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Nom d'utilisateur:</span>
          <span>{userData.username || 'Non renseigné'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Adresse Mail:</span>
          <span>{userData.email || 'Non renseignée'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Date de naissance:</span>
          <span>{userData.birthday || 'Non renseignée'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Pays:</span>
          <span>{userData.country || 'Non renseigné'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Ville:</span>
          <span>{userData.ville || 'Non renseignée'}</span>
        </div>
        <div className="flex flex-col">
            <span className="font-medium">Téléphone:</span>
            <div className="flex flex-col">
            <span>
                {userData.phonecode ? `${userData.phonecode} ${userData.number_phone}` : 'Non renseigné'}
            </span>
            </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Situation familiale:</span>
          <span>{userData.family_situation || 'Non renseignée'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Genre:</span>
          <span>{userData.gender || 'Non renseigné'}</span>
        </div>
      </div>
    </div>
    );
};

export default UserInformation;
