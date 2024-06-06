'use client';
import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
import { NetworkData } from '@/canvas/scenes/canva';

const AppWithoutSSR = dynamic(() => import('./App'), { ssr: false });
const EventBus = typeof window !== 'undefined' ? require('@/canvas/EventBus').EventBus : null;

export default function Project() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportProject = () => {
        console.log('exporting project');
        EventBus.emit('exportProject');
    };

    const importProject = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const checkProjectEmpty = () => {
        return new Promise<boolean>((resolve) => {
            const handler = (isEmpty: boolean) => {
                resolve(isEmpty);
                EventBus.off('projectEmptyCheckResult', handler); // Clean up the listener
            };
            EventBus.on('projectEmptyCheckResult', handler);
            EventBus.emit('checkProjectEmpty');
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const fileContent = await file.text();
                const jsonData = JSON.parse(fileContent);
                console.log('File content', jsonData);
                console.log('Validating file structure', validateNetworkData(jsonData));

                // Validate the JSON structure
                if (validateNetworkData(jsonData)) {
                    // Check if the current project on the canvas is empty
                    const isEmpty = await checkProjectEmpty();
                    console.log('Project empty check result', isEmpty);
                    if (isEmpty) {
                        EventBus.emit('importProject', jsonData);
                        EventBus.emit('showAlert', 'Project imported successfully');
                    } else {
                        EventBus.emit('showImportAlert', jsonData);
                    }
                } else {
                    console.error('Invalid file structure');
                    EventBus.emit('showAlert', 'Invalid file structure. Please provide a valid project file.');
                }
            } catch (error) {
                console.error('Error reading file', error);
                EventBus.emit('showAlert', 'Error reading file. Please try again.');
            }
        }
    };

    const validateNetworkData = (data: any): data is NetworkData => {
        return (
            Array.isArray(data.pcs) &&
            Array.isArray(data.switches) &&
            Array.isArray(data.routers) &&
            Array.isArray(data.cables) &&
            Array.isArray(data.vlans)
        );
    };

    useEffect(() => {
        EventBus.on('exportedProject', handleExportedProject);
        return () => {
            EventBus.off('exportedProject', handleExportedProject);
        };
    }, []);

    const handleExportedProject = async (project: any) => {
        const json = JSON.stringify(project, null, 2);
        const blob = new Blob([json], { type: 'application/json' });

        const initiateDownload = () => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'project.json';
            link.click();
            URL.revokeObjectURL(url);
        };

        if ('showSaveFilePicker' in window) {
            try {
                const options = {
                    suggestedName: 'project.json',
                    types: [
                        {
                            description: 'JSON Files',
                            accept: { 'application/json': ['.json'] },
                        },
                    ],
                };
                // @ts-ignore
                const fileHandle = await window.showSaveFilePicker(options);
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();

                // Also initiate a download
                initiateDownload();
            } catch (error) {
                console.error('Error saving file', error);
                // Fall back to just initiating a download if there's an error
                initiateDownload();
            }
        } else {
            // Fallback for browsers without the File System Access API
            initiateDownload();
        }
    };

    return (
        <main className="h-screen flex flex-col">
            <div className="container">
                <nav>
                    <div className='flex items-center'>
                        <div className='logo' />
                        <span className='span-logo'>Netmand</span>
                    </div>
                    <u>
                        <button className='button' onClick={importProject}>import</button>
                        <button className='button' onClick={exportProject}>export</button>
                    </u>
                </nav>
            </div>

            <div className='container2'>
                <AppWithoutSSR />
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </main>
    );
}
