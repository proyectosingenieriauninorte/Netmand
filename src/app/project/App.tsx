import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '../../game/PhaserCanvas'

function App()
{

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {

    }

    return (
        <div id="app" className='flex-grow'>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    )
}

export default App
