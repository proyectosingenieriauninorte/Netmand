import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class ImageManager{
    scene: Scene;
    image: Phaser.GameObjects.Image;
    dragBox: Phaser.GameObjects.Graphics;
    clickbox: Phaser.GameObjects.Graphics;

    constructor(scene: Scene, image: Phaser.GameObjects.Image) {
        this.scene = scene;
        this.image = image;

        this.createDragBox();
        this.scene.input.on('drag', this.handleDrag.bind(this));
        this.scene.input.on('dragstart', this.startDrag.bind(this));
        this.scene.input.on('dragend', this.endDrag.bind(this));
        
        this.image.on('pointerdown', this.clickBox.bind(this));

        document.addEventListener('pointerdown', this.hideClickBox.bind(this));
    }

    private createDragBox() {
        this.dragBox = this.scene.add.graphics();
        this.clickbox = this.scene.add.graphics();

        this.drawDashedRect(this.dragBox, this.image.x, this.image.y, this.image.width, this.image.height, 2, 0x43A5F1);
        this.drawDashedRect(this.clickbox, this.image.x, this.image.y, this.image.width, this.image.height, 2, 0x000000);

        this.dragBox.setVisible(false);
        this.clickbox.setVisible(false);
    }

    private drawDashedRect(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, lineWidth: number, color: number) {
        const dashLength = 5;
        const gapLength = 3;

        graphics.lineStyle(lineWidth, color, 1);

        // Top border
        for (let i = x; i < x + width; i += dashLength + gapLength) {
            graphics.moveTo(i, y);
            graphics.lineTo(i + dashLength, y);
        }

        // Bottom border
        for (let i = x; i < x + width; i += dashLength + gapLength) {
            graphics.moveTo(i, y + height);
            graphics.lineTo(i + dashLength, y + height);
        }

        // Left border
        for (let i = y; i < y + height; i += dashLength + gapLength) {
            graphics.moveTo(x, i);
            graphics.lineTo(x, i + dashLength);
        }

        // Right border
        for (let i = y; i < y + height; i += dashLength + gapLength) {
            graphics.moveTo(x + width, i);
            graphics.lineTo(x + width, i + dashLength);
        }

        graphics.strokePath();
    }

    private startDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number){
        if (imageGameObject === this.image) {
            this.dragBox.setVisible(true);
            this.dragBox.x = dragX - this.image.width / 2;
            this.dragBox.y = dragY - this.image.height / 2;

            const propertiesMenu = document.getElementById('comp-properties');
            if (propertiesMenu) {
                propertiesMenu.style.display = 'none';
            }
        }
    }

    private endDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) {
        this.dragBox.setVisible(false);
        if (imageGameObject === this.image) {
            EventBus.emit('hideAlert');
        }
    }
    
    private handleDrag(pointer: Phaser.Input.Pointer, imageGameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) {
        if (imageGameObject === this.image) {// Update the position of the image

            this.scene.children.bringToTop(this.image);
            this.scene.children.bringToTop(this.dragBox);
            this.scene.children.bringToTop(this.clickbox);

            EventBus.emit('showAlert', 'moving component...');

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
        }else{
            this.clickbox.setVisible(false);
        }
    }

    private hideClickBox(event: MouseEvent) {
        const worldPointer = this.scene.input.activePointer;
        if (!this.image.getBounds().contains(worldPointer.worldX, worldPointer.worldY)){
            this.clickbox.setVisible(false);
        }
    }
}


