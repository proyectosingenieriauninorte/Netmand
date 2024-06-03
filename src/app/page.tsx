'use client';
import dynamic from 'next/dynamic';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });

export default function project() {

    return (
        <main className="h-screen flex flex-col">

            <div className="container">
                <nav>
                    <div className='flex items-center'>
                        <div className='logo' />
                        <span className='span-logo'>Netmand</span>
                    </div>
                    
                    <u>
                    <button className='button'>import</button>
                    <button className='button'>export</button>
                    </u>
                </nav>
            </div>

            <div className='container2'>
                <AppWithoutSSR />
            </div>

        </main>
    );
}