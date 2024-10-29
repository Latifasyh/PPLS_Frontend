import React from 'react';
import Header from './Header';

const EventCard = ({ event }) => (
  <div className="border rounded-lg shadow-lg overflow-hidden">
    <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{event.title}</h2>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <button className="bg-green-onion-dark text-white py-2 px-4 rounded hover:bg-green-onion-light">
        Cliquer pour participer
      </button>
    </div>
  </div>
);

const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: "Marche pour les chiens",
      description: "Rejoignez-nous pour une marche communautaire avec vos amis à fourrure.",
      image: "https://cdn.shopify.com/s/files/1/0207/6046/1412/files/groupe-canimarche-HB-auteur-j-1195x800_480x480.jpg?v=1636827517", // Replace with actual image URL
    },
    {
      id: 2,
      title: "Atelier de dressage de chats",
      description: "Apprenez des techniques de dressage pour votre chat.",
      image: "https://i.f1g.fr/media/cms/704x396_cropupscale/2022/12/27/6cfb1677f98f555ac4464d3d2dd71a02352043108e9d38126814ec39ddd9fd43.jpg", // Replace with actual image URL
    },
    {
      id: 3,
      title: "Exposition de poissons",
      description: "Venez découvrir une variété de poissons exotiques.",
      image: "https://cdn.futura-sciences.com/cdn-cgi/image/width=1280,quality=60,format=auto/sources/images/diaporama/2153_-_Poissons_exotiques_/fsSynchiropus_splendidus_2_%20poisson%20mandarin.jpg", // Replace with actual image URL
    },
    // Add more events as needed
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
        <Header />
        <div className="pt-16"> {/* Adjust `pt-16` based on the height of your header */}
        {/* <h1>Welcome to Some Page</h1>
        <p>This content will no longer be hidden by the fixed header.</p> */}
      </div>
      <h1 className="text-3xl font-bold mb-6">Événements pour Animaux</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
