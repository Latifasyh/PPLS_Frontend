import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './Context/AppContext';

export default function RegisterPage() {
  const {token, setToken} = useContext(AppContext)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors) {
      setErrors(data.errors); // Display errors if any
    } else {
      localStorage.setItem('token', data.token); // Save token if registration is successful
      setToken(data.token);
      navigate("/home");
    }
  }

  return (
    <>
    
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="absolute top-4 left-4">
          <img src="/images/logopet.png" alt="Logo" className="h-12 w-auto" />
        </div>
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Créer un compte</h2>
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="relative">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="John"
              />
              {errors?.first_name && <p className="text-red-500">{errors.first_name}</p>}
            </div>
            
            {/* Last Name Field */}
            <div className="relative">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="Doe"
              />
              {errors?.last_name && <p className="text-red-500">{errors.last_name}</p>}
            </div>

            {/* Username Field */}
            <div className="relative">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="john_doe"
              />
              {errors?.username && <p className="text-red-500">{errors.username}</p>}
            </div>

            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="exemple@mail.com"
              />
              {errors?.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="••••••••"
              />
              {errors?.password && <p className="text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-onion focus:border-green-onion transition duration-150 ease-in-out"
                placeholder="••••••••"
              />
              {errors?.password_confirmation && <p className="text-red-500">{errors.password_confirmation}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-onion hover:bg-green-onion-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-onion transition duration-150 ease-in-out"
              >
                Créer un compte
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
