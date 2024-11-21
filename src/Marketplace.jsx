import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Importer Link
import Business from './Business';
import axios from 'axios';
import SidebarRr from './SidebarRr';

const Marketplace = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [hoverMessage, setHoverMessage] = useState(''); // État pour le message de survol
  const formRef = useRef(null);

  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    category: '',
    price: '',
    description: '',
    animal_type: '',
    picture: null,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [businessDetails, setBusinessDetails] = useState(null);

  

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedProducts = response.data.map(product => ({
        ...product,
        image: `http://localhost:8000/storage/${product.picture}`,
      }));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  /* const handleMouseEnter = (id) => {
    setHoveredProductId(id);
    setHoverMessage('Mettre à jour'); // Afficher le message de survol
  };

  const handleMouseLeave = () => {
    setHoveredProductId(null);
    setHoverMessage(''); // Masquer le message de survol
  }; */


  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      product_name: product.product_name,
      category: product.category,
      price: product.price,
      description: product.description,
      animal_type: product.animal_type,
      picture: product.picture || null,
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, picture: e.target.files[0] });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      await axios.post('http://localhost:8000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
      });
      
      fetchProducts();
      setNewProduct({
        product_name: '',
        category: '',
        animal_type: '',
        price: '',
        description: '',
        picture: null,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
  
    // Ajouter les informations mises à jour dans le formData
    Object.entries(newProduct).forEach(([key, value]) => {
      formData.append(key, value);
      if (value !== null || key !== 'picture') {
        formData.append(key, value);
      } else if (selectedProduct.picture) {
        // Si aucune nouvelle image n'est sélectionnée, ajouter l'ancienne image
        formData.append('picture', selectedProduct.picture);
      }
    });
  
    try {
      // Mise à jour du produit via API
      await axios.post(`http://localhost:8000/api/products/${selectedProduct.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Récupérer à nouveau la liste des produits après la mise à jour
      fetchProducts();
      setShowAddForm(false); // Fermer le formulaire de mise à jour
      setSelectedProduct(null); // Réinitialiser le produit sélectionné
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
    }
  };
  

  const deleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const showBusinessDetails = (product) => {
    if (product.profession_type) {
      setBusinessDetails(product.profession_type); // Récupérer les détails du type de profession
      setIsModalVisible(true); // Afficher la modale
    } else {
      console.error('No profession_type data available for this product.');
    }
  };

 /*  const filteredProducts = products.filter(product => {
    return (
      (filters.type === '' || product.category === filters.type) &&
      (filters.city === '' || product.city.toLowerCase() === filters.city.toLowerCase()) &&
      (filters.minPrice === '' || product.price >= parseInt(filters.minPrice)) &&
      (filters.maxPrice === '' || product.price <= parseInt(filters.maxPrice))
    );
  }); */
  const filteredProducts = products.filter(product => {
    // Vérifie chaque filtre et applique-les au produit
    const matchesType = filters.type ? product.category === filters.type : true;
    const matchesCity = filters.city ? product.city.toLowerCase() === filters.city.toLowerCase() : true;
    const matchesMinPrice = filters.minPrice ? product.price >= parseInt(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? product.price <= parseInt(filters.maxPrice) : true;
  
    // Si tous les filtres sont satisfaits, on conserve le produit
    return matchesType && matchesCity && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <SidebarRr />
     
      <main className="p-20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Marketplace</h2>

          {!showAddForm && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-slate-700 text-white p-2 rounded-md mb-4"
                >
                  <i className="fas fa-plus"></i> Ajouter un Produit
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="p-2 border rounded-lg"
                  >
                    <option value="">Type de produit</option>
                    <option value="croquette">croquete</option>
                    <option value="accessoire">Accessoire</option>
                  </select>
                  <input
                    type="text"
                    name="city"
                    value={filters.city}
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
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-lg cursor-pointer"
                    title="Modifier votre produit"

                    onClick={() => handleProductClick(product)}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2 rounded-lg" />
                    <h3 className="text-xl font-semibold mb-2">{product.product_name}</h3>
                    <p className="text-gray-700 mb-2">{product.description}</p>
                    <p className="text-green-onion font-bold">{`DH${product.price}`}</p>

                    <div className="flex justify-between mt-2">
                      <button
                        className="bg-red-500 text-white p-2 rounded-md"
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                      >
                        Supprimer
                      </button>
                      
                      <button
                        className="bg-blue-500 text-white p-2 rounded-md"
                        onClick={(e) => { e.stopPropagation(); showBusinessDetails(product); }}
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
            <form onSubmit={addProduct} className="mt-8 p-4 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Ajouter un Produit</h3>
              <input
                type="text"
                name="product_name"
                value={newProduct.product_name}
                onChange={handleNewProductChange}
                placeholder="Nom du produit"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                placeholder="Catégorie"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
              <input
                type="text"
                name="animal_type"
                value={newProduct.animal_type}
                onChange={handleNewProductChange}
                placeholder="Animal"
                className="p-2 border rounded-lg mb-2 w-full"
                required
              />
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                placeholder="Prix"
                className="p-2 border rounded -lg mb-2 w-full"
                required
              />
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
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
                Enregistrer
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-sky-950 text-white p-2 rounded-md mt-4 ml-4">
                Annuler
              </button>
            </form>
          )}
        </div>

        
      {selectedProduct && (
        <form ref={formRef} onSubmit={handleUpdate} className="mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Modifier le Produit</h3>
          
          <input
            type="text"
            name="product_name"
            value={newProduct.product_name || selectedProduct.product_name}
            onChange={handleNewProductChange}
            placeholder="Nom du produit"
            className="p-2 border rounded-lg mb-2 w-full"
            required
          />
          <input
            type="text"
            name="category"
            value={newProduct.category || selectedProduct.category}
            onChange={handleNewProductChange}
            placeholder="Catégorie"
            className="p-2 border rounded-lg mb-2 w-full"
            required
          />
          <input
            type="text"
            name="animal_type"
            value={newProduct.animal_type || selectedProduct.animal_type}
            onChange={handleNewProductChange}
            placeholder="Type d'animal"
            className="p-2 border rounded-lg mb-2 w-full"
            required
          />
          <input
            type="number"
            name="price"
            value={newProduct.price || selectedProduct.price}
            onChange={handleNewProductChange}
            placeholder="Prix"
            className="p-2 border rounded-lg mb-2 w-full"
            required
          />
          <textarea
            name="description"
            value={newProduct.description || selectedProduct.description}
            onChange={handleNewProductChange}
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
            onClick={() => setSelectedProduct(null)}
            className="bg-sky-950 text-white p-2 rounded-md mt-4 ml-4"
          >
            Annuler
          </button>
        </form>
      )}

      </main>



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
    </div>
  );
};

export default Marketplace;