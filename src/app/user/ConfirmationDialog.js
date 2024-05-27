import React from 'react';

const ConfirmationDialog = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-800 p-8 rounded-md shadow-md">
        <p className="mb-4">¿Estás seguro de que quieres cerrar sesión?</p>
        <div className="flex justify-end">
          <button onClick={onCancel} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;