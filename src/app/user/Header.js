import React from 'react';
import styles from '../app.module.css'
const Header = ({ setShowNewDesignForm }) => {
  return (
    <header className=" text-slate-400 py-4 px-8 flex justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <div className={styles.logo}></div>
        <h1 className="text-3xl md:text-4xl text-slate-300 ml-4">NETMAND</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <button onClick={() => setShowNewDesignForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Nuevo diseño
            </button>
          </li>
          <li>
            <button onClick={() => alert('Implementa la lógica de importación aquí')} className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-800">
              Importar
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
