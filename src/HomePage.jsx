
import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import RightSidebar from './RightSidebar'
import Discussion from './Discussion';
import { AppContext } from './Context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faSmile, faFrown, faLaugh, faSurprise, faAngry, faEdit, faTrashCan, faUpload, faCancel, faClose, faThumbsDown, faSadCry } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
  const { token } = useContext(AppContext);
  const [newPost, setNewPost] = useState('');
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [comments, setComments] = useState({});
  const [reactions, setReactions] = useState({});
  const [showEmojis, setShowEmojis] = useState({});
  const [postType, setPostType] = useState('normal');
  const [username,setUsername]=useState('');
 const [picture,setPicture]=useState(null);
 const [loading, setLoading] = useState(false);


  const fileInputRef = useRef();

  // Fetch user information and posts from the API
  /* const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      const userResponse = await axios.get('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const account = userResponse.data.account || {};
      const user = account.user || {};
      setUsername(user.username || ''); // Mettez à jour le nom d'utilisateur
      setPicture(user.picture || ''); // Mettez à jour l'image de profil
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }; */
  
  // Fetch posts from the API
  const fetchPosts = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          
        },
      });
      //added

    const fetchedPosts = response.data;

    // Si l'utilisateur est associé à chaque publication
      if (fetchedPosts.length > 0) {
        const user = fetchedPosts[0].user || {}; // Supposons que l'utilisateur soit dans le premier post
        setUsername(user.username || ''); // Mettre à jour le nom d'utilisateur
        setPicture(user.picture || ''); // Mettre à jour l'image de profil
      }
     // console.log(response.data); // Vérifiez ici la structure de la réponse
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts on load
  }, [token]);

  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

//add

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };


  /* const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files)); // Set files as an array
  };
 */
//added
  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles); // Set files as an array
  };
  const handlePublish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const selectedPostType = postType;

  
    // Vérifiez que le texte ou les fichiers sont valides
    if (!newPost.trim() && files.length === 0) {
      alert('Veuillez ajouter un texte ou un fichier pour publier.');
      return;
    }

   
    const formData = new FormData();
  
    // Ajout du texte à la FormData
    if (newPost.trim() !== '') {
      formData.append('body', newPost.trim()); // Body as in your Node.js example
    }
  
    // Ajout des fichiers à la FormData (gérer dans le navigateur)
   /*  files.forEach((file, index) => {
      formData.append('file', file); // Match backend expectations
    }); */
    files.forEach((file) => {
      formData.append('file', file);
    });

    formData.append('type', postType); // Utilise selectedPostType ici

  
   // formData.append('type', selectedPostType); // Utilise selectedPostType ici
    
    setLoading(true); // Start loading added
    
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/posts',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          // No need for multipart/form-data header, browser handles it
        },
        data: formData,
        maxBodyLength: Infinity, // Same as your Node.js version
      });
  
      console.log('Post publié avec succès:', response.data);
  
      // Réinitialisation du formulaire après la publication
      setNewPost('');   // Clear the post text
      setFiles([]);     // Clear the selected files
      fetchPosts();     // Reload posts or update UI as necessary
                    
    } catch (error) {
      if (error.response) {
        console.error('Erreur lors de la publication:', error.response.data);
      } else {
        console.error('Erreur inconnue:', error);
      }
    }
  };
  const handleEditPost = (index) => {
    const postToEdit = posts[index];
    setNewPost(postToEdit.body);
    setPostType(postToEdit.type || ''); // Set the post type
    setEditIndex(index);
  };
  

