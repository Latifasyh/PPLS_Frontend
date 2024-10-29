// src/components/RightSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faBell, faStore, faLightbulb, faPhone, faPaw } from '@fortawesome/free-solid-svg-icons';

const LeftSidebar = () => {
    return (
        <aside className="w-1/4 bg-white p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
          <ul>
            <li><Link to="/friends" className="text-green-onion-dark hover:underline">Ajouter des amis</Link></li>
            <li><Link to="/pages" className="text-green-onion-dark hover:underline">Pages à suivre</Link></li>
          </ul>
        </aside>
    );
};

export default LeftSidebar;
