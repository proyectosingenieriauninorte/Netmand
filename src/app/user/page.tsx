'use client';
import { useEffect, useState } from 'react';
import styles from '../app.module.css';
import { fetchUserProjects, removeProject } from '@/requests/requests';
import TabsDemo from './avatar/avatar';
import DialogDemo from './projectCard/card'; // Update the import

interface Project {
  id: number;
  name: string;
  lastUpdated: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = () => {
    fetchUserProjects()
      .then(projects => {
        setProjects(projects);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectName: string) => {
    try {
      await removeProject(projectName);
      // Update the projects state after deletion
      const updatedProjects = projects.filter(project => project.name !== projectName);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  const openProject = (projectName: string) => {
    // Redirect to project page with the project name as a query parameter
    window.location.href = `/project?name=${encodeURIComponent(projectName)}&update=${Date.now()}`;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row md:items-center">
      <header className="border-b border-gray-200 py-4 px-8 flex justify-between items-center fixed top-0 w-full z-10">
        <div className="flex items-center">
          <div className={styles.logo}></div>
          <h1 className="ml-2 text-xl font-bold text-white">NETMAND</h1>
        </div>
        <div className="flex items-center">
          <DialogDemo onProjectAdded={fetchProjects} /> {/* Pass the fetchProjects function */}
        </div>
      </header>

      <div className="flex flex-col items-center justify-center text-center mt-8 md:mt-0 md:w-[24%] border border-gray-300 rounded p-8">
        <TabsDemo />
      </div>

      <div className="justify-center ml-[10%] mb-8 md:mt-[10%] w-full md:w-[130vh] h-[75vh] bg-gray-700 p-8 text-white border-2 overflow-y-auto">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-400 mt-2">Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}</p>
              <button onClick={() => openProject(project.name)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Open Project
              </button>
              <button className="ml-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => handleDelete(project.name)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
