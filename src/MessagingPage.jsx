import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSearch, faEllipsisV, faSmile, faPaperclip, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import Header from './Header';

const MessagingPage = () => {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Latifa', lastMessage: 'Salut! Comment ça va?' },
    { id: 2, name: 'Sofia', lastMessage: 'Tu viens ce soir?' },
    { id: 3, name: 'Ahmed', lastMessage: 'Merci pour l\'invitation!' }
  ]);

  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Salut! Comment ça va?', sender: 'Latifa' },
    { id: 2, text: 'Ça va bien, merci! Et toi?', sender: 'Moi' },
    { id: 3, text: 'Je vais bien aussi, merci.', sender: 'Alice' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // Charger les messages pour la conversation sélectionnée
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = { id: Date.now(), text: newMessage, sender: 'Moi' };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Évite le comportement par défaut de l'entrée
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Fermer le sélecteur d'émojis après sélection
  };

  const handleFileAttachment = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMsg = {
          id: Date.now(),
          text: <img src={reader.result} alt="attachment" className="max-w-xs rounded-lg" />,
          sender: 'Moi'
        };
        setMessages([...messages, newMsg]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen">
        <Header />
        <div className="pt-16"> 
        {/* <h1>Welcome to Some Page</h1>
        <p>This content will no longer be hidden by the fixed header.</p> */}
      </div>
        
      {/* Sidebar - Conversations */}
      <aside className="w-1/4 bg-white border-r border-gray-200 shadow-lg p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <div className="flex items-center bg-gray-100 p-2 rounded-full mt-3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full bg-transparent border-none focus:outline-none px-3"
            />
          </div>
        </div>
        <ul className="space-y-4">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`p-2 rounded-lg cursor-pointer ${activeConversation.id === conversation.id ? 'bg-green-onion-light' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-onion-dark flex items-center justify-center text-white font-bold">
                  {conversation.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">{conversation.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-col w-3/4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md">
          <h2 className="text-xl font-semibold">{activeConversation.name}</h2>
          <FontAwesomeIcon icon={faEllipsisV} className="text-gray-400" />
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 bg-gray-100 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'Moi' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'Moi' ? 'bg-green-onion-dark text-white' : 'bg-white border border-gray-300 text-gray-800'}`}>
                {typeof message.text === 'string' ? (
                  <p className="text-base">{message.text}</p>
                ) : (
                  message.text // Afficher l'image si c'est un élément <img>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200 relative">
          <div className="flex items-center">
            <button className="mr-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <FontAwesomeIcon icon={faSmile} className="text-gray-500" />
            </button>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileAttachment}
            />
            <button className="mr-2" onClick={() => document.getElementById('fileInput').click()}>
              <FontAwesomeIcon icon={faPaperclip} className="text-gray-500" />
            </button>
            <button className="mr-2">
              <FontAwesomeIcon icon={faMicrophone} className="text-gray-500" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress} // Ajout du gestionnaire d'événements
              placeholder="Écrire un message..."
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-onion-dark"
            />
            <button
              className="ml-2 p-2 bg-green-onion-dark text-white rounded-full"
              onClick={handleSendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute bottom-16">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
