'use client';
import dynamic from 'next/dynamic';
import styles from './project.module.css';
import { useState } from 'react';
import { SheetSide } from '../../canvas/primitives/sheet/sheet';
import MenubarDemo from './menu/menu';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });

export default function project() {

    const [showPcOptions, setShowPCOptions] = useState(false);
    const [showSwitchOptions, setShowSwitchOptions] = useState(false);
    const [showCableOptions, setShowCableOptions] = useState(false);
    const [showRouterOptions, setShowRouterOptions] = useState(false);

    // ***** PC OPTIONS *****
    const toggleComputerOptions = () => {
        setShowPCOptions(!showPcOptions);
    };

    const toggleSwitchOptions = () => {
        setShowSwitchOptions(!showSwitchOptions);
    };

    const toggleCableOptions = () => {
        setShowCableOptions(!showCableOptions);
    };

    const toggleRouterOptions = () => {
        setShowRouterOptions(!showRouterOptions);
    };


    return (
        <main className="h-screen flex flex-col">

            <nav className=" p-0.5 rounded-xl mx-3 mt-3">
            <MenubarDemo/>
            </nav>

            <div className={`${styles.scrollbar} overflow-y-auto`}>

            </div>
            <div className="flex flex-grow overflow-hidden mb-3">

                <div className="flex flex-grow overflow-hidden rounded-xl mt-3 ml-3 mr-3">
                    <AppWithoutSSR/>
                </div>
            </div>
        </main>
    );
}