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
                    <div id="tools" className="bg-[#030611] rounded-xl mt-3 ml-3">
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

                        {/*************************************************************
                                                    NETS                     
                        *************************************************************/}
                        <div id='net' className='rounded-xl flex-row mt-2'>
                            
                            <span className="text-[#C8C8C8] text-base font-bold">Redes</span>
                            {/* HEADER */}
                            <div className={`${styles.common} h-[18vh]`}>
                                <div className='flex w-full'>
                                        <div className='w-full'>
                                            <span className='ml-3 text-xs text-[#C5C5C5] font-bold'>Agregar red</span>
                                        </div>
                                        <div>
                                        <button className={`${styles.add} ${styles.zoomImage}`} onClick={handleAddNetwork}></button>
                                        </div>
                                </div>
                                
                                {/* ADD NET */}
                                {showInput && (
                                <div className="mt-2 flex-row justify-center w-full">
                                    <div className="flex mt-2 justify-center">
                                        <input
                                            type="text"
                                            value={network}
                                            onChange={handleInputNetworkChange}
                                            placeholder="Ingrese la red"
                                            className="bg-[#1F1F1F] text-[#C5C5C5] border-b border-[#1F1F1F] text-sm px-4 py-2 outline-none rounded-lg focus:border-bg-[#cacaca]"
                                            />
                                    </div>
                                    <div className="flex mt-2 justify-center">
                                        <button onClick={handleSaveNetwork} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                                            Guardar
                                        </button>
                                        <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 text-xs hover:bg-red-600 focus:outline-none focus:bg-red-600">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                                )}
                                {/* ADDED NETS */}
                                <div className={`${styles.scrollbar} overflow-y-auto w-full `}>
                                    {!showInput && networks.map((networkItem, index) => (     
                                    <div key={index} className={styles.netvlanoption}>     
                                        <div className={`${styles.neticon} ml-2`}></div>
                                        <span className='w-full text-xs'>{networkItem}</span>                                        
                                        <button className={`${styles.deleteicon} w-full`} onClick={() => handleDelete(index)}></button>
                                    </div>
                                    ))}
                                </div>              
                            </div>
                        </div>


                        {/*************************************************************
                                                    VLANS                      
                        *************************************************************/}
                        <div id='net' className='rounded-xl flex-row mt-2'>
                            
                            <span className="text-[#C8C8C8] text-base font-bold">Vlan</span>
                            {/* HEADER */}
                            <div className={`${styles.common} h-[18vh]`}>
                                <div className='flex w-full'>
                                        <div className='w-full'>
                                            <span className='ml-3 text-xs text-[#C5C5C5] font-bold'>Agregar vlan</span>
                                        </div>
                                        <div>
                                        <button className={`${styles.add} ${styles.zoomImage}`} onClick={handleAddVlan}></button>
                                        </div>
                                </div>
                                
                                {/* ADD VLAN */}
                                {showVlanInput && (
                                <div className="mt-2 flex-row justify-center w-full">
                                    <div className="flex mt-2 justify-center">
                                        <input
                                            type="text"
                                            value={vlan}
                                            onChange={handleInputVlanChange}
                                            placeholder="Ingrese la vlan"
                                            className="bg-[#1F1F1F] text-[#C5C5C5] border-b border-[#1F1F1F] text-sm px-4 py-2 outline-none rounded-lg focus:border-bg-[#cacaca]"
                                            />
                                    </div>
                                    <div className="flex mt-2 justify-center">
                                        <button onClick={handleSaveVlan} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                                            Guardar
                                        </button>
                                        <button onClick={handleVlanCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2 text-xs hover:bg-red-600 focus:outline-none focus:bg-red-600">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                                )}
                                {/* ADDED VLANS */}
                                <div className={`${styles.scrollbar} overflow-y-auto w-full `}>
                                    {!showVlanInput && vlans.map((vlanItem, index) => (     
                                    <div key={index} className={styles.netvlanoption}>     
                                        <div className={`${styles.neticon} ml-2`}></div>
                                        <span className='w-full text-xs'>{vlanItem}</span>                                        
                                        <button className={`${styles.deleteicon} w-full`} onClick={() => handlVlanDelete(index)}></button>
                                    </div>
                                    ))}
                                </div>              
                            </div>
                        </div>

                        {/*************************************************************
                                                    PDU                    
                        *************************************************************/}
                        <div id='pdu' className='rounded-xl flex-row mt-2'>
                            <span className="text-[#C8C8C8] text-base font-bold">PDU</span>
                            {/* OPTIONS */}
                            <div className={`${styles.common} h-[13vh]`}>
                                <div className='flex w-full'>
                                            <div className='w-full'>
                                                <span className='ml-3 text-xs text-[#C5C5C5] font-bold'>Agregar redes</span>
                                            </div>
                                            <div>
                                            <button className={`${styles.add} ${styles.zoomImage}`} onClick={handleAddNetwork}></button>
                                            </div>
                                </div>
                            </div>
                        </div>


                        {/* ZOOM */}
                        <div id='zoom' className='mt-2 rounded-xl h-[9vh] '>
                            { /* ZOOM iIMAGES*/} 
                            <div className='flex'>
                                    <div className='w-full'>
                                        <div className={`${styles.zoomout} ${styles.zoomImage}`} />
                                    </div>
                                    <div>
                                        <div className={`${styles.zoomin} ${styles.zoomImage}`} />
                                    </div>
                            </div>
                            { /* ZOOM SLIDER*/}
                            <input className={styles.slider} type="range" min="1" max="100" id="myRange" />
                            { /* ZOOM BUTTONS*/}
                            <div className='flex items-center'>
                                <button className={styles.zoonbutton}>X1/2</button>
                                <button className={styles.zoonbutton}>X1</button>
                                <button className={styles.zoonbutton}>X2</button>
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