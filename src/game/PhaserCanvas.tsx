import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

import PcPortMenu from './primitives/contextMenu/pcPortsMenu';
import SwitchPortMenu from './primitives/contextMenu/switchPortsMenu';



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
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [dropdownSize, setDropdownSize] = useState({ width: 0, height: 0 });
    const [switchPortsVisible, setSwitchPortsVisible] = useState(false);
    const [pcPortsVisible, setPcPortsVisible] = useState(false);
    const [triggerRightClick, setTriggerRightClick] = useState(false);

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

    const handleDisplayPorts = (x: number, y: number, width: number, height: number, type: string) => {
        if (type === 'Switch') {
            setSwitchPortsVisible(true);
            setPcPortsVisible(false);
        } else if (type === 'Pc'){
            setPcPortsVisible(true);
            setSwitchPortsVisible(false);
        }
        setDropdownPosition({ x, y });

        

        console.log(x, y);

        setDropdownSize({ width, height });
        setTriggerRightClick(true); // Trigger the right-click event in the useEffect
    };

    useEffect(() => {


        EventBus.on('cancelDisplayPorts' , () => {
            console.log('cancelDisplayPorts');
            setPcPortsVisible(false);
            setSwitchPortsVisible(false);
        } );

        EventBus.on('displayPorts', handleDisplayPorts);
        
        window.addEventListener('resize', handleCanvasResize);
        window.addEventListener('resize', handlePropertiesPanelResize);
        document.addEventListener('click', handleComponentButtonClick);

        handleCanvasResize();
        handlePropertiesPanelResize();
        
        return () => {
            EventBus.off('displayPcPorts', handleDisplayPorts);
            document.removeEventListener('click', handleComponentButtonClick);
            window.removeEventListener('resize', handleCanvasResize);
        };
        
    }, []);

    useEffect(() => {
        if (triggerRightClick) {
            // Ensure the element is present in the DOM
            const contextMenuTrigger = document.querySelector('.ContextMenuTrigger') as HTMLElement;
            if (contextMenuTrigger) {
                contextMenuTrigger.style.width = `${dropdownSize.width}px`;
                contextMenuTrigger.style.height = `${dropdownSize.height}px`;
                const event = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: dropdownPosition.x + 450,
                    clientY: dropdownPosition.y,
                    button: 2 // Right mouse button
                });
                contextMenuTrigger.dispatchEvent(event);
            }
            setTriggerRightClick(false); // Reset the trigger
        }
    }, [triggerRightClick, dropdownPosition]);

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
            {pcPortsVisible && <PcPortMenu style={{
                pointerEvents: 'auto',
                position: 'absolute',
                left: dropdownPosition.x,
                top: dropdownPosition.y,
                width: dropdownSize.width,
                height: dropdownSize.height
            }} />}
            {switchPortsVisible && <SwitchPortMenu style={{
                pointerEvents: 'auto',
                position: 'absolute',
                left: dropdownPosition.x,
                top: dropdownPosition.y,
                width: dropdownSize.width,
                height: dropdownSize.height
            }} />}
        </div>
        </div>
    );
});


