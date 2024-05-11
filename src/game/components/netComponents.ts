import { Scene } from 'phaser';
import { ImageManager } from '../managers/imageManager';

export class Pc extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    
    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
    }
}

export class Switch extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    vlan: string = '';

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
    }
}

