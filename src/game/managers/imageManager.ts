import { Scene } from 'phaser';

export class ImageManager {
    scene: Scene;
    image: Phaser.GameObjects.Image;

    private dragBox: Phaser.GameObjects.Graphics;

    constructor(scene: Scene, image: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.image = image;

        this.createDragBox();
        this.scene.input.on('drag', this.handleDrag.bind(this));
        this.scene.input.on('dragstart', this.startDrag.bind(this));
        this.scene.input.on('dragend', () => {this.dragBox.setVisible(false)});
    }

    private createDragBox() {
        this.dragBox = this.scene.add.graphics();
        this.dragBox.lineStyle(2, 0x43A5F1, 1);
        this.dragBox.strokeRect(this.image.x, this.image.y, this.image.width, this.image.height);
        this.dragBox.setVisible(false)
    }

    private startDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number){
        this.dragBox.setVisible(true);
        this.dragBox.x = dragX - this.image.width / 2;
        this.dragBox.y = dragY - this.image.height / 2;
    }
    
    private handleDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) {
        // Update the position of the image
        imageGameObject.x = dragX;
        imageGameObject.y = dragY;

        // Update the position of the drag box
        this.dragBox.x = dragX - this.image.width / 2;
        this.dragBox.y = dragY - this.image.height / 2;
    }
    
}
