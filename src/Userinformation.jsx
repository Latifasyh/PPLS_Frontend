import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './Context/AppContext';

const Userinformation = () => {
    const { user, setUser } = useContext(AppContext); // Utilisation du contexte

    const navigate = useNavigate();
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
        picture: null,
        picturePreview: '', // Utilisez une chaîne vide par défaut
    });
    const [previousPicture, setPreviousPicture] = useState(''); // État pour l'ancienne photo

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    picture: null, // Démarrer avec null pour gérer le changement d'image
               //     picture: user.picture || '',
                    picturePreview: user.picture ? `http://localhost:8000/storage/profil_picture/${user.picture}` : '', // Ajout de l'URL de l'image si elle existe
                });
                setPreviousPicture(user.picture || ''); // Stocker l'ancienne photo


            } catch (err) {
                console.error("API Error:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
          //  console.log(userData); // Vérifiez les valeurs ici

        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
       // console.log(`Changed ${name} to ${value}`); //logique verify

        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /* const handleFileChange = (e) => {
        const file = e.target.files[0]; // Obtenez le fichier
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUserData((prevState) => ({
                    ...prevState,
                    picturePreview: event.target.result, // Stockez le Data URL dans l'état pour l'aperçu
                    picture: file, // Stockez le fichier pour l'update
                }));
            };
            reader.readAsDataURL(file); // Lire le fichier image
        } else {
            alert('Please select a valid image file (JPEG or PNG).');
        }
    };
 */

// ...
const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check the file type
    if (file && file.type.startsWith('image/')) {
        setUserData((prevState) => ({
            ...prevState,
            picture: file, // Store the new file
            picturePreview: URL.createObjectURL(file), // Preview the new image
        }));
    } else {
        alert("Please select a valid image file.");
    }
};


const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating user with data:", userData); // Debugging

    // Validation des champs requis
    if (!userData.firstName || !userData.lastName) {
        alert('First name and last name are required');
        return;
    }

    const formData = new FormData();

    // Ajout des données utilisateur au FormData
    formData.append('first_name', userData.firstName);
    formData.append('last_name', userData.lastName);
    formData.append('phonecode', userData.phonecode);
    formData.append('number_phone', userData.number_phone);
    formData.append('birthday', userData.birthday);
    formData.append('country', userData.country);
    formData.append('ville', userData.ville);
    formData.append('family_situation', userData.family_situation);
    formData.append('gender', userData.gender);

    if (userData.picture) {
        formData.append('picture', userData.picture); // Ajouter la nouvelle photo
    }

    // Gestion de l'image de profil
    /* if (userData.picture) {
        formData.append('picture', userData.picture);
    } else if (previousPicture) {
        formData.append('picture', previousPicture); // Garder l'ancienne photo
    }
 */
    /* console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    } */

    const token = localStorage.getItem('token');

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/user/update', formData, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                // Pas besoin d'ajouter 'Content-Type': 'multipart/form-data' ici
            },
            maxBodyLength: Infinity, // Permettre un corps de requête de longueur illimitée
        });

        // Mettre à jour l'utilisateur dans le contexte
        setUser(response.data.user);
        console.log('User updated successfully', response.data.user);
    } catch (error) {
        if (error.response) {
            console.error('Error updating user:', error.response.data);
            alert(`Update failed: ${error.response.data.message}`);
        } else {
            console.error('Error updating user:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    } alert('Profile updated successfully');
    navigate("/userprofile");

};

    
    
    

    if (loading) {
        return <div>Loading...</div>; // Ajout d'un message de chargement
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-shrink-0">
                        {userData.picturePreview ? (
                            <img
                                src={userData.picturePreview} // Afficher l'aperçu de l'image
                                alt="User Preview"
                                className="h-24 w-24 rounded-full "//object-cover
                            />
                        ) : (
                            <img
                                src={`http://localhost:8000/storage/profil_picture/${userData.picture}`} // Utilisez l'image de la base de données
                                alt="User"
                                className="h-24 w-24 rounded-full " //object-cover
                            />
                        )}
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
                            onChange={handleFileChange} // Assurez-vous d'ajouter la fonction handleFileChange
                            className="hidden"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={userData.firstName || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={userData.lastName || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    />
                </div>
                <div>
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                    <input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={userData.birthday || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    />
                </div>
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country:</label>
                    <select
                        id="country"
                        name="country"
                        value={userData.country || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    >
                        <option value="">Select your country</option>
                        <option value="France">France</option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                        <option value="Morocco">Morocco</option>
                        {/* Add more countries as needed */}
                    </select>
                </div>
                <div>
                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700">City:</label>
                    <input
                        id="ville"
                        name="ville"
                        type="text"
                        value={userData.ville || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    />
                </div>
                <div className="relative  ">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Numéro de téléphone</label>
                    <div className="flex">
                        <input
                            id="phonecode"
                            name="phonecode"
                            type="text"
                            value={userData.phonecode || ''}
                            onChange={handleChange}
                            className="mt-1 block w-3/12 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                            placeholder="Phone"
                        />
                        <input
                    
                            id="number_phone"
                            name="number_phone"
                            type="text"
                            value={userData.number_phone || ''}
                            onChange={handleChange}
                            className="mt-1 block w-10/12 px-4 py-2 ml-1 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                            placeholder="Phone Number"
                            
                        />
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="maritalStatus" className="text-sm font-medium text-gray-700">Situation amoureuse</label>
                        <select
                        id="family_situation"
                            name="family_situation"
                            value={userData.family_situation || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                        >
                            <option value="">Select your situation</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </div>
                    

                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={userData.gender || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex justify-between space-x-3">
                    
                    <button
                        type="submit"
                       // onClick={handleUpdate}
                        className="w-full py-2 px-4  bg-green-onion text-white font-semibold rounded-lg shadow-md hover:bg-green-onion-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Save Changes
                    </button>

                    <button
                        type="button"
                       // onClick={handleCancel}
                        className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                        
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Userinformation;
