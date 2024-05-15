import { AUTO, Game } from 'phaser';
import { canva } from './scenes/canva';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: 'canva-container',
    backgroundColor: '#C1C4CA',
    scene: [
        canva,
    ],
    audio: {
        noAudio: true,
    },
    disableContextMenu: true,
    dom: {
        createContainer: true,
    },
};

const StartGame = (parent: string) => {

    const gameContainer = document.getElementById('app');

    const game = new Phaser.Game({
        ...config,
        parent: parent,
    });

    game.canvas.classList.add('rounded-xl');
    
    if (gameContainer) {
        game.canvas.width = gameContainer.clientWidth;
        game.canvas.height = gameContainer.clientHeight;
    }
    
    return game;
}

export default StartGame;
