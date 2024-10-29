import React, { useState } from 'react';

const Marketplace = () => {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: 'Croquettes', type: 'croquette', description: 'Description du produit...', price: 50, image: 'https://via.placeholder.com/300', city: 'Paris', seller: 'Revendeur 1' },
    { id: 2, name: 'Laisse', type: 'accessoire', description: 'Description du produit...', price: 15, image: 'https://via.placeholder.com/300', city: 'Lyon', seller: 'Revendeur 2' },
    // Ajoutez d'autres produits ici
  ];

  const filteredProducts = products.filter(product => {
    return (
      (filters.type === '' || product.type === filters.type) &&
      (filters.city === '' || product.city.toLowerCase() === filters.city.toLowerCase()) &&
      (filters.minPrice === '' || product.price >= parseInt(filters.minPrice)) &&
      (filters.maxPrice === '' || product.price <= parseInt(filters.maxPrice))
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleContactSeller = () => {
    alert(`Vous avez contacté le revendeur: ${selectedProduct.seller}`);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Header */}
      <header className="p-4 shadow-md bg-green-onion-dark text-white">
        <div className="container mx-auto flex items-center">
          <h1 className="text-3xl font-bold mr-6" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.5px' }}>
            PetPals
          </h1>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full p-1 w-1/2 max-w-md mx-4">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="w-full px-4 py-1 rounded-full border-none focus:outline-none text-gray-800"
            />
          </div>

          {/* Navigation */}
          <nav className="ml-auto">
            <ul className="flex space-x-4">
              <li><a href="/home" className="text-white hover:underline text-sm">Accueil</a></li>
              <li><a href="/friends" className="text-white hover:underline text-sm">Amis</a></li>
              <li><a href="/marketplace" className="text-white hover:underline text-sm">Store</a></li>
              <li><a href="/notifications" className="text-white hover:underline text-sm">Notifications</a></li>
              <li><a href="/messages" className="text-white hover:underline text-sm">Messagerie</a></li>
              <li><a href="/profile" className="text-white hover:underline text-sm">Profil</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Marketplace</h2>

          {/* Filters */}
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
                <option value="croquette">Croquette</option>
                <option value="accessoire">Accessoire</option>
                {/* Ajoutez d'autres types ici */}
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

          {/* Product Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-100 p-4 rounded-lg shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2 rounded-lg" />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-green-onion font-bold">{`DH${product.price}`}</p>
              </div>
            ))}
          </div>

          {/* Selected Product Details */}
          {selectedProduct && (
            <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Détails du Produit</h3>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover mb-4 rounded-lg" />
              <h4 className="text-xl font-semibold">{selectedProduct.name}</h4>
              <p className="text-gray-700">{selectedProduct.description}</p>
              <p className="text-green-onion font-bold mb-4">{`DH${selectedProduct.price}`}</p>
              <button
                className="bg-green-onion-dark text-white p-2 rounded-md"
                onClick={handleContactSeller}
              >
                Contacter le Revendeur
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-onion-dark text-white p-4 text-center mt-auto">
        <p>&copy; 2024 PetPals. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Marketplace;
