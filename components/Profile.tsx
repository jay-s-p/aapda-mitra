
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { UserProfileIcon } from './icons/UserProfileIcon';
import { EditIcon } from './icons/EditIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface ProfileProps {
  onLogout: () => void;
}

const defaultProfile: UserProfile = {
  id: 1,
  name: 'New User',
  phone: '1234567890',
  age: 25,
  gender: 'Prefer not to say',
};

type Notification = {
    type: 'success' | 'error';
    message: string;
};

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(defaultProfile);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let userProfile = await db.userProfile.get(1);
        if (!userProfile) {
          await db.userProfile.put(defaultProfile);
          userProfile = defaultProfile;
        }
        setProfile(userProfile);
        setFormData(userProfile);
      } catch (error) {
        console.error("Failed to load profile:", error);
        showNotification('error', 'Could not load your profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'age' ? parseInt(value) || 0 : value });
  };

  const handleSave = async () => {
    try {
      await db.userProfile.put(formData);
      setProfile(formData);
      setIsEditing(false);
      showNotification('success', 'Profile updated successfully!');
    } catch (error) {
      console.error("Failed to save profile:", error);
      showNotification('error', 'Failed to save your profile.');
    }
  };
  
  const handleEdit = () => {
      if(profile) {
          setFormData(profile);
          setIsEditing(true);
      }
  }
  
  const handleCancelEdit = () => {
    if (profile) {
        setFormData(profile);
    }
    setIsEditing(false);
  }

  if (!profile) {
    return (
        <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 rounded-full bg-brand-blue animate-pulse"></div>
        </div>
    );
  }

  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700 max-w-2xl mx-auto">
      {notification && (
        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-semibold text-white ${notification.type === 'success' ? 'bg-brand-green' : 'bg-brand-red'}`}>
          {notification.message}
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="p-4 bg-brand-gray-700 rounded-full">
            <UserProfileIcon />
        </div>
        <div className='flex-grow text-center sm:text-left'>
            <h2 className="text-3xl font-bold text-brand-gray-100">{isEditing ? formData.name : profile.name}</h2>
            <p className="text-brand-gray-400">{isEditing ? formData.phone : profile.phone}</p>
        </div>
        <div className="flex gap-2">
            {isEditing ? (
                <>
                 <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                    <CheckIcon /> Save
                 </button>
                 <button onClick={handleCancelEdit} className="px-4 py-2 bg-brand-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-gray-500 transition-colors">
                    Cancel
                 </button>
                </>
            ) : (
                <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                    <EditIcon /> Edit Profile
                </button>
            )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-brand-gray-400" htmlFor="name">Full Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed text-brand-gray-100"
                />
            </div>
             <div>
                <label className="text-sm font-medium text-brand-gray-400" htmlFor="phone">Phone Number</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed text-brand-gray-100"
                />
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-brand-gray-400" htmlFor="age">Age</label>
                <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed text-brand-gray-100"
                />
            </div>
             <div>
                <label className="text-sm font-medium text-brand-gray-400" htmlFor="gender">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full mt-1 p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md disabled:opacity-70 disabled:cursor-not-allowed text-brand-gray-100"
                >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                </select>
            </div>
        </div>
      </div>

      <div className="mt-8 border-t border-brand-gray-700 pt-6">
        <button
          onClick={onLogout}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-brand-red/20 border-2 border-brand-red text-brand-red font-bold rounded-xl shadow-md hover:bg-brand-red/30 transition-all"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
