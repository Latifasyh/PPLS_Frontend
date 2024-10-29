import React from 'react';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
      <div className="absolute top-10 left-10">
            <img src="public/images/logopet.png" alt="Logo" className="h-12 w-auto" />
          </div>
        <h2 className="text-2xl font-bold text-center">Réinitialiser le mot de passe</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-onion hover:bg-green-onion-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-onion transition duration-150 ease-in-out">
              Envoyer un email de réinitialisation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
