import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from './Context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faClose, faEdit, faImage, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';

const Discussion = () => {
  const { token } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:8000/api/discussion', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const fetchedMessages = response.data || [];
      const updatedMessages = fetchedMessages.map(msg => ({
        ...msg,
        user: {
          username: msg.user?.account?.username || 'Utilisateur inconnu',
          picture: msg.user?.picture || ''
        }
      }));

      setMessages(updatedMessages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleFileRemove = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    let data = new FormData();
    data.append('message', message);
    if (file) {
      data.append('file_msg', file);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/discussion', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessages(prevMessages => [...prevMessages, {
        ...response.data.message,
        user: {
          username: 'Vous',
          picture: ''
        }
      }]);
      setMessage('');
      fetchMessages();
      handleFileRemove();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const handleEditClick = (msg) => {
    setEditMessageId(msg.id);
    setEditMessageText(msg.message);
  };

  const handleUpdateMessage = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`http://localhost:8000/api/discussion/${editMessageId}`, {
        message: editMessageText,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      setMessages(prevMessages => prevMessages.map(msg => 
        msg.id === editMessageId ? { ...msg, message: response.data.message } : msg
      ));
      setEditMessageId(null);
      setEditMessageText('');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:8000/api/discussion/${messageId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMessages(prevMessages => prevMessages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'url_de_l_avatar_par_defaut';
  };

  return (
    <div className="w-1/4 bg-white p-2 rounded-lg shadow-lg fixed top-16 right-0 h-[calc(94vh-4rem)] flex flex-col ">
      <h2 className="text-xl font-bold mb-3 text-green-onion-dark">Discussion</h2>

      <div className="flex-grow flex flex-col space-y-4 mb-4 overflow-y-auto">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="border p-3 rounded-md shadow-md flex flex-col">
              <div className="flex justify-start items-center mb-2 space-x-2">
                <div className="flex flex-col items-center p-1">
                  <img
                    src={msg.user.picture ? `http://localhost:8000/storage/profil_picture/${msg.user.picture}` : 'url_de_l_avatar_par_defaut'}
                    alt="Photo de profil"
                    className="w-10 h-10 rounded-full mb-1"
                    onError={handleImageError}
                  />
                </div>
                <h3 className="font-semibold text-gray-700">{msg.user.username}</h3>
              </div>
              <div className="flex justify-end space-x-2 text-xs">
                <button onClick={() => handleEditClick(msg)} className="text-gray-500">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              
              <div>
                {editMessageId === msg.id ? (
                  <form onSubmit={handleUpdateMessage}>
                    <input
                      type="text"
                      value={editMessageText}
                      onChange={(e) => setEditMessageText(e.target.value)}
                      className="border rounded p-1 w-full"
                    />
                    <button type="submit" className="text-blue-500">
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-800">{msg.message}</p>
                )}
                {msg.file_msg && (
                  <img
                    src={`http://localhost:8000/storage/${msg.file_msg}`}
                    alt="Attachment"
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Aucun message disponible.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center border rounded-md p-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border-0 outline-none"
          placeholder="Écrire un message..."
        />
        <label className="ml-1 cursor-pointer">
          <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          <FontAwesomeIcon icon={faImage} />
        </label>
        {filePreview && (
          <div className="flex   ml-3">
             <button type="button" onClick={handleFileRemove} className=" text-red-500">
              <FontAwesomeIcon icon={faClose} />
            </button>
            <img src={filePreview} alt="Aperçu" className="w-10 h-10 object-cover rounded" />
          </div>
        )}
        <button type="submit" className="ml-3">
          <FontAwesomeIcon icon={faPaperPlane} className="text-blue-500" />
        </button>
      </form>
    </div>
  );
};

export default Discussion;
