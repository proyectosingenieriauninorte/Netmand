'use client';
import dynamic from 'next/dynamic';
import { EventBus } from '@/canvas/EventBus';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });


export default function project() {

    const exportProject = () => {
        console.log('exporting project');

        EventBus.emit('exportProject');

        EventBus.once('exportedProject', (project: any) => {
            console.log(project);
        });
    }

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
                    <button className='button' onClick={exportProject}>export</button>
                    </u>
                </nav>
            </div>

            <div className='container2'>
                <AppWithoutSSR />
            </div>

        </main>
    );
}