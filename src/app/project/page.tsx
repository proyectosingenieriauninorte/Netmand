'use client';
import dynamic from 'next/dynamic';
import styles from './project.module.css';
import { useState } from 'react';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });

export default function project() {

    const [showOptions, setShowOptions] = useState(false);

    // ***** PC OPTIONS *****
    const toggleComputerOptions = () => {
        setShowOptions(!showOptions);
    };

    // ***** NETWORK *****
    const [showInput, setShowInput] = useState(false);
    const [networks, setNetworks] = useState<string[]>([]);
    const [network, setNetwork,] = useState('');

    const handleAddNetwork = () => {
        setShowInput(true);
    };

    const handleInputNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNetwork(e.target.value);
    };

    const handleSaveNetwork = () => {
        if (!isValidNetwork(network)) {
            alert('La red no es válida');
            return;
        }
        setNetworks([...networks, network]);
        setNetwork('');
        setShowInput(false);
    };

    const handleCancel = () => {
        setShowInput(false);
    };

    const handleDelete = (index: integer) => {
        const updatedNetworks = [...networks];
        updatedNetworks.splice(index, 1);
        setNetworks(updatedNetworks);
    };

    const isValidNetwork = (network: string) => {
        // Expresión regular para validar redes con máscaras 8/16/24
        const regex = /^(?:25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.0(?:\/(?:8|16|24))?$/;
    
        return regex.test(network);
    };

    // ***** VLAN *****

    const [showVlanInput, setShowVlanInput] = useState(false);
    const [vlans, setVlans] = useState<string[]>([]);
    const [vlan, setVlan,] = useState('');

    const handleAddVlan = () => {
        setShowVlanInput(true);
    };

    const handleInputVlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVlan(e.target.value);
    };

    const handleSaveVlan = () => {
        setVlans([...vlans, vlan]);
        setVlan('');
        setShowVlanInput(false);
    };

    const handleVlanCancel = () => {
        setShowVlanInput(false);
    };

    const handlVlanDelete = (index: integer) => {
        const updatedVlan = [...vlans];
        updatedVlan.splice(index, 1);
        setVlans(updatedVlan);
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
                                    {showOptions && (
                                    <div className="rounded-xl flex flex-col items-center w-full">
                                        <button id='pc-btton' className={styles.option}>PC</button>{/* Add more options as needed */}
                                    </div>
                                    )}

                                    <button className={styles.button}>Switches</button>
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