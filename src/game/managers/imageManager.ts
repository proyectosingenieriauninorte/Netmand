import { Scene } from 'phaser';

export class ImageManager {
    scene: Scene;
    image: Phaser.GameObjects.Image ;
    isDragging: boolean = true;

    constructor(scene: Scene, image: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.image = image;
        this.scene.input.on('pointermove', this.handlePointerMove, this);
        this.scene.input.on('pointerdown', this.handlePointerUp, this);
        this.scene.input.on('drag', this.handleDrag, this);
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (this.isDragging) {
            this.image.setPosition(pointer.worldX, pointer.worldY);
        }
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer) {
        if (pointer.leftButtonDown()) { 
            this.isDragging = false;
            this.image.setInteractive({ draggable: true })
        }
    }

    private handleDrag(pointer: Phaser.Input.Pointer) {
        if(this.image.getBounds().contains(pointer.worldX, pointer.worldY)){
            this.image.x = pointer.worldX;
            this.image.y = pointer.worldY;
        }
    }
}