/*   const handleEditPost = (index) => {
    const postToEdit = posts[index];
    setNewPost(postToEdit.body);
    setFiles([]); // Clear files if needed
    setEditIndex(index);
    setPostType(postToEdit.type || 'normal'); // Définir le type de post lors de l'édition

    
  }; */

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
      console.error('Error deleting post:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index)); // Retirer le fichier sélectionné
  };

  const handleAddComment = (index, comment) => {
    const postComments = comments[index] || [];
    setComments({ ...comments, [index]: [...postComments, comment] });
  };

  const handleReaction = (index, emoji) => {
    const newReactions = { ...reactions };
    newReactions[index] = emoji;
    setReactions(newReactions);
    setShowEmojis({ ...showEmojis, [index]: false });
  };

  const handleShowEmojis = (index) => {
    setShowEmojis((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const triggerFileInput = () => fileInputRef.current.click();

  // Emoji icons and colors
  const emojiColors = {
    like: 'text-blue-500',
    love: 'text-red-500',
    laugh: 'text-yellow-500',
    surprise: 'text-purple-500',
    angry: 'text-red-600',
  };

  const emojiIcons = {
    like: faThumbsUp,
    love: faSmile,
    laugh: faLaugh,
    //surprise: faSurprise,
    angry: faAngry,
    dislike: faThumbsDown,
    sad : faSadCry,
  };

  return (
    <div className="flex">
      <RightSidebar  />
      <div className="flex-grow bg-green-onion-50 ml-6 min-h-screen flex flex-col">
        <div className="pt-16 flex-grow">
          <main className="w-full ml-16 flex flex-col items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl p-4 shadow-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">Quoi de neuf ?</h2>
              <form onSubmit={handlePublish}>
                {/* Reduced textarea size */}
                <textarea
                  value={newPost}
                  onChange={handlePostChange}
                  className="w-full p-2 border rounded-md text-base text-gray-700"
                  placeholder="Écrivez quelque chose..."
                  rows="2" // Reduced row size to make it smaller
                  style={{ height: '60px' }} // Custom height for a smaller input area
                ></textarea>
                
                <div className="mt-2 flex justify-end space-x-3 border-t pt-2">
                <select
                    value={postType}
                    //onChange={handlePostTypeChange}
                   // onChange={(e) => setPostType(e.target.value)}
                   onChange={handlePostTypeChange}
                    className="p-2 border rounded-md text-gray-700"
                  >
                    <option value="normal">Normal</option>
                    <option value="emergency">Urgent</option>
                    <option value="astuce">Astuce</option>
                  </select>

                <button
                  type="button"  // Changez type="submit" en type="button" pour éviter la soumission
                 // onClick={() => fileInputRef.current.click()}
                 onClick={triggerFileInput}
                 // onClick={triggerFileInput}
                  className="flex items-center"
                >
                  <FontAwesomeIcon icon={faUpload} className="mr-1" />
                 {/*  Upload */}
                </button>
                  <input
                    type="file"
                    multiple
                    onChange={handleFilesChange}
                 //  onChange={(e) => setFiles(Array.from(e.target.files))}

                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    className="bg-green-onion-dark text-white p-2 rounded-md"
                    type="submit"
                  >
                    {editIndex >= 0 ? 'Modifier' : 'Publier'}
                  </button>
                </div>

                {/* Display selected files */}
                {files.length > 0 && (
                  <div className="relative bg-white w-full max-w-2xl p-4 shadow-lg mb-4">
                    {files.map((file, index) => (
                      <div key={index} className="mb-2 ">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Aperçu"
                            className="w-full h-[300px] object-contain mb-2 rounded  " // Fixed height and full width with object-contain
                            />
                        ) : (
                          <video controls className="w-full h-[300px] mb-2">
                            <source src={URL.createObjectURL(file)} />
                            Votre navigateur ne prend pas en charge la vidéo.
                          </video>
                        )}
                        <button
                          onClick={() => handleRemoveFile(index)} // Ajouter le bouton de suppression
                          className= "absolute top-2 right-2 text-red-500"//"ml-2 absolute top-2 right-2 text-red-500 "
                        >
                       <FontAwesomeIcon icon={faClose} className="mr-1" />

                       </button>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white w-full max-w-2xl p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Publications</h2>
              {posts.length === 0 && <p>Aucune publication pour le moment.</p>}
              {posts.map((post, index) => (
                <div key={post.id} className="mb-4">
                  <div className="flex items-start justify-between">
                  <div className="flex items-center">
                      <div className="flex flex-col items-center"> {/* Utilise un div flex pour empiler les éléments */}
                          <h3 className="font-semibold text-gray-700">{post.user.account.username}</h3> {/* Utilise une classe pour le style du texte */}
                          <img
                              src={`http://localhost:8000/storage/profil_picture/${post.user.picture}`} // Utilisez l'image de la base de données
                              alt="Photo de profil"
                              className="w-10 h-10 rounded-full mb-1" // Ajoute une marge en bas
                          />
                      </div>
                  </div>
                    <div className="space-x-2">
                      <button onClick={() => handleEditPost(index)}>
                        <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
                      </button>
                      <button onClick={() => handleDeletePost(index)}>
                        <FontAwesomeIcon icon={faTrashCan} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-black-800 text-base mt-2">{post.body}</p>
                  
                  <div className="mt-2">
                    {post.file && (
                      <div 
                          className={`mb-2 p-2 rounded ${
                          post.type === 'emergency'
                          ? 'border-2 border-red-600'
                          : post.type === 'astuce'
                          ? 'border-2 border-yellow-500'
                          : 'border-2 border-green-500'
                      }`}
                      >
                        {post.file.endsWith('.png') || post.file.endsWith('.jpg') || post.file.endsWith('.jpeg') ? (
                          <img
                            src={post.file}
                            alt="Post File"
                            className="w-[700px] h-[500px] object-contain mb-2 rounded block" // Full-width image
                          />
                        ) : (
                          <video controls className="w-full h-[300px] mb-2">
                            <source src={post.file} />
                            Votre navigateur ne prend pas en charge la vidéo.
                          </video>
                        )}
                      </div>
                    )}
                    {post.created_at && (
                    <p className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                  )}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <button onClick={() => handleShowEmojis(index)}>
                      {reactions[index] ? (
                        <FontAwesomeIcon icon={emojiIcons[reactions[index]]} className={`text-lg ${emojiColors[reactions[index]]}`} />
                      ) : (
                        <FontAwesomeIcon icon={faThumbsUp} className="text-gray-400" />
                      )}
                    </button>
                    {showEmojis[index] && (
                      <div className="absolute bg-white shadow-lg rounded p-2">
                        {Object.keys(emojiIcons).map((key) => (
                          <button key={key} onClick={() => handleReaction(index, key)} className="p-1">
                            <FontAwesomeIcon icon={emojiIcons[key]} className={`text-lg ${emojiColors[key]}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      className="border p-2 rounded mt-2 w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(index, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    {comments[index] && comments[index].map((comment, commentIndex) => (
                      <div key={commentIndex} className="mt-1 text-gray-600">
                        {comment}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <div className="w-1/5 ">
        <Discussion />
      </div>
    </div>  
  );
};

export default HomePage;
