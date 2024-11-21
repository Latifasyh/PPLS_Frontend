import React, { useContext, useEffect, useState, useRef, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from './Context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronLeft, faChevronRight, faEdit, faSave, faRotateBackward, faTrash, faClose } from '@fortawesome/free-solid-svg-icons';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons/faDeleteLeft';

const Business = () => {

  const navigate = useNavigate();

  const { token } = useContext(AppContext);
  const [showUploadButton, setShowUploadButton] = useState(false); // Contrôle l'affichage du bouton "Publier"
  const fileInputRef = useRef(null); // Créer une référence pour l'input de fichier
  const [businesses, setBusinesses] = useState([]);
  const [activePictureIndex, setActivePictureIndex] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null); // État pour le business sélectionné
  const [isEditing, setIsEditing] = useState(false);  // Mode édition activé ou non
  const [newPictures, setNewPictures] = useState([]);
  const [pictureId, setPictureId] = useState(null); // L'ID de l'image à supprimer
  const [message, setMessage] = useState(""); // Message d'info pour l'utilisateur
  const [newBusiness, setNewBusiness] = useState({
    business_name: '',
    type: 'seller',  // Valeur par défaut
    num_pro: '',
    adresse:'',
    ville: '',  
    pictures: [],
  });


  

  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  
    const fetchBusinesses =  useCallback(async () => {
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/profession-types', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBusinesses(response.data);

        await Promise.all(
          response.data.map(async (business) => {
            const professionTypes = business.type;
            const professionTypesId = business.id;

            if (!professionTypes || !professionTypesId) {
              console.error('Missing professionTypes or professionTypesId for business:', business);
              return;
            }

            try {
              const picturesResponse = await axios.get(
                `http://localhost:8000/api/pictures-business/${professionTypes}/${professionTypesId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              setBusinesses((prev) =>
                prev.map((b) =>
                  b.id === business.id ? { ...b, pictures: picturesResponse.data } : b
                )
              );

              setActivePictureIndex((prev) => ({ ...prev, [business.id]: 0 }));
            } catch (error) {
              console.error(`Error fetching pictures for business ID ${business.id}:`, error);
            }
          })
        );
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    }, [token]);

    useEffect(() => {
      fetchBusinesses();
  }, [fetchBusinesses]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewBusiness((prev) => ({ ...prev, pictures: files }));
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    if (newBusiness.pictures.length === 0) {
      console.error('Une photo est obligatoire');
      return; // Empêche l'envoi du formulaire si aucune photo n'est ajoutée
    }
  
    try {
      const formData = new FormData();
      formData.append('type', newBusiness.type);
      formData.append('business_name', newBusiness.business_name);
      formData.append('adresse', newBusiness.adresse);
      formData.append('ville', newBusiness.ville);
      formData.append('num_pro', newBusiness.num_pro);
  
      // Ajouter les photos au FormData
      newBusiness.pictures.forEach((file) => {
        formData.append('pictures[]', file);
      });
  
      // Créer le professiontype
      const response = await axios.post(
        'http://localhost:8000/api/profession-types', // Utiliser l'URL appropriée pour créer un professiontype
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Récupérer l'ID du professiontype créé
      const professionTypeId = response.data.id;
  
      // Ajouter les photos au business via la route appropriée
      const pictureFormData = new FormData();
      newBusiness.pictures.forEach((file) => {
        pictureFormData.append('pictures[]', file);
      });
  
      // Utiliser la route correcte pour ajouter les photos au business
      await axios.post(
        `http://localhost:8000/api/pictures-business/${professionTypeId}`, // URL pour ajouter les photos au professiontype
        pictureFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Réinitialiser le formulaire après soumission
      setNewBusiness({
        business_name: '',
        type: 'seller',
        adresse: '',
        ville: '',
        num_pro: '',
        pictures: [],
      });
  
      fetchBusinesses(); // Recharger la liste des businesses
      setIsFormVisible(false); // Masquer le formulaire après soumission
    } catch (error) {
      console.error('Error adding professiontype with pictures:', error);
    }
  };
  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setNewBusiness({
      business_name: business.business_name,
      type: business.type,
      adresse: business.adresse,
      ville: business.ville,
      num_pro: business.num_pro,
   // pictures: business.pictures || [],
    });
    setIsEditing(true);
  };
  
  // Handle business update
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Vérifiez si le token est présent
    if (!token) {
      console.error('No token found');
      return;
    }
  
    // Vérifiez si un business est sélectionné
    if (!selectedBusiness || !selectedBusiness.id) {
      console.error("Aucun business sélectionné pour la mise à jour");
      return;
    }
  
    try {
      // Créez un objet avec les données à mettre à jour
      const updatedBusiness = {
        type: newBusiness.type,
        business_name: newBusiness.business_name,
        adresse: newBusiness.adresse,
        ville: newBusiness.ville,
        num_pro: newBusiness.num_pro,
      };
  
      // Effectuez la requête PUT
      const response = await axios.put(
        `http://localhost:8000/api/profession-types/${selectedBusiness.id}`,
        updatedBusiness, // Envoyez l'objet JSON directement
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Spécifiez que le contenu est JSON
          },
        }
      );
  
      // Réinitialisez le formulaire après la mise à jour
      setNewBusiness({
        business_name: '',
        type: 'seller',
        adresse: '',
        ville: '',
        num_pro: '',
      });
  
      // Rechargez les données des businesses
      fetchBusinesses();
  
      // Réinitialisez l'état de sélection et de modification
      setSelectedBusiness(null);
      setIsEditing(false); // Quittez le mode d'édition après la mise à jour
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  const showPreviousPicture = (businessId) => {
    const business = businesses.find(b => b.id === businessId);
    if (business && business.pictures.length > 0) {
      setActivePictureIndex((prev) => ({
        ...prev,
        [businessId]: (prev[businessId] - 1 + business.pictures.length) % business.pictures.length,
      }));
    }
  };

  const showNextPicture = (businessId) => {
    const business = businesses.find(b => b.id === businessId);
    if (business && business.pictures.length > 0) {
      setActivePictureIndex((prev) => ({
        ...prev,
        [businessId]: (prev[businessId] + 1) % business.pictures.length,
      }));
    }
  };

 /*  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setNewBusinessType(business.business_type); // Pré-remplir le type de business
  }; */

 

  const handleCancel = () => {
    setIsEditing(false); // Disable editing mode without saving
    // Reset form to the original values if necessary
    setNewBusiness({
      business_name: selectedBusiness.business_name,
      type: selectedBusiness.type,
      adresse: selectedBusiness.adresse,
      ville: selectedBusiness.ville,
      num_pro: selectedBusiness.num_pro,
    //  pictures: selectedBusiness.pictures,
    });
  };

  /* const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBusiness({
      ...selectedBusiness,
      [name]: value,
    });
  }; */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
    setIsFormVisible(false); // Masquer le formulaire lorsque vous sélectionnez un business
  };


  /* const handlePictureUploadChange = (e) => {
    const files = Array.from(e.target.files);
    setNewBusiness((prev) => ({ ...prev, pictures: files }));//pictures added
    setNewPictures(files); // Mettre à jour l'état avec les fichiers sélectionnés
  }; */

   // Gestion de la sélection des fichiers
   const handlePictureUploadChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setNewPictures(selectedFiles);
    setShowUploadButton(true); // Affiche le bouton "Publier" seulement si des images sont sélectionnées
  };

 /*  const handlePictureUploadSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    if (newPictures.length === 0) {
      console.error('At least one picture is required');
      return; // Empêche la soumission si aucune photo n'est sélectionnée
    }
  
    try {
      const pictureFormData = new FormData();
      newPictures.forEach((file) => {
        pictureFormData.append('pictures[]', file);
      });
  
      console.log('Uploading pictures for business ID:', selectedBusiness.id);
      console.log('Pictures to upload:', newPictures);
  
      await axios.post(
        `http://localhost:8000/api/pictures-business/${selectedBusiness.id}`, // URL pour l'upload
        pictureFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSelectedBusiness((prev) => ({
        ...prev,
        pictures: [
          ...prev.pictures,
          ...newPictures.map(file => ({
            path: URL.createObjectURL(file), // Créez une URL temporaire pour l'affichage
            // Vous pouvez ajouter d'autres propriétés si nécessaire
          })),
        ],
      }));
  
      // Réinitialiser l'état des nouvelles photos après l'upload
      setNewPictures([]);
      fetchBusinesses(); // Recharger les businesses pour refléter les nouvelles photos

     
    
    } catch (error) {
      console.error('Error uploading pictures:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    }
  }; */

      const handlePictureUploadSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            console.error('No token found');
            return;
        }

        if (newPictures.length === 0) {
            console.error('At least one picture is required');
            return; // Empêche la soumission si aucune photo n'est sélectionnée
        }

        try {
            const pictureFormData = new FormData();
            newPictures.forEach((file) => {
                pictureFormData.append('pictures[]', file);
            });

            console.log('Uploading pictures for business ID:', selectedBusiness.id);
            console.log('Pictures to upload:', newPictures);

            await axios.post(
                `http://localhost:8000/api/pictures-business/${selectedBusiness.id}`, // URL pour l'upload
                pictureFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Récupérer les photos après l'upload
            const updatedPicturesResponse = await fetchPictures(selectedBusiness.type, selectedBusiness.id, token);
            
            // Mettre à jour l'état de selectedBusiness avec les nouvelles photos
            setSelectedBusiness((prev) => ({
                ...prev,
                pictures: updatedPicturesResponse, // Mettez à jour les photos avec celles récupérées
            }));

            // Réinitialiser l'état des nouvelles photos après l'upload
            setNewPictures([]);
            fetchBusinesses(); // Recharger les businesses pour refléter les nouvelles photos

        } catch (error) {
            console.error('Error uploading pictures:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            }
        }
    };

    const fetchPictures = async (professionType, businessId, token) => {
      const config = {
          method: 'get',
          url: `http://localhost:8000/api/pictures-business/${professionType}/${businessId}`, // Utilisez la bonne route
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      };

      try {
          const response = await axios.request(config);
          return response.data; // Retourne les données des photos
      } catch (error) {
          console.error('Error fetching pictures:', error);
          throw error; // Relancer l'erreur pour la gestion dans l'appelant
      }
    };

    const handleDelete = async (pictureId) => {
      // Demander à l'utilisateur de confirmer la suppression
      const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette photo ?');
      
      if (isConfirmed) {
        // URL de l'API pour la suppression de la photo
        const url = `http://localhost:8000/api/pictures-business/${pictureId}`;
        
        // Token d'authentification
        const token = localStorage.getItem('token');
      
        console.log(`Attempting to delete picture with ID: ${pictureId}`); // Debugging
        
        try {
          // Effectuer la requête DELETE
          await axios.delete(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
          console.log('Image deleted successfully');
    
          // Récupérer les photos mises à jour après la suppression
          const updatedPictures = await fetchPictures(selectedBusiness.type, selectedBusiness.id, token);
    
          // Mettre à jour l'état de selectedBusiness avec les nouvelles photos
          setSelectedBusiness((prev) => ({
            ...prev,
            pictures: updatedPictures, // Met à jour les photos avec celles récupérées
          }));
    
          // Réinitialiser l'état des nouvelles photos après l'upload
          setNewPictures([]);
    
          // Recharger les entreprises (si nécessaire)
          fetchBusinesses();
    
          // Afficher un message de succès
          alert('La photo a été supprimée avec succès.');
        } catch (error) {
          console.error('Error deleting picture:', error);
          alert('Une erreur est survenue lors de la suppression de la photo.');
        }
      }
    };
    
    const handleDeleteBusiness = (professionTypes, professionTypeId) => {
      const token = localStorage.getItem('token');  // Récupérer le token depuis le stockage local
    
      if (!professionTypes || !professionTypeId) {
        alert('Aucun type de business sélectionné');
        return;
      }
    
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce business et ses photos ?');
      if (!confirmDelete) return;
    
      // Suppression du business en premier
      axios.delete(`/api/profession-types/${professionTypeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Inclure le token dans l'en-tête
        },
      })
     /*  .then(() => {
        console.log('Business supprimé');
        // Supprimer les images associées au business après la suppression du business
        return axios.delete(`/api/pictures-business/${professionTypes}/${professionTypeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }) */
      .then(() => {
        console.log('Images supprimées avec succès');
        // Mise à jour de l'état pour retirer le business de la liste
        setBusinesses(prevBusinesses => prevBusinesses.filter(business => business.id !== professionTypeId));
        setSelectedBusiness(null);
        alert('Business et ses images supprimés avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression');
      });
    };

    // Fonction pour ouvrir le modal
  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage('');
  };

    
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Mes Businesses</h2>
      <div className="flex justify-end mb-3">
      {!selectedBusiness && (
        <button 
          /* onClick={() => setIsFormVisible(!isFormVisible)}  */
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            setSelectedBusiness(null); // Réinitialiser la sélection de business
          }} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          title="Ajouter votre commerce"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
          )}
      </div>

      {!selectedBusiness && isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-100">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Type de Business :</label>
            <select 
              value={newBusiness.type}
              onChange={(e) => setNewBusiness({ ...newBusiness, type: e.target.value })} 
              className="block w-full p-2 border rounded"
            >
              <option value="seller">Seller</option>
              <option value="sheltter">Shelter</option>
              <option value="veto">Veterinary</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Nom du Business :</label>
            <input
              type="text"
              value={newBusiness.business_name || ''}
              onChange={(e) => setNewBusiness({ ...newBusiness, business_name: e.target.value })}
              required
              className="block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Adresse :</label>
            <input
              type="text"
              value={newBusiness.adresse ||''}
              onChange={(e) => setNewBusiness({ ...newBusiness, adresse: e.target.value })}
              required
              className="block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Ville :</label>
            <input
              type="text"
              value={newBusiness.ville ||''}
              onChange={(e) => setNewBusiness({ ...newBusiness, ville: e.target.value })}
              required
              className="block w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Téléphone :</label>
            <input
              type="text"
              value={newBusiness.num_pro ||''}
              onChange={(e) => setNewBusiness({ ...newBusiness, num_pro: e.target.value })}
              required
              className="block w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Ajouter des Photos :</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full border rounded p-2"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Enregistrer
          </button>
        </form>
      )}
      
    {selectedBusiness ? (
      <div>
        <button 
          onClick={() => setSelectedBusiness(null)} 
          className="mb-4 text-green-800 hover:underline "
        >
          <FontAwesomeIcon icon={faChevronLeft} className='px-1' />
          Retour
          
        </button>
        {/* Affichage des détails du business sélectionné */}
        <div >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-end mb-2">
            <button
              onClick={() => handleEdit(selectedBusiness)}
              className="bg-green-800 text-white px-2 py-2 rounded text-xs hover:bg-green-600"
            title="Modifier"
          >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  value={newBusiness.business_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Type</label>
                <select
                  name="type"
                  value={newBusiness.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="seller">Seller</option>
                  <option value="shelter">Shelter</option>
                  <option value="veterinary">Veterinary</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="num_pro"
                  value={newBusiness.num_pro}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="adresse"
                  value={newBusiness.adresse}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="ville"
                  value={newBusiness.ville}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  
                  className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-500"
                >
                 <FontAwesomeIcon icon={faSave} />  

                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  <FontAwesomeIcon icon={faRotateBackward} />
                </button>
              </div>
            </form>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold">{selectedBusiness.business_name}</h3>
            <p>Type: {selectedBusiness.type}</p>
            <p>Telephone: {selectedBusiness.num_pro}</p>
            <p>Adresse: {selectedBusiness.adresse}</p>
            <p>Ville: {selectedBusiness.ville}</p>
          </div>
        )}

         {/*  <h3 className="text-2xl font-semibold">{selectedBusiness.business_name}</h3>
          <p>Type: {selectedBusiness.type}</p>
          <p>Telephone: {selectedBusiness.num_pro}</p>
          <p>Adresse: {selectedBusiness.adresse}</p>
          <p>Ville: {selectedBusiness.ville}</p> */}
       </div>
          {/* Navigation photos */}

          <form className="flex flex-col items-end mb-3 text-sm p-2">
            {/* Input de fichier caché */}
          <input
            type="file"
            multiple
            onChange={handlePictureUploadChange}
            className="hidden"
            ref={fileInputRef}
          />

          {/* Bouton faPlus pour ajouter et uploader les photos */}
          {newPictures.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-500 flex items-center"
              title="Ajouter des photos"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 " /> 
            </button>
          ) : (
            <div className="w-full mt-4">
              <h4 className="text-lg font-semibold mb-2">Photos sélectionnées :</h4>
              <div className="flex flex-wrap gap-4"> 
                {newPictures.map((file, index) => (
                  <div key={index} className="flex-shrink-0 w-1/3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>
                ))}
            </div>
            <button
              onClick={handlePictureUploadSubmit}
              className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-500 mt-3"
            >
              Publier
            </button>
          </div>
            )}
          </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-0">   
          {selectedBusiness.pictures.map((picture, index) => (
          <div key={index} className="relative flex-shrink-0 w-full">
          <img
            src={`http://localhost:8000/storage/${picture.path}`}
            alt={selectedBusiness.business_name}
            className="w-full h-48 object-cover rounded-md"

            onClick={() => openModal(`http://localhost:8000/storage/${picture.path}`)} // Ouvrir le modal avec l'image

          />    
           {/* Bouton de suppression (icône) */}
           <button 
            className="absolute top-1 right-1  bg-opacity-75  rounded-full cursor-pointer hover:bg-opacity-100"
            onClick={() => handleDelete(picture.id)} // Appel de la fonction handleDelete avec l'ID de l'image
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-600 text-m" />
          </button>
            {/* <p>{message}</p> */}
           
          </div>
        ))}
        </div>
     </div>
    </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white p-6 rounded-lg shadow-md relative">
            {business.pictures && business.pictures.length > 0 ? (
              <div className='relative'>
               <img
               src={`http://localhost:8000/storage/${business.pictures[activePictureIndex[business.id]]?.path}`}
               alt={business.name}
               className="w-full h-48 object-cover rounded-t-lg mb-4"

               onClick={() => openModal(`http://localhost:8000/storage/${business.pictures[activePictureIndex[business.id]]?.path}`)} // Ouvrir le modal

             />
              {/* Afficher les chevrons seulement si plusieurs photos sont disponibles */}
              {business.pictures.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between ">
                  <button 
                    onClick={() => showPreviousPicture(business.id)} 
                    className="bg-white rounded-full  shadow transform -translate-y-2">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button 
                    onClick={() => showNextPicture(business.id)} 
                    className="bg-white rounded-full  shadow transform -translate-y-2 ">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              )}
             </div>

            ) : (
              <div className="h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                Aucune photo
              </div>
            )}
            <h3 className="text-lg font-semibold">{business.business_name}</h3>
            <p>{business.type}</p>
            <p>{business.ville}</p>
            <button
              onClick={() => setSelectedBusiness(business)}
              className="mt-3 text-green-950 hover:underline"
            >
              Voir les détails
            </button>
            <button 
                className="absolute top-1 right-1  bg-opacity-75  rounded-full cursor-pointer hover:bg-opacity-100"
                onClick={() => handleDeleteBusiness(business.professionTypes || 'defaultType', business.id || 0)} 
                // disabled={!selectedBusiness}

            >
                <FontAwesomeIcon icon={faClose} className="text-red-600 text-m" />
            </button>
          </div>
        ))}
      </div>
    )}

{isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
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
)};


export default Business;
