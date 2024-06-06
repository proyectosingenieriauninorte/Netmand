import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import { AlertDemo } from './primitives/messageDialog/messageDialog';
import PropertiesMenu from './primitives/propertiesMenu/propertiesMenu';
import {AlertDialogDemo} from './primitives/alertDialog/alertDialog';
import PcPortMenu from './primitives/contextMenu/pcPortsMenu';
import SwitchPortMenu from './primitives/contextMenu/switchPortsMenu';
import RouterPortMenu from './primitives/contextMenu/routerPortsMenu';
import PcProperties from './primitives/componentProperties/pcMenuProp';
import ToolbarDemo from './primitives/toolbar/toolbar';
import ImportAlert from './primitives/alertDialog/ImporAlert';
import { SheetSide } from './primitives/sheet/sheet';

import SwitchSettings from './primitives/componentProperties/switch/switchSettings';
import RouterSettings from './primitives/componentProperties/router/routerSettings';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for alert message

    const handleCanvasResize = () => {
        if (game.current) {
            const canvasContainer = document.getElementById('app');
            if (canvasContainer) {
                game.current.canvas.width = canvasContainer.clientWidth;
                game.current.canvas.height = canvasContainer.clientHeight;
                game.current.scale.resize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            }
        }
        EventBus.emit('resizeCanvas');
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
        
        switch(target.id) {
            case 'pc-btton':
                EventBus.emit('addPc');
                break;
            case 'switch-btton':
                EventBus.emit('addSwitch');
                break;
            case 'cable-btton':
                EventBus.emit('addCable');
                break;
            case 'router-btton':
                EventBus.emit('addRouter');
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        EventBus.on('showAlert', (message: string) => {
            setAlertMessage(message);
        });

        EventBus.on('hideAlert', () => {
            setAlertMessage(null);
        });

        window.addEventListener('resize', handleCanvasResize);
        window.addEventListener('resize', handlePropertiesPanelResize);
        document.addEventListener('click', handleComponentButtonClick);

        handleCanvasResize();
        handlePropertiesPanelResize();

        return () => {
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
            }} >
                {<AlertDemo message={alertMessage} />} {/* Conditionally render AlertDemo */}
                {<PropertiesMenu style={{ position: 'absolute', top: '0px', left: '0px', pointerEvents: 'auto'}} />} 
                {<AlertDialogDemo style={{ position: 'absolute', pointerEvents: 'auto'}} />} {/* Conditionally render AlertDialogDemo */}
                {<PcPortMenu style={{ position: 'absolute', top: '0px', left: '0px', pointerEvents: 'auto'}} />}{/* Conditionally render PcPortMenu */}
                {<SwitchPortMenu style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render SwitchPortMenu */}
                {<RouterPortMenu style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render RouterPortMenu */}
                {<PcProperties style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render PcProperties */}
                {<SwitchSettings style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render SwitchSettings */}
                {<RouterSettings style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render RouterProperties */}
                {<ToolbarDemo style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render ToolbarDemo */}
                {<SheetSide style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render SheetSide */}
                {<ImportAlert style={{ position: 'absolute', pointerEvents: 'auto'}} />}{/* Conditionally render ImportAlert */}
            </div>
        </div>
    );
});

