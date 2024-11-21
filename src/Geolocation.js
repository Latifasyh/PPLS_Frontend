// Geolocation.js
import React from 'react';
import { useGeolocated } from "react-geolocated";

const Geolocation = ({ onLocationChange }) => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  React.useEffect(() => {
    if (coords) {
      onLocationChange([coords.latitude, coords.longitude]);
    }
  }, [coords, onLocationChange]);

  if (!isGeolocationAvailable) {
    return <div>Geolocation is not supported by your browser.</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled. Please enable it in your browser settings.</div>;
  }

  return null; // Ne rien afficher pendant le chargement
};

export default Geolocation;