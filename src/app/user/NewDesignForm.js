import React, { useState } from 'react';

const NewDesignForm = ({ addProject, projects, onCancel }) => {
  const [projectName, setProjectName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim() !== '') {
      const existingProject = projects.find(project => project.name.toLowerCase() === projectName.toLowerCase());
      if (existingProject) {
        setErrorMessage('Ya existe un proyecto con este nombre.');
      } else {
        const newProject = {
          id: Date.now(),
          name: projectName,
          lastEdited: new Date().toLocaleDateString(),
        };
        addProject(newProject);
        setProjectName('');
        setErrorMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Nuevo Diseño</h2>
      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
      <input
        type="text"
        placeholder="Nombre del Proyecto"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="bg-neutral-700 p-2 rounded-md mb-4 w-full text-white"
      />
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Agregar Proyecto
        </button>
        <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NewDesignForm;
