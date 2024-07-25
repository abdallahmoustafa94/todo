import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { setUser, clearUser } from '../store/authSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let updatedPhotoURL = photoURL;

      if (file) {
        const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, file);
        updatedPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: updatedPhotoURL,
      });

      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: name,
        email: email,
        photoURL: updatedPhotoURL,
      }, { merge: true });  

      dispatch(setUser({
        ...user,
        displayName: name,
        email: email,
        photoURL: updatedPhotoURL,
      }));

      setPhotoURL(updatedPhotoURL);
      setFile(null);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  if (!user) {
    return <div className="text-center mt-8 dark:text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Profile</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900 dark:border-red-700 dark:text-red-300" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 dark:bg-green-900 dark:border-green-700 dark:text-green-300" role="alert">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 dark:text-white">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-2 dark:text-white">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled
          />
        </div>
        <div>
          <label className="block mb-2 dark:text-white">Profile Picture:</label>
          {photoURL && <img src={photoURL} alt="Profile" className="w-32 h-32 object-cover rounded-full mb-2" />}
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <motion.button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded dark:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </motion.button>
      </form>
      <div className="mt-8">
        <motion.button 
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded dark:bg-red-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
}

export default Profile;