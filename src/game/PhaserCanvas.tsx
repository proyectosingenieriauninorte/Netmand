import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import PcPortMenu from './primitives/contextMenu/pcPortsMenu';
import SwitchPortMenu from './primitives/contextMenu/switchPortsMenu';
import RouterPortMenu from './primitives/contextMenu/routerPortsMenu';
import { createRoot, Root } from 'react-dom/client';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [dropdownSize, setDropdownSize] = useState({ width: 0, height: 0 });
    const [panelContent, setPanelContent] = useState<React.ReactNode>(null);
    const propertiesPanelRootRef = useRef<Root | null>(null);
    const [triggerRightClick, setTriggerRightClick] = useState(false);

    const handleCanvasResize = () => {
        if (game.current) {
            const canvasContainer = document.getElementById('app');
            if (canvasContainer) {
                game.current.canvas.width = canvasContainer.clientWidth;
                game.current.canvas.height = canvasContainer.clientHeight;
                game.current.scale.resize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            }
        }
    };

    const handlePropertiesPanelResize = () => {
        const propertiesPanel = document.getElementById('properties-panel');
        const canvasContainer = document.getElementById('app');

        if (propertiesPanel && canvasContainer) {
            propertiesPanel.style.width = canvasContainer.clientWidth + 'px';
            propertiesPanel.style.height = canvasContainer.clientHeight + 'px';
        }
    };

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

    const handleDisplayPorts = (data: { x: number, y: number, width: number, height: number, type: string }) => {
        const { x, y, width, height, type } = data;
        setDropdownPosition({ x, y });
        setDropdownSize({ width, height });
    
        if (type === 'Switch') {
            setPanelContent(<SwitchPortMenu style={{ left: x, top: y, width, height, pointerEvents: 'auto', position: 'absolute' }} />);
        } else if (type === 'Pc') {
            setPanelContent(<PcPortMenu style={{ left: x, top: y, width, height, pointerEvents: 'auto', position: 'absolute' }} />);
        } else if (type === 'Router') {
            setPanelContent(<RouterPortMenu style={{ left: x, top: y, width, height, pointerEvents: 'auto', position: 'absolute' }} />);
        }

        setTriggerRightClick(true);
    };

    useEffect(() => {
        if (triggerRightClick) {
            const handleMouseMove = (event: { clientX: any; clientY: any; }) => {
                const mouseX = event.clientX;
                const mouseY = event.clientY;
    
                const contextMenuTrigger = document.querySelector('.ContextMenuTrigger') as HTMLElement;
    
                if (contextMenuTrigger) {
                    const contextMenuEvent = new MouseEvent('contextmenu', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: mouseX,
                        clientY: mouseY,
                        button: 2
                    });
                    contextMenuTrigger.dispatchEvent(contextMenuEvent);
                }
    
                setTriggerRightClick(false);
            };
    
            document.addEventListener('mousemove', handleMouseMove);
    
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [triggerRightClick]);

    useEffect(() => {
        EventBus.on('cancelDisplayPorts', () => {
            console.log('cancelDisplayPorts');
            const contextMenuContent = document.querySelector('.ContextMenuTrigger') as HTMLElement;
            if (contextMenuContent) {
                contextMenuContent.style.display = 'none';
            }
        });

        EventBus.on('displayPorts', handleDisplayPorts);

        window.addEventListener('resize', handleCanvasResize);
        window.addEventListener('resize', handlePropertiesPanelResize);
        document.addEventListener('click', handleComponentButtonClick);

        handleCanvasResize();
        handlePropertiesPanelResize();

        return () => {
            EventBus.off('displayPorts', handleDisplayPorts);
            document.removeEventListener('click', handleComponentButtonClick);
            window.removeEventListener('resize', handleCanvasResize);
        };
    }, []);

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = StartGame("canva-container");
            if (typeof ref === 'function') {
                ref({ game: game.current, scene: null });
            } else if (ref) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = null;
            }
        };
    }, [ref]);

    useEffect(() => {
        const domElement = document.getElementById('properties-panel');
        if (domElement && !propertiesPanelRootRef.current) {
            propertiesPanelRootRef.current = createRoot(domElement);
        }
    }, []);

    useEffect(() => {
        if (propertiesPanelRootRef.current && panelContent) {
            propertiesPanelRootRef.current.render(panelContent);
        }
    }, [panelContent]);

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
            }} />
        </div>
    );
});
