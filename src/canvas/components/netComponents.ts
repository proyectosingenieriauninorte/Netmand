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
        this.image.setDepth(-1);
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

export class Pc extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;
    ports: (Switch| null)[];
    targetPort: number = 0;
    mask: string = '';
    ip: string = '';
    net: string = '';
    gateway: string = '';
    
    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.ports = new Array(1).fill(null);
        this.addText();

        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        EventBus.on('showPc', this.showPcProperties.bind(this));
    }

    private showPcProperties() {
        EventBus.emit('showPcProperties', {
            ip: this.ip,
            mask: this.mask,
            net: this.net,
            gateway: this.gateway,
            identifier: this.identifier
        });
    }

    private addText() {
        this.text = this.scene.add.text(this.image.x, this.image.y + this.image.height / 2, `PC ${this.identifier}`, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#000000'
        }).setOrigin(0.5); 
    }

    private updateTextPosition() {
        const x = this.image.x;
        const y = this.image.y + this.image.height / 2 - 10;
        if (this.text.x !== x || this.text.y !== y) {
            this.text.x = x;
            this.text.y = y;
            this.scene.children.bringToTop(this.text);
        }
    }
    
    public connectToPort(portIndex: number, object: Switch) {
        if (portIndex == 0) { // Ensure portIndex is within bounds
            this.ports[portIndex] = object;
        }
    }

    // Method to disconnect an object from a port
    public disconnectFromPort(portIndex: number) {
        if (portIndex == 0 ) { // Ensure portIndex is within bounds
            this.ports[portIndex] = null;
        }
    }

    private displaySettingsMenu(pointer: Phaser.Input.Pointer) {
        if (pointer.rightButtonDown()) {

            const camera = this.scene.cameras.main;
            const adjustedX = (this.image.x - this.image.width/2 - camera.worldView.x) * camera.zoom;
            const adjustedY = (this.image.y - this.image.height/2 - camera.worldView.y) * camera.zoom;
            const adjustedWidth = this.image.width * camera.zoom;
            const adjustedHeight = this.image.height * camera.zoom;
            
            EventBus.emit('showPropertiesMenu', {
                x: adjustedX,
                y: adjustedY,
                width: adjustedWidth,
                height: adjustedHeight,
                type: 'Pc',
                id: this.identifier
            });
        }        
    }

    public displayPorts(pointer: Phaser.Input.Pointer) {
        const camera = this.scene.cameras.main;

        const adjustedX = (this.image.x - this.image.width/2 - camera.worldView.x) * camera.zoom;
        const adjustedY = (this.image.y - this.image.height/2 - camera.worldView.y) * camera.zoom;
        const adjustedWidth = this.image.width * camera.zoom;
        const adjustedHeight = this.image.height * camera.zoom;

        const e = event as MouseEvent;

        EventBus.emit('showPcPorts', { 
            x: adjustedX, 
            y: adjustedY, 
            width: adjustedWidth, 
            height: adjustedHeight, 
            type: 'Pc', 
            id: this.identifier,
            clientX: e.clientX,
            clientY: e.clientY}); 
    }

}

