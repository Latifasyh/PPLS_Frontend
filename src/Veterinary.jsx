import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SidebarRr from "./SidebarRr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const Veterinary = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [businessPictures, setBusinessPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 34.0,
    longitude: -6.0,
  });

  const token = localStorage.getItem("token");

  // Fetch veterinarians and their pictures
  const fetchVeterinarians = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/profession-types/type/veto",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const veterinariansWithCoordinates = response.data.map((vet) => ({
        ...vet,
        latitude: vet.latitude || 34.0,
        longitude: vet.longitude || -6.0,
      }));

      setVeterinarians(veterinariansWithCoordinates);

      const picturesPromises = veterinariansWithCoordinates.map(async (business) => {
        const professionTypes = business.type;
        const professionTypesId = business.id;

        if (!professionTypes || !professionTypesId) {
          console.error("Missing professionTypes or professionTypesId for business:", business);
          return null;
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

          return { id: business.id, pictures: picturesResponse.data };
        } catch (error) {
          console.error(`Error fetching pictures for business ID ${business.id}:`, error);
          return null;
        }
      });

      const picturesData = await Promise.all(picturesPromises);
      setBusinessPictures(picturesData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Geocode an address using OpenStreetMap's Nominatim API
  const geocodeAddress = async (address, city) => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: `${address}, ${city}`,
          format: "json",
        },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSelectedCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      } else {
        console.error("No results found for the address");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
  }, [fetchVeterinarians]);

  const handleVetSelect = (vet) => {
    geocodeAddress(vet.adresse, vet.ville);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <SidebarRr />
      <main className="p-20">
        <h1 className="text-2xl font-semibold mb-4">Vétérinaires</h1>
        <div className="flex flex-grow">
          {/* Liste des vétérinaires */}
          <div className="w-2/5 p-4 overflow-y-auto bg-white">
            <h2 className="text-2xl font-semibold mb-4">Liste des Vétérinaires</h2>
            <div className="space-y-4">
              {veterinarians.map((vet) => (
                <div
                  key={vet.id}
                  className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleVetSelect(vet)}
                >
                  {businessPictures
                    .filter((pic) => pic.id === vet.id)
                    .map((pic) => (
                      <div key={pic.id}>
                        {pic.pictures && pic.pictures.length > 0 && (
                          <img
                            src={`http://localhost:8000/storage/${pic.pictures[0].path}`}
                            alt="Business"
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                      </div>
                    ))}
                  <div className="mt-2">
                    <strong className="text-lg flex items-center">
                      <FontAwesomeIcon icon={faPaw} className="text-green-500 mr-2" />
                      {vet.business_name}
                    </strong>
                    <p className="text-sm text-gray-600">{vet.num_pro}</p>
                    <p className="text-sm text-gray-600">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" />
                      {vet.adresse}, {vet.ville}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carte OpenStreetMap */}
          <div className="fixed right-0.5 top-12 w-3/5 h-[90vh]">
            <iframe
              title="OpenStreetMap"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                selectedCoordinates.longitude - 0.01
              },${selectedCoordinates.latitude - 0.01},${
                selectedCoordinates.longitude + 0.01
              },${selectedCoordinates.latitude + 0.01}&layer=mapnik&marker=${
                selectedCoordinates.latitude
              },${selectedCoordinates.longitude}`}
              style={{ border: "1px solid black" }}
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Veterinary;
