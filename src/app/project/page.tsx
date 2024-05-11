'use client';
import dynamic from 'next/dynamic';
import styles from './project.module.css';
import { useState } from 'react';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });

export default function project() {

    const [showPcOptions, setShowPCOptions] = useState(false);
    const [showSwitchOptions, setShowSwitchOptions] = useState(false);

    // ***** PC OPTIONS *****
    const toggleComputerOptions = () => {
        setShowPCOptions(!showPcOptions);
    };

    const toggleSwitchOptions = () => {
        setShowSwitchOptions(!showSwitchOptions);
    };


    return (
        <main className="h-screen flex flex-col">
            <nav className="border-2 border-[#525362] p-0.5 rounded-xl mx-3 mt-3">
                <div className="flex">
                {/* PROYECTO, EDITAR, GUARDAR, SIMULAR */}
                    <button className="mr-5 text-[#DAD4D4] mx-3">Mis Proyectos</button>
                    <button className="mr-5 text-[#DAD4D4] ">Guardar</button>
                    <button className="mr-5 text-[#DAD4D4] ">Simular</button>

                    {/* PROJECT NAME */}
                    <input type="text" className="text-white flex-grow text-center font-bold 
                                    bg-transparent border-none outline-none text-[#DAD4D4] placeholder-[#C5C5C5] " placeholder="Nombre del Proyecto"/>
                    {/* APP NAME */}
                    <span className="text-[#DC6614] "></span>
                </div>
            </nav>

            <div className={`${styles.scrollbar} overflow-y-auto`}>

            </div>
            <div className="flex flex-grow overflow-hidden mb-3">
                <div className={`${styles.scrollbar} overflow-y-auto w-1/6`}>
                    {/* TOOLS */}
                    <div id="tools" className="bg-[#030611] rounded-xl mt-3 ml-3 h-full">
                        {/*************************************************************
                                                    COMPONENTS                      
                        *************************************************************/}
                        <div id='components' className='rounded-xl flex-row'>
                            <span className="text-[#C8C8C8] text-base font-bold">Componentes</span>
                            {/* OPTIONS */}
                            <div className={`${styles.common} h-[17vh]`}>
                                <div className={`${styles.scrollbar} ml-3 overflow-y-auto`}>
                                    {/* Computer */}
                                    <button id='pc' className={styles.button} onClick={toggleComputerOptions}>Computadores</button>
                                    {showPcOptions && (
                                    <div className="rounded-xl flex flex-col items-center w-full">
                                        <button id='pc-btton' className={styles.option}>PC</button>{/* Add more options as needed */}
                                    </div>
                                    )}

                                    <button className={styles.button} onClick={toggleSwitchOptions}>Switches</button>
                                    {showSwitchOptions && (
                                    <div className="rounded-xl flex flex-col items-center w-full">
                                        <button id='switch-btton' className={styles.option}>PC</button>{/* Add more options as needed */}
                                    </div>
                                    )}
                                    <button className={styles.button}>Routers</button>
                                    <button className={`${styles.button} mb-3`}>Cables</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-grow overflow-hidden rounded-xl mt-3 ml-3 mr-3">
                    <AppWithoutSSR/>
                </div>
            </div>
        </main>
    );
}