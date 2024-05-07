import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

const isSSR = () => typeof window === 'undefined'; 

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
        
        const handlePcButtonClick = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.id === 'pc-btton') {
                // Emit an event when the "pc-btton" button is clicked
                EventBus.emit('addpc');
            }
        };
        
        window.addEventListener('resize', handleCanvasResize);

        // Add event listener to a parent element that exists when the component mounts
        document.addEventListener('click', handlePcButtonClick);
        
        EventBus.on('handle-property', () => {
            if (game.current) {
              // Create a new div element
              const newDiv = document.createElement('div');
              newDiv.id = 'my-new-div';
              newDiv.className = 'absolute h-[50hv] bg-red-500 z-500';
              // Append the new div to the canvas
              if(game.current.canvas.parentElement){game.current.canvas.parentElement.appendChild(newDiv)};
            }
          });
        return () => {
            document.removeEventListener('click', handlePcButtonClick);
            window.removeEventListener('resize', handleCanvasResize);
        };
        
    }, []);

    return (
        <div id='canva-container' className='flex-grow overflow-auto'></div>
    );

});
