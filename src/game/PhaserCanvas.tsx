import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

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

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {

            game.current = StartGame("canva-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() => {

        const handleCanvasResize = () => {
            if (game.current)
            {
                const gameContainer = document.getElementById('app');
                if (gameContainer)
                {
                    game.current.canvas.width = gameContainer.clientWidth;
                    game.current.canvas.height = gameContainer.clientHeight;
                    game.current.scale.resize(gameContainer.clientWidth, gameContainer.clientHeight); // Access the 'scale' property on the 'game.current' ref
                }
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
        
        window.addEventListener('resize', handleCanvasResize);

        // Add event listener to a parent element that exists when the component mounts
        document.addEventListener('click', handleComponentButtonClick);
        

        return () => {
            document.removeEventListener('click', handleComponentButtonClick);
            window.removeEventListener('resize', handleCanvasResize);
        };
        
    }, []);

    return (
        <div id='canva-container' className='relative flex-grow overflow-auto'>
            <div id='properties-panel' className='absolute hidden' style={{
            display: 'block',
            width: '1125px',
            height: '851px',
            padding: '0px',
            marginRight: '0px', // Note: camelCase for CSS properties in JSX
            marginBottom: '0px', // Note: camelCase for CSS properties in JSX
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none', // Note: camelCase for CSS properties in JSX
            transform: 'scale(1, 1)',
            transformOrigin: 'left top' // Note: camelCase for CSS properties in JSX
        }}>
            <input type='button' id='pc-btton' value='PC'/>
        </div>
            {/**<div id='toolbox' className=''>
                <ToolbarDemo/>
            </div>
            <div id='properties-panel' className='absolute hidden'>
            <TabsDemo/>
            </div>
            **/}
        </div>
    );

});


