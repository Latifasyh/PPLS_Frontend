import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faBell, faStore, faLightbulb, faPhone, faPaw, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const RightSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false); // State to toggle sidebar

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded); // Toggle expanded/collapsed
    };

    return (
        <aside className={`fixed top-16 left-0 h-auto max-h-screen overflow-y-auto z-50 transition-all duration-300 ${isExpanded ? 'w-1/5' : 'w-16'} bg-white p-4 rounded-lg shadow-lg`}>
            {/* Button to toggle sidebar */}
            <button 
                onClick={toggleSidebar} 
                className="absolute top-4 right-4 text-green-onion-dark focus:outline-none">
                <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
            </button>

            {/* Sidebar content */}
            <h3 className={`text-xl font-bold mb-4 text-green-onion-dark ${!isExpanded && 'hidden'}`}>À découvrir</h3>
            <ul className="space-y-4">
                {[
                    { path: "/veterinary", icon: faUserDoctor, label: "Vétérinaires" },
                    { path: "/events", icon: faBell, label: "Événements" },
                    { path: "/marketplace", icon: faStore, label: "Store" },
                    { path: "/Shelter_services", icon: faPaw, label: "Toilettage et autres services" },
                    { path: "/tips", icon: faLightbulb, label: "Astuces" },
                    { path: "/emergencies", icon: faPhone, label: "Urgences" },
                ].map((item, index) => (
                    <li key={index}>
                        <Link to={item.path} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50 transition duration-200">
                            <div className="flex items-center justify-center w-8 h-8 bg-slate-50 rounded-full">
                                <FontAwesomeIcon icon={item.icon} className="text-lg text-green-onion" />
                            </div>
                            {isExpanded && (
                                <span className="text-base text-green-onion-dark">{item.label}</span> // Hide text when collapsed
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default RightSidebar;
