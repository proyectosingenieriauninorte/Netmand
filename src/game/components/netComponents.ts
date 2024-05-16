import { Scene } from 'phaser';
import { ImageManager } from '../managers/imageManager';
import { EventBus } from '../EventBus';
import { createRoot } from 'react-dom/client';
import SwitchPortMenu from '../primitives/contextMenu/switchPortsMenu';
import PcPortMenu from '../primitives/contextMenu/pcPortsMenu';

import ReactDOM from 'react-dom';

export class Pc extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text; // Text object for displaying text below the image
    connected: boolean = false;

    DomElement: Phaser.GameObjects.DOMElement;
    
    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;

        this.addText();
        //this.createDomElement();

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        this.image.on('pointerdown', this.displayPorts.bind(this));
    }

    private addText() {
        this.text = this.scene.add.text(this.image.x, this.image.y + this.image.height / 2, `PC ${this.identifier}`, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#000000'
        }).setOrigin(0.5); // Set text origin to the center
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

    public displayPorts(pointer: Phaser.Input.Pointer) {

        const x = this.image.x - this.image.width / 2;
        const y = this.image.y - this.image.height / 2;
        EventBus.emit('Ports', x, y, this.image.width, this.image.height, 'Pc');
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
    ports: (Pc | Router | null)[];

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.ports = new Array(24).fill(null);
        this.addText();

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
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
    public connectToPort(portIndex: number, object: Pc | Router) {
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
    public getObjectConnectedToPort(portIndex: number): Pc | Router | null {
        if (portIndex >= 0 && portIndex < 24) { // Ensure portIndex is within bounds
            return this.ports[portIndex];
        }
        return null;
    }

    public displayPorts(pointer: Phaser.Input.Pointer) {
        EventBus.emit('displayPorts', this.image.x, this.image.y, this.image.width, this.image.height, 'Switch');
    }
}

export class Router extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text; // Text object for displaying text below the image

    connected: boolean = false;
    ports: (Router | Switch | null)[];

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.addText();
        this.ports = new Array(4).fill(null);

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
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

    public displayPorts() {
        EventBus.emit('displayPorts', this.image.x, this.image.y, this.image.width, this.image.height, 'Router');
    }
}

export class Cable{
    scene: Scene;
    startCoordinates: { x: number, y: number} = { x: 0, y: 0};
    startComponent: Pc | Switch | Router | undefined = undefined;
    endCoordinates: { x: number, y: number} = { x: 0, y: 0};
    endComponent: Pc | Switch | Router | undefined = undefined;
    graphics: Phaser.GameObjects.Graphics;

    private tween: Phaser.Tweens.Tween | undefined;
    private color: number = 0xF71C1C;
    duration: number = 150;


    constructor(scene: Scene, startCoordinates: { x: number, y: number}) {
        this.scene = scene;
        this.startCoordinates = startCoordinates;
        this.endCoordinates = startCoordinates;
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(-1);
        window.addEventListener('mousemove', this.updateCablePosition.bind(this));
        this.animate();
    }

    public StartCoordinates(startCoordinates: { x: number, y: number}) {
        this.startCoordinates = startCoordinates;
        this.draw();
    }

    public EndCoordinates(endCoordinates: { x: number, y: number}) {
        this.endCoordinates = endCoordinates;
        this.draw();
    }

    private draw() {
        this.graphics.clear();
        this.graphics.lineStyle(5, this.color);
        this.graphics.beginPath();
        this.graphics.moveTo(
            this.startCoordinates.x,
            this.startCoordinates.y 
        );
        this.graphics.lineTo(
            this.endCoordinates.x,
            this.endCoordinates.y
        );
        this.graphics.closePath();
        this.graphics.strokePath();

    }

    destroy() {
        this.graphics.destroy();
    }

    private updateCablePosition(){
        if (this.startComponent !== undefined && this.endComponent !== undefined) {
            // Update coordinates if components' positions change
            if (this.startComponent.image.x !== this.startCoordinates.x || this.startComponent.image.y !== this.startCoordinates.y) {
                this.StartCoordinates({ x: this.startComponent.image.x, y: this.startComponent.image.y });
            }else if (this.endComponent.image.x !== this.endCoordinates.x || this.endComponent.image.y !== this.endCoordinates.y) {
                this.EndCoordinates({ x: this.endComponent.image.x, y: this.endComponent.image.y });
            }
        }
    }

    private animate() {
        if (this.tween) {
            this.tween.stop();
        }

        this.tween = this.scene.tweens.add({
            targets: this.graphics,
            alpha: 0,
            duration: this.duration,
            yoyo: true,
            repeat: -1 
        });
    }

    public stopAnimation() {
        if (this.tween) {
            this.tween.stop();
            this.graphics.alpha = 1;
            this.color = 0x0DF42D;
            this.graphics.clear(); // Clear existing graphics
            this.graphics.lineStyle(5, this.color); // Set new stroke style (color)
            // Redraw the cable
            this.graphics.beginPath();
            this.graphics.moveTo(this.startCoordinates.x, this.startCoordinates.y);
            this.graphics.lineTo(this.endCoordinates.x, this.endCoordinates.y);
            this.graphics.closePath();
            this.graphics.strokePath();
        }
    }
}


