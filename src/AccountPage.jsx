import React from 'react';
import Header from './Header';

const AccountPage = () => {
  return (
    <div className="container mx-auto mt-6 p-4">
        <Header />
        <div className="pt-10"> {/* Adjust `pt-16` based on the height of your header */}
        {/* <h1>Welcome to Some Page</h1>
        <p>This content will no longer be hidden by the fixed header.</p> */}
      </div>
      <h1 className="text-2xl font-bold mb-4">Compte</h1>
      
      {/* Paramètres et Confidentialité */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">Paramètres et confidentialité</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>Paramètres du compte</li>
          <li>Confidentialité</li>
          <li>Préférences de sécurité</li>
          <li>Vérification de l'identité</li>
        </ul>
      </div>

      {/* Donner votre avis */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">Donner votre avis</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>Partager votre expérience</li>
          <li>Suggérer des améliorations</li>
        </ul>
      </div>

      {/* Aide et Assistance */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold">Aide et assistance</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>Centre d'aide</li>
          <li>Contactez le support</li>
          <li>Problèmes techniques</li>
        </ul>
      </div>

      {/* Affichage et Accessibilité */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Affichage et accessibilité</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>Mode sombre</li>
          <li>Accessibilité</li>
          <li>Police d'affichage</li>
        </ul>
      </div>
    </div>
  );
};

export default AccountPage;
