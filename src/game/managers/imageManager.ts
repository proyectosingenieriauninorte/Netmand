import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class ImageManager{
    scene: Scene;
    image: Phaser.GameObjects.Image;
    hola: boolean = false;

    dragBox: Phaser.GameObjects.Graphics;
    clickbox: Phaser.GameObjects.Graphics;

    constructor(scene: Scene, image: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.image = image;

        this.createDragBox();
        this.scene.input.on('drag', this.handleDrag.bind(this));
        this.scene.input.on('dragstart', this.startDrag.bind(this));
        this.scene.input.on('dragend', (imageGameObject: Phaser.GameObjects.Image) => {
            this.dragBox.setVisible(false);
        });
        
        this.image.on('pointerdown', this.clickBox.bind(this));
        

        document.addEventListener('pointerdown', this.hideClickBox.bind(this));
    }

    private createDragBox() {
        this.dragBox = this.scene.add.graphics();
        this.dragBox.lineStyle(2, 0x43A5F1, 1);
        this.dragBox.strokeRect(this.image.x, this.image.y, this.image.width, this.image.height);
        this.dragBox.setVisible(false)

        this.clickbox = this.scene.add.graphics();
        this.clickbox.lineStyle(2, 0x000000, 1);
        this.clickbox.strokeRect(this.image.x, this.image.y, this.image.width, this.image.height);
        this.clickbox.setVisible(false);
    }

    private startDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number){
        if (imageGameObject === this.image) {
            this.dragBox.setVisible(true);
            this.dragBox.x = dragX - this.image.width / 2;
            this.dragBox.y = dragY - this.image.height / 2;
        }
    }
    
    private handleDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) {
        if (imageGameObject === this.image) {// Update the position of the image

            this.scene.children.bringToTop(this.image);
            this.scene.children.bringToTop(this.dragBox);
            this.scene.children.bringToTop(this.clickbox);

            imageGameObject.x = dragX;
            imageGameObject.y = dragY;

            // Update the position of the drag box
            this.dragBox.x = dragX - this.image.width / 2;
            this.dragBox.y = dragY - this.image.height / 2;
            this.clickbox.setVisible(false);
        }
    }

    private updateClickBox(pointer: Phaser.Input.Pointer) {
        this.clickbox.x = this.image.x - this.image.width / 2;
        this.clickbox.y = this.image.y - this.image.height / 2;
    }

    private clickBox(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image) {
        if(pointer.leftButtonDown()) {
            this.clickbox.setVisible(true);
            this.updateClickBox(pointer);
        }
    }

    private hideClickBox(event: MouseEvent) {
        const worldPointer = this.scene.input.activePointer;
        if (!this.image.getBounds().contains(worldPointer.worldX, worldPointer.worldY)){
            this.clickbox.setVisible(false);
        }
    }
}


