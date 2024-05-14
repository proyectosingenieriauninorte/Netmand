import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

import ContextMenuDemo from './primitives/contextMenu/contextMenu';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    
    useLayoutEffect(() =>
    {
        if (game.current === null)
        {
            game.current = StartGame("canva-container");
            if (typeof ref === 'function'){
                ref({ game: game.current, scene: null });
            } else if (ref){
                ref.current = { game: game.current, scene: null };
            }
        }

        return () =>{
            if (game.current){
                game.current.destroy(true);
                if (game.current !== null){
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() => {

        const handleCanvasResize = () => {
            if (game.current){
                const canvasContainer = document.getElementById('app');
                if (canvasContainer) {
                    game.current.canvas.width = canvasContainer.clientWidth;
                    game.current.canvas.height = canvasContainer.clientHeight;
                    game.current.scale.resize(canvasContainer.clientWidth, canvasContainer.clientHeight); // Access the 'scale' property on the 'game.current' ref
                }
            }
        }

        const handlePropertiesPanelResize = () => {

            const propertiesPanel = document.getElementById('properties-panel');
            const canvasContainer = document.getElementById('app');

            if (propertiesPanel && canvasContainer){
                propertiesPanel.style.width = canvasContainer.clientWidth + 'px';
                propertiesPanel.style.height = canvasContainer.clientHeight + 'px';
            }
        }

        const handleComponentButtonClick = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.id === 'pc-btton') {
                EventBus.emit('addPc');
            }
            if (target.id === 'switch-btton') {
                EventBus.emit('addSwitch');
            }
            if (target.id === 'cable-btton') {
                EventBus.emit('addCable');
            }
            if (target.id === 'router-btton') {
                EventBus.emit('addRouter');
            }
        };

        const handleDisplayDropdown = (x: number, y: number, width: number, height: number) => {
            setDropdownPosition({ x, y });
            setDropdownVisible(true);
            const contextMenuTrigger = document.querySelector('.ContextMenuTrigger') as HTMLElement;
            if (contextMenuTrigger) {
                contextMenuTrigger.style.width = width + 'px';
                contextMenuTrigger.style.height = height + 'px';
            }
        };

        EventBus.on('displayDropDown', handleDisplayDropdown);
        
        window.addEventListener('resize', handleCanvasResize);
        window.addEventListener('resize', handlePropertiesPanelResize);

        // Add event listener to a parent element that exists when the component mounts
        document.addEventListener('click', handleComponentButtonClick);

        handleCanvasResize();
        handlePropertiesPanelResize();
        

        return () => {
            EventBus.off('displayDropDown', handleDisplayDropdown);
            document.removeEventListener('click', handleComponentButtonClick);
            window.removeEventListener('resize', handleCanvasResize);
        };
        
    }, []);

    return (
        <div id='canva-container' className='relative flex-grow overflow-auto'>
            <div id='properties-panel' className='absolute hidden' style={{
            display: 'block',
            padding: '0px',
            marginRight: '0px', 
            marginBottom: '0px', 
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none', 
            transform: 'scale(1, 1)',
            transformOrigin: 'left top' 
        }}>
            {isDropdownVisible && <ContextMenuDemo style={{
                pointerEvents: 'auto',
                position: 'absolute',
                left: dropdownPosition.x,
                top: dropdownPosition.y
            }} />}
        </div>
            {/**
             *<div id='properties-panel' className='absolute hidden' style={{
            display: 'block',
            padding: '0px',
            marginRight: '0px', 
            marginBottom: '0px', 
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none', 
            transform: 'scale(1, 1)',
            transformOrigin: 'left top' 
        }}>
            {isDropdownVisible && <DropdownMenuDemo />}
        </div>
            **/}
        </div>
    );
});


