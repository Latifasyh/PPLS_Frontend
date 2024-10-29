import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
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
        picture: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
           // const userId = 2; // Remplacez ceci par l'identifiant réel de l'utilisateur

            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const userResponse = await axios.get(`/api/user/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("User API Response:", userResponse.data);

                setUserData({
                    firstName: userResponse.data.first_name || '',
                    lastName: userResponse.data.last_name || '',
                    birthday: userResponse.data.birthday || '',
                    country: userResponse.data.country || '',
                    ville: userResponse.data.ville || '',
                    phonecode: userResponse.data.phonecode || '',
                    number_phone: userResponse.data.number_phone || '',
                    family_situation: userResponse.data.family_situation || '',
                    gender: userResponse.data.gender || '',
                    picture: userResponse.data.picture || ''
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>
            <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-shrink-0">
                    {userData.picture ? (
                        <img
                            src={userData.picture}
                            alt="User"
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <span className="text-xl">👤</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name:</label>
                    <p className="mt-1 text-gray-900">{userData.firstName}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                    <p className="mt-1 text-gray-900">{userData.lastName}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                    <p className="mt-1 text-gray-900">{userData.birthday}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Country:</label>
                    <p className="mt-1 text-gray-900">{userData.country}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ville:</label>
                    <p className="mt-1 text-gray-900">{userData.ville}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Code:</label>
                    <p className="mt-1 text-gray-900">{userData.phonecode}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                    <p className="mt-1 text-gray-900">{userData.number_phone}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status:</label>
                    <p className="mt-1 text-gray-900">{userData.family_situation}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender:</label>
                    <p className="mt-1 text-gray-900">{userData.gender}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