export class Switch extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text; // Text object for displaying text below the image
    ports: {object: Pc | Router | null, 
        vlan: string, 
        Speed: string, 
        duplex: string,
        description: string
        status: string
        mode: string}[];
    targetPort: number = 0;

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.ports = new Array(24).fill(null).map(() => ({ object: null, 
            vlan: '', 
            Speed: '', 
            duplex: '',
            description: '',
            status: '',
            mode: ''
        }));
        this.addText();

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
        EventBus.on('showSwitch', this.showSwitchProperties.bind(this));
    }

    private showSwitchProperties() {
        EventBus.emit('showSwitchProperties', {
            ports: this.ports,
            identifier: this.identifier
        });
    }

    private addText() {
        this.text = this.scene.add.text(this.image.x, this.image.y + this.image.height / 2 - 50, `Switch ${this.identifier}`, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#000000'
        }).setOrigin(0.5); // Set text origin to the center
    }

    private updateTextPosition() {
        const x = this.image.x;
        const y = this.image.y + this.image.height / 2 - 50;
        if (this.text.x !== x || this.text.y !== y) {
            this.text.x = x;
            this.text.y = y;
            this.scene.children.bringToTop(this.text);
        }
    }


    // Method to get the object connected to a port
    public getObjectConnectedToPort(portIndex: number): Pc | Router | null {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            return this.ports[portIndex].object;
        }
        return null;
    }

    // Method to get the VLAN assigned to a port
    public getVlanAssignedToPort(portIndex: number): string {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            return this.ports[portIndex].vlan;
        }
        return '';
    }

    private displaySettingsMenu(pointer: Phaser.Input.Pointer) {
        if (pointer.rightButtonDown()) {

            const camera = this.scene.cameras.main;
            const adjustedX = (this.image.x - this.image.width / 2 - camera.worldView.x) * camera.zoom;
            const adjustedY = (this.image.y - this.image.height / 2 - camera.worldView.y) * camera.zoom;
            const adjustedWidth = this.image.width * camera.zoom;
            const adjustedHeight = this.image.height * camera.zoom;

            EventBus.emit('showPropertiesMenu', {
                x: adjustedX,
                y: adjustedY,
                width: adjustedWidth,
                height: adjustedHeight,
                type: 'Switch',
                id: this.identifier,
            });
        }
    }

    public displayPorts(pointer: Phaser.Input.Pointer) {

        const camera = this.scene.cameras.main;
        const adjustedX = (this.image.x - this.image.width / 2 - camera.worldView.x) * camera.zoom;
        const adjustedY = (this.image.y - this.image.height / 2 - camera.worldView.y) * camera.zoom;
        const adjustedWidth = this.image.width * camera.zoom;
        const adjustedHeight = this.image.height * camera.zoom;
        
        const e = event as MouseEvent;

        EventBus.emit('displayPorts', {
            x: adjustedX,
            y: adjustedY,
            width: adjustedWidth,
            height: adjustedHeight,
            type: 'Switch',
            id: this.identifier,
            ports: this.ports,
            clientX: e.clientX,
            clientY: e.clientY
        });
    }
    
}

export class Router extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text; // Text object for displaying text below the image
    ports: (Router | Switch | null)[];
    targetPort: number = 0;

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.addText();
        this.ports = new Array(4).fill(null);

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
    }

    private addText() {
        this.text = this.scene.add.text(this.image.x, this.image.y + this.image.height / 2, `Router ${this.identifier}`, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#000000'
        }).setOrigin(0.5); // Set text origin to the center
    }

    private updateTextPosition() {
        const x = this.image.x;
        const y = this.image.y + this.image.height / 2;
        if (this.text.x !== x || this.text.y !== y) {
            this.text.x = x;
            this.text.y = y;
            this.scene.children.bringToTop(this.text);
        }
    }

    // Method to connect an object to a port
    public connectToPort(portIndex: number, object: Router | Switch) {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            this.ports[portIndex] = object;
        }
    }

    // Method to disconnect an object from a port
    public disconnectFromPort(portIndex: number) {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            this.ports[portIndex] = null;
        }
    }

    // Method to get the object connected to a port
    public getObjectConnectedToPort(portIndex: number): Router | Switch | null {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            return this.ports[portIndex];
        }
        return null;
    }

    private displaySettingsMenu(pointer: Phaser.Input.Pointer) {
        if (pointer.rightButtonDown()) {

            const camera = this.scene.cameras.main;
            const adjustedX = (this.image.x - this.image.width/2 - camera.worldView.x) * camera.zoom;
            const adjustedY = (this.image.y - this.image.height/2 - camera.worldView.y) * camera.zoom;
            const adjustedWidth = this.image.width * camera.zoom;
            const adjustedHeight = this.image.height * camera.zoom;

            EventBus.emit('showPropertiesMenu', {
                x: adjustedX,
                y: adjustedY,
                width: adjustedWidth,
                height: adjustedHeight,
                type: 'Router',
                id: this.identifier
            });
        }
    }

    public displayPorts(pointer: Phaser.Input.Pointer) {

        const camera = this.scene.cameras.main;
        const adjustedX = (this.image.x - this.image.width / 2 - camera.worldView.x) * camera.zoom;
        const adjustedY = (this.image.y - this.image.height / 2 - camera.worldView.y) * camera.zoom;
        const adjustedWidth = this.image.width * camera.zoom;
        const adjustedHeight = this.image.height * camera.zoom;
        
        const e = event as MouseEvent;

        EventBus.emit('displayRouterPorts', {
            x: adjustedX,
            y: adjustedY,
            width: adjustedWidth,
            height: adjustedHeight,
            type: 'Router',
            id: this.identifier,
            ports: this.ports,
            clientX: e.clientX,
            clientY: e.clientY
        });
    }
}


