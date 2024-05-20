import { Scene } from 'phaser';
import { ImageManager } from '../managers/imageManager';
import { EventBus } from '../EventBus';


export class Pc extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;
    ports: (Switch| null)[];

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.ports = new Array(1).fill(null);
        this.addText();

        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
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
    vlan: string = '';
    connectedPcs: Pc[] = [];
    text: Phaser.GameObjects.Text; // Text object for displaying text below the image
    ports: {object: Pc | Router | null, vlan: string;}[];
    targetPort: number = 0;

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.ports = new Array(24).fill(null).map(() => ({ object: null, vlan: '' }));
        this.addText();

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
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

    // Method to connect an object to a port
    public connectToPort(portIndex: number, object: Pc | Router, vlan: string) {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            this.ports[portIndex] = { object, vlan };
        }
    }

    // Method to disconnect an object from a port
    public disconnectFromPort(portIndex: number) {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            this.ports[portIndex] = { object: null, vlan: '' };
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
    startComponent: Pc | Switch | Router | undefined = undefined;
    endCoordinates: { x: number, y: number } = { x: 0, y: 0 };
    endComponent: Pc | Switch | Router | undefined = undefined;
    private line: Phaser.GameObjects.Graphics;
    private interactiveArea: Phaser.GameObjects.Zone;
    private selected: boolean = false;

    constructor(scene: Phaser.Scene, startCoordinates: { x: number, y: number }) {
        this.scene = scene;
        this.startCoordinates = startCoordinates;
        this.endCoordinates = startCoordinates;
        this.line = scene.add.graphics();
        this.interactiveArea = scene.add.zone(0, 0, 1, 1).setOrigin(0.5, 0.5); // Center the origin
        this.draw();

        // Add interactivity
        this.interactiveArea.setInteractive({ useHandCursor: true });
        this.interactiveArea.on('pointerdown', this.onSelect, this);
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

    private onSelect(): void {
        this.selected = !this.selected;
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
    }
}
