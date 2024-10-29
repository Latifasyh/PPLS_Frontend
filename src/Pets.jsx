import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileEdit, faPlus, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons/faDeleteLeft';

const Pets = () => {
  const [petsData, setPetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // État pour afficher le formulaire d'ajout
  
  const [petForm, setPetForm] = useState({
    name: '',
    birthday_pet: '',
    family: '',
    breed: '',
    vaccination_agenda: '',
    disease: '',
    pet_picture: null,
  });

  const fetchPetsData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/pets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const filteredPetsData = response.data.map(pet => ({
        id: pet.id,
        name: pet.name,
        pet_picture: pet.pet_picture ? `http://localhost:8000/storage/${pet.pet_picture}` : '',
        family: pet.family,
        breed: pet.breed,
        birthday_pet: pet.birthday_pet,
        vaccination_agenda: pet.vaccination_agenda,
        disease: pet.disease,
      }));

      setPetsData(filteredPetsData);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetsData();
  }, []);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setPetForm({ 
      name: pet.name, 
      birthday_pet: pet.birthday_pet, 
      family: pet.family, 
      breed: pet.breed, 
      vaccination_agenda: pet.vaccination_agenda, 
      disease: pet.disease,
      pet_picture: null 
    });
    setIsEditing(false);
    setError(null); // Reset error state
    setIsAdding(false); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetForm({ ...petForm, [name]: value });
  };

  const handleFileChange = (e) => {
    setPetForm({ ...petForm, pet_picture: e.target.files[0] });
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', petForm.name);
    formData.append('birthday_pet', petForm.birthday_pet);
    formData.append('family', petForm.family);
    formData.append('breed', petForm.breed);
    formData.append('vaccination_agenda', petForm.vaccination_agenda);
    formData.append('disease', petForm.disease);
    
    // Ensure pet_picture is a File object (from file input in React)
    if (petForm.pet_picture instanceof File) {
        formData.append('pet_picture', petForm.pet_picture);
    }

    try {
        const response = await axios.post(`http://localhost:8000/api/pets/${selectedPet.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
            maxBodyLength: Infinity
        });
        console.log('Animal mis à jour:', response.data);
        setIsEditing(false);
        setSelectedPet(null);
        fetchPetsData(); // Refresh pets data
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error.response ? error.response.data : error.message);
    }
};

  const handleAddPet = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(petForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = await axios.post('http://localhost:8000/api/pets', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Animal ajouté:', response.data);
      setIsAdding(false);
      setPetForm({ name: '', birthday_pet: '', family: '', breed: '', vaccination_agenda: '', disease: '', pet_picture: null });
      fetchPetsData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet animal ?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/pets/${petId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("Animal supprimé:", response.data);
        // Mettez à jour la liste après la suppression
        setPetsData(petsData.filter(pet => pet.id !== petId));
        fetchPetsData();

      } catch (error) {
        console.error("Erreur lors de la suppression:", error.response ? error.response.data : error.message);
        setError(error.response?.data?.message || error.message);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mes Animaux</h1>
        <button 
          onClick={() => {
            setIsAdding(true);
            setSelectedPet(null); 
            // setPetForm({ name: '', birthday_pet: '', family: '', breed: '', vaccination_agenda: '', disease: '', pet_picture: null }); // Réinitialiser le formulaire d'ajout
            setPetForm(true);
          } }
          className="bg-slate-800 text-white p-2 rounded flex items-center ml-auto"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {isAdding && (
        <form onSubmit={handleAddPet} className="bg-white shadow-md rounded-lg p-4 mt-4">
          <div className="flex justify-center mb-4 relative">
            <label htmlFor="pet_picture" className="cursor-pointer">
              {petForm.pet_picture ? (
                <img 
                  src={URL.createObjectURL(petForm.pet_picture)} 
                  alt="pet" 
                  className="w-32 h-32 rounded-full object-cover shadow-md" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon icon={faEdit} className="text-gray-400 text-4xl" />
                </div>
              )}
            </label>
            <input 
              type="file" 
              id="pet_picture" 
              name="pet_picture" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-2">
              <label>Name:</label>
              <input 
                type="text" 
                name="name" 
                value={petForm.name} 
                onChange={handleInputChange} 
                className="border rounded p-1 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Family:</label>
              <input 
                type="text" 
                name="family" 
                value={petForm.family} 
                onChange={handleInputChange} 
                className="border rounded p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Breed:</label>
              <input 
                type="text" 
                name="breed" 
                value={petForm.breed} 
                onChange={handleInputChange} 
                className="border rounded p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Birthday:</label>
              <input 
                type="date" 
                name="birthday_pet" 
                value={petForm.birthday_pet} 
                onChange={handleInputChange} 
                className="border rounded p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Vaccination Agenda:</label>
              <input 
                type="date" 
                name="vaccination_agenda" 
                value={petForm.vaccination_agenda} 
                onChange={handleInputChange} 
                className="border rounded p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Disease:</label>
              <input 
                type="text" 
                name="disease" 
                value={petForm.disease} 
                onChange={handleInputChange} 
                className="border rounded p-1 w-full"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Ajouter Animal
          </button>
        </form>
      )}
      
      {!isAdding && !selectedPet && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {petsData.map((pet) => (
            <div 
              key={pet.id} 
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer" 
              onClick={() => handlePetClick(pet)}
            >
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <img 
                  src ={pet.pet_picture} 
                  alt={pet.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-lg font-semibold text-center mt-2">{pet.name}</h3>
              <p className="text-center text-gray-600">{pet.breed}</p>
            </div>
          ))}
        </div>
      )}
      
      {selectedPet && (
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              src={selectedPet.pet_picture} 
              alt={selectedPet.name} 
              className="w-32 h-32 rounded-full shadow-lg"
              onClick={() => setSelectedPet(null)}
            />
            {isEditing && (
                
              <label htmlFor="pet_picture" className="absolute top-0 right-0">
                <FontAwesomeIcon icon={faFileEdit} className="text-gray-500 cursor-pointer" />
                <input 
                  type="file" 
                  id="pet_picture" 
                  className="hidden" 
                  onChange={(e) => setPetForm({ ...petForm, pet_picture: e.target.files[0] })} 
                />
              </label>
            )}
          </div>
          {isEditing ? (
            <input 
              type="text" 
              name="name" 
              value={petForm.name} 
              onChange={handleInputChange} 
              className="border rounded p-1 w-full text-center mb-2"
            />
          ) : (
            <h2 className="text-2xl font-semibold mb-2">{selectedPet.name}</h2>
          )}
          <button 
            className="bg-white p-1 rounded-full shadow-md" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <FontAwesomeIcon icon={isEditing ? faRotateBack  : faEdit} />
          </button>
          {isEditing ? (
            <form onSubmit={handleUpdatePet} className="bg-white shadow-md rounded-lg p-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-2">
                  <label>Family:</label>
                  <input 
                    type="text" 
                    name="family" 
                    value={petForm.family} 
                    onChange={handleInputChange} 
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label>Breed:</label>
                  <input 
                    type="text" 
                    name="breed" 
                    value={petForm.breed} 
                    onChange={handleInputChange} 
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label>Birthday:</label>
                  <input 
                    type="date" 
                    name="birthday_pet" 
                    value={petForm.birthday_pet} 
                    onChange={handleInputChange} 
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label>Vaccination Agenda:</label>
                  <input 
                    type="text" 
                    name="vaccination_agenda" 
                    value={petForm.vaccination_agenda} 
                    onChange={handleInputChange} 
                    className="border rounded p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label>Disease:</label>
                  <input 
                    type="text" 
                    name="disease" 
                    value={petForm.disease} 
                    onChange={handleInputChange} 
                    className="border rounded p-1 w-full"
                  />
                </div>
                <button type="submit" className="bg-lime-100 p-1 rounded-full shadow-md">
                     Save
                </button>
              </div>
            </form>
          ) : (
            
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <h3 className="text-lg font-bold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-2"><strong>Family:</strong> {selectedPet.family}</div>
                <div className="mb-2"><strong>Breed:</strong> {selectedPet.breed}</div>
                <div className="mb-2"><strong>Birthday:</strong> {selectedPet.birthday_pet}</div>
                <div className="mb-2"><strong>Vaccination Agenda:</strong> {selectedPet.vaccination_agenda}</div>
                <div className="mb-2"><strong>Disease:</strong> {selectedPet.disease}</div>
              </div>
              <div className="flex justify-center">
                <button 
                    onClick={() => {handleDeletePet(selectedPet.id);
                    setSelectedPet(null); 
                    setPetForm(true)}}
                    className="text-orange-700 font-semibold "
                    >
                        Delete
                    <span className="ml-2">
                        <FontAwesomeIcon icon={faDeleteLeft} />
                    </span>
                    </button>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pets;