export class Cable {
    scene: Phaser.Scene;
    startCoordinates: { x: number, y: number } = { x: 0, y: 0 };
    startComponent: Pc | Switch | Router | null = null;
    endCoordinates: { x: number, y: number } = { x: 0, y: 0 };
    endComponent: Pc | Switch | Router  | null = null;
    identifier: number;
    private line: Phaser.GameObjects.Graphics;
    private interactiveArea: Phaser.GameObjects.Zone;
    private selected: boolean = false;
    

    constructor(scene: Phaser.Scene, identifier:number, startCoordinates: { x: number, y: number }) {
        this.scene = scene;
        this.startCoordinates = startCoordinates;
        this.endCoordinates = {x: startCoordinates.x + 1, y: startCoordinates.y + 1};
        this.identifier = identifier;
        this.line = scene.add.graphics();
        this.interactiveArea = scene.add.zone(0, 0, 1, 1).setOrigin(0.5, 0.5); // Center the origin
        this.draw();

        this.interactiveArea.setInteractive({ useHandCursor: true });
        this.interactiveArea.on('pointerdown', this.onSelect, this);
        window.addEventListener('mousemove', this.update.bind(this));
        this.scene.input.on('pointerdown', this.onCanvasClick, this);

    }

    private draw(): void {
        this.line.clear();
        this.line.lineStyle(5, this.selected ? 0xff0000 : 0x000000); // Red if selected, black otherwise
        this.line.strokeLineShape(new Phaser.Geom.Line(this.startCoordinates.x, this.startCoordinates.y, this.endCoordinates.x, this.endCoordinates.y));
        
        // Update the interactive area to cover the line
        const lineLength = Phaser.Math.Distance.Between(this.startCoordinates.x, this.startCoordinates.y, this.endCoordinates.x, this.endCoordinates.y);
        const midPointX = (this.startCoordinates.x + this.endCoordinates.x) / 2;
        const midPointY = (this.startCoordinates.y + this.endCoordinates.y) / 2;

        // Set the interactive area's position and size
        this.interactiveArea.setPosition(midPointX, midPointY);
        this.interactiveArea.setSize(lineLength, 20); // Height of 20 for easier interaction

        // Rotate the interactive area to match the line's angle
        const angle = Phaser.Math.Angle.Between(this.startCoordinates.x, this.startCoordinates.y, this.endCoordinates.x, this.endCoordinates.y);
        this.interactiveArea.setRotation(angle);
    }

    private onSelect(event: KeyboardEvent): void {
        //check if the current pointer x and y is within the bounds of the interactive area
        this.selected = !this.selected;
        this.draw();
    }

    private onCanvasClick(event: Phaser.Input.Pointer): void {
        // Check if the click is outside the line and deselect it
        const isOutsideLine = this.isPointOutsideLine(event.worldX, event.worldY);
        console.log(isOutsideLine);
        if (isOutsideLine) {
            this.selected = false;
            this.draw();
        }
    }

    private isPointOutsideLine(x: number, y: number): boolean {
        const { x: startX, y: startY } = this.startCoordinates;
        const { x: endX, y: endY } = this.endCoordinates;
        const distanceFromStart = Phaser.Math.Distance.Between(startX, startY, x, y);
        const distanceFromEnd = Phaser.Math.Distance.Between(endX, endY, x, y);
        const lineLength = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        console.log(distanceFromStart, distanceFromEnd, lineLength);
        return distanceFromStart > 10 || distanceFromEnd > 10;
    }
    public update(): void {
        if (this.startComponent) {
            const { x: startX, y: startY } = this.startComponent.image; // Assuming components have an `image` property
            if (this.startCoordinates.x !== startX || this.startCoordinates.y !== startY) {
                this.startCoordinates = { x: startX, y: startY };
            }
        }
        if (this.endComponent) {
            const { x: endX, y: endY } = this.endComponent.image;
            if (this.endCoordinates.x !== endX || this.endCoordinates.y !== endY) {
                this.endCoordinates = { x: endX, y: endY };
            }
        }
        this.draw();
    }

    public updateStartCoordinates(newCoordinates: { x: number, y: number }): void {
        this.startCoordinates = newCoordinates;
        this.draw();
    }

    public updateEndCoordinates(newCoordinates: { x: number, y: number }): void {
        this.endCoordinates = newCoordinates;
        this.draw();
    }

    public setStartComponent(component: Pc | Switch | Router): void {
        this.startComponent = component;
        // Additional logic if needed when setting the component
    }

    public setEndComponent(component: Pc | Switch | Router): void {
        this.endComponent = component;
        // Additional logic if needed when setting the component
    }

    public destroy(): void {
        this.line.destroy();
        this.interactiveArea.destroy();
        this.startComponent = null;
        this.endComponent = null;
    }
}