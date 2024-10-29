import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionPage = ({ firstName, lastName }) => {
  const [hasPet, setHasPet] = useState(false);
  const [petDetails, setPetDetails] = useState({
    type: '',
    breed: '',
    age: '',
    petPhoto: null,
  });
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [country, setCountry] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handlePetToggle = () => {
    setHasPet(!hasPet);
  };

  const handlePetDetailChange = (e) => {
    const { name, value } = e.target;
    setPetDetails({ ...petDetails, [name]: value });
  };

  const handleFileChange = (e, setStateFunc) => {
    setStateFunc(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileCompleted(true);
  };

  useEffect(() => {
    if (profileCompleted) {
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    }
  }, [profileCompleted, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-4 left-4">
        <img src="public/images/logopet.png" alt="Logo" className="h-12 w-auto" />
      </div>
      <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Compléter votre profil</h2>
        {!profileCompleted ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="relative">
              <label htmlFor="dob" className="text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
              />
            </div>
            <div className="relative">
              <label htmlFor="gender" className="text-sm font-medium text-gray-700">Sexe</label>
              <select
                id="gender"
                name="gender"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
              >
                <option value="">Sélectionner votre sexe</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                
              </select>
            </div>
            <div className="relative">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">Ville</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="Votre ville"
              />
            </div>
            <div className="relative">
              <label htmlFor="country" className="text-sm font-medium text-gray-700">Pays</label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
              >
                <option value="">Sélectionner votre pays</option>
                {/* List of countries */}
                <option value="France">France</option>
                <option value="Canada">Canada</option>
                <option value="USA">États-Unis</option>
                <option value="Maroc">Maroc</option>
                <option value="Allemagne">Allemagne</option>
                <option value="Suisse">Suisse</option>
                <option value="Italie">Italie</option>
                <option value="Algérie">Algérie</option>
                <option value="Tunisie">Tunisie</option>
                <option value="KSA">KSA</option>
                <option value="UAE">UAE</option>
                {/* Add more countries as needed */}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <div className="flex">
                <input
                  id="phoneCode"
                  name="phoneCode"
                  type="text"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  required
                  className="mt-1 block w-1/4 px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                  placeholder="+33"
                />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1 block w-3/4 px-4 py-2 border border-gray-300 rounded-r-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                  placeholder="Votre numéro"
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="maritalStatus" className="text-sm font-medium text-gray-700">Situation amoureuse</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
              >
                <option value="">Sélectionner votre situation</option>
                <option value="single">Célibataire</option>
                <option value="married">Marié(e)</option>
                <option value="divorced">Divorcé(e)</option>
                <option value="widowed">Veuf(ve)</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="profilePhoto" className="text-sm font-medium text-gray-700">Photo de profil</label>
              <input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setPetDetails)}
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Avez-vous un animal de compagnie ?</label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-green-onion"
                    checked={hasPet}
                    onChange={handlePetToggle}
                  />
                  <span className="ml-2 text-gray-700">Oui</span>
                </label>
              </div>
            </div>

            {hasPet && (
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="petType" className="text-sm font-medium text-gray-700">Type d'animal</label>
                  <input
                    id="petType"
                    name="type"
                    type="text"
                    value={petDetails.type}
                    onChange={handlePetDetailChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                    placeholder="e.g., Chien, Chat"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="petBreed" className="text-sm font-medium text-gray-700">Race</label>
                  <input
                    id="petBreed"
                    name="breed"
                    type="text"
                    value={petDetails.breed}
                    onChange={handlePetDetailChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                    placeholder="e.g., Labrador, Siamois"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="petAge" className="text-sm font-medium text-gray-700">Âge</label>
                  <input
                    id="petAge"
                    name="age"
                    type="number"
                    value={petDetails.age}
                    onChange={handlePetDetailChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                    placeholder="Âge de votre animal"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="petPhoto" className="text-sm font-medium text-gray-700">Photo de l'animal</label>
                  <input
                    id="petPhoto"
                    name="petPhoto"
                    type="file"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setPetDetails)}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <button
                type="submit"
                className="w-full bg-green-onion text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-onion focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center text-green-onion">
            <p>Votre profil a été complété avec succès !</p>
            <p>Redirection en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletionPage;
