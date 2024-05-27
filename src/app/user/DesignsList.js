import React, { useState } from 'react';
import Link from 'next/link';

const DesignsList = ({ projects, deleteProject }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteClick = (projectId) => {
    setConfirmDelete(projectId);
  };

  const handleConfirmDelete = () => {
    deleteProject(confirmDelete);
    setConfirmDelete(null);
  };

  const handleAddProject = (name) => {
    const existingProject = projects.find(project => project.name === name);
    if (existingProject) {
      setErrorMessage('¡Ya existe un proyecto con ese nombre!');
    } else {
      setErrorMessage('');
    }
  };

  return (
    <div className="h-[60vh] overflow-auto bg-neutral-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Designs</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {projects.map((project) => (
        <div key={project.id} className="bg-neutral-800 border border-neutral-400 p-4 mb-4 rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">
              {/* Enlace al proyecto */}
              <Link href="/ejemploLink">
                <p>{project.name}</p>
              </Link>
            </h3>
            <div>
              {confirmDelete === project.id ? (
                <div className="flex items-center space-x-2">
                  <p className="text-white">¿Estás seguro?</p>
                  <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                    Sí
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button onClick={() => handleDeleteClick(project.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                  Eliminar
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400">Última edición: {project.lastEdited}</p>
        </div>
      ))}
    </div>
  );
};

export default DesignsList;
