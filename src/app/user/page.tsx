'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import UserInfo from './UserInfo';
import DesignsList from './DesignsList';
import NewDesignForm from './NewDesignForm';
import ConfirmationDialog from './ConfirmationDialog';
import projectsData from '../utils/projectsData';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [showNewDesignForm, setShowNewDesignForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    setProjects(projectsData);
  }, []);

  const addProject = (newProject) => {
    setProjects([...projects, newProject]);
    setShowNewDesignForm(false);
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    setProjects(updatedProjects);
  };

  const handleCancelNewProject = () => {
    setShowNewDesignForm(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleCancelLogout = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col">
      <Head>
        <title>Netmand</title>
        <meta name="description" content="Tu descripción aquí" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header setShowNewDesignForm={setShowNewDesignForm} />

      <div className="flex-grow flex justify-between container mx-auto py-8 px-4 overflow-hidden">
        <div className="w-1/4 flex flex-col justify-between">
          <UserInfo userName={userName} handleLogout={handleConfirmLogout} />
        </div>
        <div className="w-2/3 flex flex-col overflow-hidden">
          {showNewDesignForm ? (
            <NewDesignForm addProject={addProject} projects={projects} onCancel={handleCancelNewProject} />
          ) : (
            <div className="flex-grow h-0 overflow-auto">
              <DesignsList projects={projects} deleteProject={deleteProject} />
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
