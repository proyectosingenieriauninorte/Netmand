'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import styles from '../app.module.css';
import { getUserInfo, updateUserName, getProjects, createProject, Project } from '@/requests/requests';

export default function Home() {
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [errorSaving, setErrorSaving] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo();
    fetchProjects();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userData = await getUserInfo();
      setUserName(userData.username);
      console.log(setUserName)
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      setIsLoading(false);
    }
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUserName(event.target.value);
  };

  const handleSaveName = async () => {
    try {
      await updateUserName(userId, newUserName);
      setIsEditingName(false);
      setUserName(newUserName);
      setErrorSaving(null);
    } catch (error) {
      setErrorSaving('Hubo un error al guardar el nombre. Por favor, inténtalo de nuevo.');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setProjectError('El nombre del proyecto no puede estar vacío.');
      return;
    }

    if (projects.some(project => project.name === newProjectName)) {
      setProjectError('Ya existe un proyecto con ese nombre.');
      return;
    }

    try {
      const newProject = await createProject(newProjectName);
      setProjects([...projects, newProject]);
      setIsCreatingProject(false);
      setNewProjectName('');
      setProjectError(null);
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
      setProjectError('Hubo un error al crear el proyecto. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row md:items-center">
      <header className="border-b border-gray-200 py-4 px-8 flex justify-between items-center fixed top-0 w-full z-10">
        <div className="flex items-center">
          <div className={styles.logo}></div>
          <h1 className="ml-2 text-xl font-bold">NETMAND</h1>
        </div>
        <div className="flex items-center">
          <button
            className="mr-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            onClick={() => setIsCreatingProject(true)}
          >
            Nuevo Proyecto
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">Exportar</button>
        </div>
      </header>

      <div className="ml-[2%] flex flex-col items-center justify-center text-center mt-8 md:mt-0 md:w-[20%] border border-gray-300 rounded p-8">
        <h2 className="text-xl font-bold mb-4">Información del Usuario</h2>
        <div className="flex flex-col items-center space-y-16">
          <div className="w-24 h-24 bg-gray-600 rounded-full overflow-hidden">
            <img alt="Usuario" className="w-full h-full object-cover cursor-pointer" />
          </div>
          <div className="flex flex-col items-center">
            {isEditingName ? (
              <input
                type="text"
                value={newUserName}
                onChange={handleChangeName}
                className="border border-gray-300 px-2 py-1 rounded-md"
                placeholder="Nuevo Nombre"
              />
            ) : (
              <p className="font-semibold">{userName}</p>
            )}
            {isEditingName ? (
              <button
                onClick={handleSaveName}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Guardar
              </button>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Editar Nombre
              </button>
            )}
          </div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Cerrar Sesión</button>
        </div>
      </div>

      <div className="justify-center ml-[10%] mb-8 md:mt-[10%] w-full md:w-[130vh] h-[75vh] bg-gray-700 p-8 text-white border-2 overflow-y-auto">
        {isLoading ? (
          <p>Cargando proyectos...</p>
        ) : (
          <>
            {projects.map(project => (
              <div key={project.id} className="mb-4">
                <h3 className="text-xl font-bold">{project.name}</h3>
                {/* Otros detalles del proyecto */}
              </div>
            ))}
            {projects.length === 0 && <p>No hay proyectos disponibles.</p>}
          </>
        )}
      </div>

      {isCreatingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-900 p-8 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Nuevo Proyecto</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded-md mb-4 bg-black text-white"
              placeholder="Nombre del Proyecto"
            />
            {projectError && <p className="text-red-500 mb-4">{projectError}</p>}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsCreatingProject(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
