import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from './Context/AppContext';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import SidebarRr from './SidebarRr';

const UrgencePage = () => {
  const { token } = useContext(AppContext);
  const [newPost, setNewPost] = useState('');  // Texte du post
  const [file, setFile] = useState(null);      // Fichier à envoyer
  const [fileName, setFileName] = useState(''); // Nom du fichier sélectionné
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(""); // Gérer les erreurs
  
  const fileInputRef = useRef();
  const [editIndex, setEditIndex] = useState(null); // Track the post being edited

  // Fonction pour envoyer un nouveau post avec un fichier
  const submitPost = async () => {
    const token = localStorage.getItem('token');

    if (!newPost.trim()) {
      setError("Le champ ne peut pas être vide.");
      return;
    }

    const formData = new FormData();
    formData.append("body", newPost); // Texte de l urgence
    formData.append("type", "emergency"); // Type fixé 
    
    // Si un fichier est sélectionné, ajoutez-le à formData
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/posts',
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        data: formData,
        maxBodyLength: Infinity, 
      });

      const newPost = response.data;
      if (newPost.file) {
        newPost.file = `http://127.0.0.1:8000/storage/${newPost.file}`;
      }
      setPosts([newPost, ...posts]);
      setNewPost(""); // Réinitialiser le champ texte
      setFile(null); // Réinitialiser le fichier
      setFileName(''); // Réinitialiser le nom du fichier affiché
      setError(""); // Réinitialiser l'erreur
    } catch (error) {
      console.error("Erreur lors de la publication : ", error);
      setError("Une erreur est survenue lors de la publication.");
    }
  };

  // Fonction pour récupérer les posts
  const fetchPostsTips = async () => {
    try {
      const response = await axios.get('/api/posts?type=emergency', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
    }
  };

  useEffect(() => {
    fetchPostsTips();  // Récupérer les posts lors du chargement du composant
  }, [token]);

  // Fonction pour afficher le nom du fichier sélectionné
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Affiche le nom du fichier sélectionné
    }
  };

  const handleEditPost = (index) => {
    const postToEdit = posts[index];
    setNewPost(postToEdit.body);
    setFile(null);  // Clear the previous file if editing
    setEditIndex(index); // Set the index for the post being edited
  };

  const handleUpdatePost = async () => {
    if (!newPost.trim()) {
      setError("Le champ ne peut pas être vide.");
      return;
    }
  
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("body", newPost); // Texte de l'astuce
  
    if (file) {
      formData.append("file", file); // Fichier à envoyer
    }
  
    try {
      const postId = posts[editIndex].id;
  
      // Use PATCH method, as in Postman
      const response = await axios.patch(`/api/posts/${postId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders(), // Important to set form-data headers
        },
      });
  
      const updatedPost = response.data;
      if (updatedPost.file) {
        updatedPost.file = `http://127.0.0.1:8000/storage/${updatedPost.file}`;
      }
  
      const updatedPosts = [...posts];
      updatedPosts[editIndex] = updatedPost;
      setPosts(updatedPosts);
      setNewPost('');
      setFile(null);
      setFileName('');
      setEditIndex(null);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
      setError("Une erreur est survenue lors de la mise à jour.");
    }
  };
  
  const handleDeletePost = async (index) => {
    const postId = posts[index].id;
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((_, i) => i !== index));
      alert('Post supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      alert('Erreur lors de la suppression.');
    }
  };

  return (

    <div className="flex">
    <SidebarRr />
    <div className="flex-grow ml-11">  

    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="pt-16">
        <h1 className="text-3xl font-bold mb-6">Les urgences </h1>

        {/* Formulaire pour ajouter ou éditer un post */}
        <div className="mb-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Écrivez une nouvelle astuce..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          ></textarea>

          <div className="flex justify-end items-center mt-4 ">
            {/* Bouton personnalisé pour le fichier */}
            <label
              htmlFor="fileInput"
              className="bg-lime-950 text-white py-2 px-4 rounded cursor-pointer mr-4"
            >
              Parcourir
            </label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {/* Afficher le nom du fichier sélectionné */}
            {fileName && (
              <div className="text-yellow-500 mt-2">Fichier sélectionné: {fileName}</div>
            )}

            {/* Bouton Publier ou Mettre à jour */}
            {editIndex !== null ? (
              <button
                className="bg-blue-800 text-white py-2 px-4 rounded"
                onClick={handleUpdatePost}
              >
                Mettre à jour
              </button>
            ) : (
              <button
                className="bg-yellow-800 text-white py-2 px-4 rounded"
                onClick={submitPost}
              >
                Publier
              </button>
            )}
          </div>
        </div>

        {/* Affichage des posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
            {post.file && (
              <img
                src={post.file} // Lien vers l'image
                alt={post.body}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-gray-600">{post.body}</p> {/* Contenu du post */}
            </div>

            {/* FontAwesome buttons in top-right corner */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button onClick={() => handleEditPost(index)}>
                <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
              </button>
              <button onClick={() => handleDeletePost(index)}>
                <FontAwesomeIcon icon={faTrashCan} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
     </div>
    </div>

    </div>
    </div>
  );
};

export default UrgencePage;
