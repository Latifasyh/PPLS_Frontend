import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { AppContext } from './Context/AppContext';

const LoginPage = () => {
  const { setToken } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.errors) {
        setErrors(data.errors);
      } else {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/home"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      // Optionally set a general error message if needed
      setErrors({ general: "Une erreur est survenue. Veuillez réessayer plus tard." });
    } finally {
      // End loading
      setIsLoading(false);
    }
  }

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-11/12 lg:w-2/3 mx-auto overflow-hidden shadow-lg rounded-lg">
        {/* Section du carousel */}
        <div className="hidden lg:block lg:w-1/2">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            className="h-full"
          >
            <div className="h-96"> {/* Hauteur fixée */}
              <img src="public/images/photo1.jpg" alt="Photo 1" className="object-cover w-full h-full" />
            </div>
            <div className="h-96"> {/* Hauteur fixée */}
              <img src="public/images/photo2.jpg" alt="Photo 2" className="object-cover w-full h-full" />
            </div>
            <div className="h-96"> {/* Hauteur fixée */}
              <img src="public/images/photo3.jpg" alt="Photo 3" className="object-cover w-full h-full" />
            </div>
            <div className="h-96"> {/* Hauteur fixée */}
              <img src="public/images/photo4.jpg" alt="Photo 4" className="object-cover w-full h-full" />
            </div>
            <div className="h-96"> {/* Hauteur fixée */}
              <img src="public/images/photo5.jpg" alt="Photo 5" className="object-cover w-full h-full" />
            </div>
            <div className="h-96"> {/* Hauteur fixée */}
              <img src="public/images/photo6.jpg" alt="Photo 6" className="object-cover w-full h-full" />
            </div>
          </Carousel>
        </div>
                

        {/* Section du formulaire de connexion */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
        {/* Logo en haut à gauche */}
        <div className="absolute top-4 left-4">
            <img src="public/images/logopet.png" alt="Logo" className="h-12 w-auto" />
          </div>
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Connexion</h2>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="relative">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  placeholder="exemple@mail.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
              <div className="relative">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <Link to="/reset-password" className="text-sm font-medium text-green-onion hover:text-green-onion-dark">Mot de passe oublié?</Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-onion hover:bg-green-onion-dark transition duration-150 ease-in-out"
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Connexion en cours...
                    </div>
                  ) : (
                    "Connexion"
                  )}
                </button>
              </div>
            </form>
            <div className="text-center mt-6">
              <p className="text-sm">Pas encore de compte? <Link to="/register" className="font-medium text-green-onion hover:text-green-onion-dark transition duration-150 ease-in-out">Créer un compte</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
