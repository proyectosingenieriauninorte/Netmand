import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

const UserInfo = ({ userName, handleLogout }) => {
  const [image, setImage] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoutClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleCancelLogout = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setIsConfirmationOpen(false);
  };

  return (
    <div className="bg-neutral-800 p-4 rounded-lg">
      <div className="flex flex-col items-center">
        <label htmlFor="profile-pic" className="relative cursor-pointer">
          <div className="w-24 h-24 bg-gray-400 rounded-full mb-4">
            {image && <img src={image} alt="Profile" className="w-full h-full object-cover rounded-full" />}
          </div>
          <input id="profile-pic" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        <h2 className="text-lg font-bold text-white mb-2">{userName}</h2>
        <button onClick={handleLogoutClick} className="w-36 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Cerrar sesión
        </button>
      </div>
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default UserInfo;
