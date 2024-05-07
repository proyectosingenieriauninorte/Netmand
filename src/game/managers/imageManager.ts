import { Scene } from 'phaser';

export class ImageManager {
    scene: Scene;
    image: Phaser.GameObjects.Image ;
    private isDragging: boolean = true;
    
    constructor(scene: Scene, image: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.image = image;
        this.scene.input.on('pointermove', this.handlePointerMove, this);
        this.scene.input.on('pointerup', this.handlePointerUp, this);
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (this.isDragging) {
            this.image.setPosition(pointer.worldX, pointer.worldY);
        }
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer) {
        console.log(pointer.rightButtonDown());
        if (!pointer.rightButtonDown()) { 
            this.isDragging = false;
        }
    }
}
