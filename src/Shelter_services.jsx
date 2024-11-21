import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Importer Link
import axios from 'axios';
import SidebarRr from './SidebarRr';

const Shelter_services = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hoveredServiceId, setHoveredServiceId] = useState(null);
  const [hoverMessage, setHoverMessage] = useState(''); // État pour le message de survol
  const formRef = useRef(null);

  // État pour les filtres
  const [filters, setFilters] = useState({
    name: '',
    ville: '',
    minPrice: '',
    maxPrice: '',
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    price_type: '',
    picture: null,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [businessDetails, setBusinessDetails] = useState(null);

  // Fonction pour récupérer tous les services
  const fetchServices = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/services', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedServices = response.data.map(service => {
        const imageUrl = `http://localhost:8000/storage/${service.picture}`;
        return {
          ...service,
          image: imageUrl,
        };
      });
      setServices(updatedServices);
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les services filtrés
  const fetchFilteredServices = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/services/filter/ville', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ville: filters.ville,
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utiliser useEffect pour récupérer les services au chargement du composant
  useEffect(() => {
    fetchServices();
  }, []);

  // Utiliser useEffect pour appliquer les filtres
  useEffect(() => {
    if (filters.ville) {
      fetchFilteredServices();
    } else {
      fetchServices();
    }
  }, [filters.ville]);

  // Gérer les changements dans les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Gérer le clic sur un service pour le modifier
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setNewService({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
      price_type: service.price_type,
      picture: service.picture || null,
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Gérer les changements dans le formulaire de nouveau service
  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };


  // Gérer le changement de fichier pour l'image
  const handleFileChange = (e) => {
    setNewService({ ...newService, picture: e.target.files[0] });
  };

  // Ajouter un nouveau service
  const addService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("Token manquant");
      return;
    }

    const formData = new FormData();
    Object.entries(newService).forEach(([key, value]) => {
      if (key === 'picture' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post('http://localhost:8000/api/services', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Réponse de l'API :", response.data);
      fetchServices(); // Met à jour la liste des services
      setShowAddForm(false); // Ferme le formulaire
      setNewService({
        name: '',
        category: '',
        price: '',
        description: '',
        price_type: '',
        picture: null,
      });
    } catch (error) {
      if (error.response) {
        console.error("Erreur API :", error.response.data);
      } else {
        console.error("Erreur réseau :", error.message);
      }
    }
  };

  // Mettre à jour un service existant
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    Object.entries(newService).forEach(([key, value]) => {
      if (value !== null || key !== 'picture') {
        formData.append(key, value);
      } else if (selectedService.picture) {
        formData.append('picture', selectedService.picture);
      }
    });

    try {
      await axios.post(`http://localhost:8000/api/services/${selectedService.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchServices();
      setShowAddForm(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service :", error);
    }
  };

  // Supprimer un service
  const deleteService = async (serviceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/services/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchServices();
      } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
      }
    }
  };

  // Afficher les détails d'un business
  const showBusinessDetails = (service) => {
    if (service.profession_type) {
      setBusinessDetails(service.profession_type);
      setIsModalVisible(true);
    } else {
      console.error('Aucune donnée profession_type disponible pour ce service.');
    }
  };

  // Filtrer les services selon les critères
  const filteredServices = services.filter(service => {
    const matchesCategory = filters.name ? service.name.includes(filters.name) : true;
    const matchesVille = filters.ville ? service.ville === filters.ville : true;
    const matchesMinPrice = filters.minPrice ? service.price >= parseInt(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? service.price <= parseInt(filters.maxPrice) : true;

    return matchesCategory && matchesVille && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <SidebarRr />
      <main className="p-20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Services</h2>

          {!showAddForm && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-slate-700 text-white p-2 rounded-md mb-4"
                >
                  <i className="fas fa-plus"></i> Ajouter un service
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Service"
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    name="ville"
                    value={filters.ville}
                    onChange={handleFilterChange}
                    placeholder="Ville"
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Prix Min"
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Prix Max"
                    className="p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-lg cursor-pointer flex flex-col h-full "
                    onClick={() => handleServiceClick(service)}
                  >
                    <img src={service.image} alt={service.name} className="w-full h-48 object-cover mb-2 rounded-lg" />
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-700 mb-2 flex-grow">{service.description}</p>
                    <p className="text-green-onion font-bold">{`${service.price} DH ${service.price_type}`}</p>

                    <div className="flex justify-between mt-2">
                      <button
                        className="bg-red-500 text-white p-2 rounded-md"
                        onClick={(e) => { e.stopPropagation(); deleteService(service.id); }}
                      >
                        Supprimer
                      </button>
                      <button
                        className="bg-blue-500 text-white p-2 rounded-md"
                        onClick={(e) => { e.stopPropagation(); showBusinessDetails(service); }}
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {showAddForm && (
            <form onSubmit={addService} className="mt-8 p-4 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Ajouter un Service</h3>
              <input
                type="text"
                name="name"
                value={newService.name}
                onChange={handleNewServiceChange}
                placeholder="Nom du service"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
              <input
                type="text"
                name="category"
                value={newService.category}
                onChange={handleNewServiceChange}
                placeholder="Catégorie"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="price"
                value={newService.price}
                onChange={handleNewServiceChange}
                placeholder="Prix"
                className="p-2 border rounded-lg mb-2 w-full max-w-xs"
                required
              />
               <select
                    name="price_type"
                    value={newService.price_type}
                    onChange={handleNewServiceChange}
                    className="p-2 border rounded-lg mb-2 w-1/2 max-w-xs"
                    required
                  >
                    <option value="">Par</option>
                    <option value="par séance">séance</option>         
                    <option value="par jour">jour</option>
                </select>
            </div>

              <textarea
                name="description"
                value={newService.description}
                onChange={handleNewServiceChange}
                placeholder="Description"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
              <input
                type="file"
                name="picture"
                onChange={handleFileChange}
                className="mb-2"
                required
              />
              <button type="submit" className="bg-green-onion-dark text-white p-2 rounded-md mt-4">
                Enregistrer
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-sky-950 text-white p-2 rounded-md mt-4 ml-4">
                Annuler
              </button>
            </form>
          )}
        </div>

        {selectedService && (
          <form ref={formRef} onSubmit={handleUpdate} className="mt-8 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Modifier le service</h3>
            <input
              type="text"
              name="name"
              value={newService.name || selectedService.name}
              onChange={handleNewServiceChange}
              placeholder="Nom du service"
              className="p-2 border rounded-lg mb-2 w-full"
              required
            />
            <input
              type="text"
              name="category"
              value={newService.category || selectedService.category}
              onChange={handleNewServiceChange}
              placeholder="Catégorie"
              className="p-2 border rounded-lg mb-2 w-full"
              required
            />
            <div>
              <input
                type="number"
                name="price"
                value={newService.price || selectedService.price}
                onChange={handleNewServiceChange}
                placeholder="Prix"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
             <select
                name="price_type"
                value={newService.price_type}
                onChange={handleNewServiceChange}
                className="p-2 border rounded-lg mb-2 w-1/2 max-w-xs"
                required
                >
                <option value="">Par</option>
                <option value="par séance">séance</option>
                <option value="par jour">jour</option>
             </select>
            </div>
            <textarea
              name="description"
              value={newService.description || selectedService.description}
              onChange={handleNewServiceChange}
              placeholder="Description"
              className="p-2 border rounded-lg mb-2 w-full"
              required
            />
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              className="mb-2"
            />
            <button type="submit" className="bg-green-onion-dark text-white p-2 rounded-md mt-4">
              Mettre à jour
            </button>
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="bg-sky-950 text-white p-2 rounded-md mt-4 ml-4"
            >
              Annuler
            </button>
          </form>
        )}

        {/* Modal for Business Details */}
        {isModalVisible && businessDetails && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4">Détails du Business</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Nom :</strong>
                    <Link to={`/${businessDetails.id}`} className="text-blue-500 hover:underline">
                      {businessDetails.business_name}
                    </Link>
                  </p>
                </div>
                <div>
                  <p><strong>Type de Business :</strong> {businessDetails.type}</p>
                </div>
                <div>
                  <p><strong>Adresse :</strong> {businessDetails.adresse}</p>
                </div>
                <div>
                  <p><strong>Ville :</strong> {businessDetails.ville}</p>
                </div>
                <div>
                  <p><strong>Téléphone :</strong> {businessDetails.num_pro}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalVisible(false)}
                className="mt-4 bg-red-500 text-white p-2 rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shelter_services;