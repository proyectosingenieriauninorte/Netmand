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

    public destroyDragbox() {
        this.dragBox.destroy();
        this.clickbox.destroy();
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

export class Pc extends ImageManager {
    scene: Scene;
    x: number;
    y: number;
    textx: number;
    texty: number;
    identifier: number;
    image: Phaser.GameObjects.Image;
    text: Phaser.GameObjects.Text;
    ports: (Switch| null)[];
    targetPort: number = 0;
    mask: string = '';
    ip: string = '';
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
    }

    public showPcProperties() {
        EventBus.emit('showPcProperties', {
            ip: this.ip,
            mask: this.mask,
            gateway: this.gateway,
            identifier: this.identifier,
            type: 'Pc'
        });
    }

    public destroy() {
        this.image.destroy();
        this.dragBox.destroy();
        this.text.destroy();
        this.clickbox.destroy();
    }

    public updateProperties(data: { ip: string, mask: string, gateway: string }) {
        this.ip = data.ip;
        this.mask = data.mask;
        this.gateway = data.gateway;
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
    message: string = '';
    hostname: string = '';  
    ports: {object: Pc | Router | null, 
        vlan: string, 
        speed: string, 
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
            speed: '', 
            duplex: '',
            description: '',
            status: '',
            mode: ''
        }));
        this.addText();

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
    }

    public updateProperties(data: { ports: { object: Pc | Router | null; vlan: string; speed: string; duplex: string; description: string; status: string; mode: string }[]
    , message: string, hostname: string}) {
        this.ports = data.ports;
        this.message = data.message;
        this.hostname = data.hostname;
    }

    public destroy() {
        this.image.destroy();
        this.dragBox.destroy();
        this.text.destroy();
        this.clickbox.destroy();
    }

    public showSwitchProperties() {
        EventBus.emit('showSwitchProperties', {
            ports: this.ports,
            identifier: this.identifier,
            message: this.message,
            hostname: this.hostname,
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
    message: string = '';
    hostname: string = '';  
    rip: [] = [];
    ports: {object: Switch| Router | null, 
        speed: string, 
        duplex: string,
        description: string,
        status: string,
        net: string,
        interface_ip: string,
        interface_mask: string,
        dot1q: {vlan: string, ip: string, mask: string}[]}[];
    targetPort: number = 0;

    constructor(scene: Scene, identifier: number, image: Phaser.GameObjects.Image) {
        super(scene, image);
        this.scene = scene;
        this.identifier = identifier;
        this.image = image;
        this.addText();
        this.ports = new Array(4).fill(null).map(() => ({ object: null,
            speed: '',
            duplex: '',
            description: '',
            status: '',
            net: '',
            interface_ip: '',
            interface_mask: '',
            dot1q: []
        }));

        window.addEventListener('mousemove', this.updateTextPosition.bind(this));
        this.image.on('pointerdown', this.displaySettingsMenu.bind(this));
    }

    public updateProperties(data: { ports: { object: Switch | Router | null; speed: string; duplex: string; description: string; status: string; net: string; interface_ip: string; interface_mask: string; dot1q: {vlan: string, ip: string, mask: string}[]}[], 
        message: string, hostname: string, rip: []}) {
        this.ports = data.ports;
        this.message = data.message;
        this.hostname = data.hostname;
        this.rip = data.rip;
    }
    
    public destroy() {
        this.image.destroy();
        this.dragBox.destroy();
        this.text.destroy();
        this.clickbox.destroy();
    }


    public showRouterProperties() {
        EventBus.emit('showRouterProperties', {
            ports: this.ports,
            identifier: this.identifier,
            message: this.message,
            hostname: this.hostname,
            rip: this.rip
        });
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
        const y = this.image.y + this.image.height / 2 - 35;
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
    endComponent: Pc | Switch | Router | null = null;
    identifier: number;
    isSomethingBeingAdded: boolean = false;
    selected: boolean = false;
    private line: Phaser.GameObjects.Graphics;
    private lightLine: Phaser.GameObjects.Graphics;
    private interactiveArea: Phaser.GameObjects.Zone;
    private lightTween?: Phaser.Tweens.Tween;
    private lightTweenProgress: number = 0; // To store the current tween progress

    constructor(scene: Phaser.Scene, identifier: number, startCoordinates: { x: number, y: number }) {
        this.scene = scene;
        this.startCoordinates = startCoordinates;
        this.endCoordinates = { x: startCoordinates.x + 1, y: startCoordinates.y + 1 };
        this.identifier = identifier;
        this.line = scene.add.graphics();
        this.lightLine = scene.add.graphics();
        this.interactiveArea = scene.add.zone(0, 0, 1, 1).setOrigin(0.5, 0.5); // Center the origin
        this.draw();

        this.interactiveArea.setInteractive({ useHandCursor: true });
        this.scene.input.on('pointerdown', this.onSelect, this);
        window.addEventListener('mousemove', this.update.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        EventBus.emit('cableCreated');
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (this.selected && event.key === 'Backspace') {
            EventBus.emit('showAlertDialog');
        }
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

    private onSelect(event: Phaser.Input.Pointer): void {
        if (!this.isSomethingBeingAdded) {
            // Check if the mouse pointer intersects with the cable line
            const line = new Phaser.Geom.Line(this.startCoordinates.x, this.startCoordinates.y, this.endCoordinates.x, this.endCoordinates.y);
            const worldPoints = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main) as Phaser.Math.Vector2;

            // Define the polygonal area around the line
            const offset = 10; // Adjust as needed
            const perpVec = new Phaser.Math.Vector2(line.y2 - line.y1, line.x1 - line.x2).normalize().scale(offset);
            const p1 = new Phaser.Math.Vector2(line.x1, line.y1).add(perpVec);
            const p2 = new Phaser.Math.Vector2(line.x2, line.y2).add(perpVec);
            const p3 = new Phaser.Math.Vector2(line.x2, line.y2).subtract(perpVec);
            const p4 = new Phaser.Math.Vector2(line.x1, line.y1).subtract(perpVec);

            const hitArea = new Phaser.Geom.Polygon([p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y]);

            if (hitArea.contains(worldPoints.x, worldPoints.y)) {
                this.selected = true;
            } else {
                this.selected = false;
            }
        } else {
            this.selected = false;
        }
        this.draw();
    }

    private startLightAnimation(): void {
        const duration = 1000; // Duration of the animation in milliseconds
        const repeat = -1; // Infinite loop

        this.lightTween = this.scene.tweens.addCounter({
            from: this.lightTweenProgress,
            to: 1,
            duration: duration * (1 - this.lightTweenProgress), // Resume from where it was left
            repeat: repeat,
            onUpdate: (tween: Phaser.Tweens.Tween, target: any) => {
                this.lightTweenProgress = target.value; // Update the progress
                if (this.lightTweenProgress === 1) {
                    this.lightTweenProgress = 0; // Reset the progress
                    this.lightTween?.stop();
                    this.lightTween = undefined;
                    this.lightLine.clear();
                    this.startLightAnimation(); // Restart the animation
                }
                this.drawLightLine(this.lightTweenProgress);
            },
        });
    }

    private drawLightLine(t: number): void {
        this.lightLine.clear();
        const lightColor = 0xffff00; // Yellow light

        const startX = Phaser.Math.Interpolation.Linear([this.startCoordinates.x, this.endCoordinates.x], t);
        const startY = Phaser.Math.Interpolation.Linear([this.startCoordinates.y, this.endCoordinates.y], t);

        const endX = Phaser.Math.Interpolation.Linear([this.startCoordinates.x, this.endCoordinates.x], Math.min(t + 0.1, 1));
        const endY = Phaser.Math.Interpolation.Linear([this.startCoordinates.y, this.endCoordinates.y], Math.min(t + 0.1, 1));

        this.lightLine.lineStyle(5, lightColor);
        this.lightLine.strokeLineShape(new Phaser.Geom.Line(startX, startY, endX, endY));
    }

    public toggleAnimations(enable: boolean): void {
        if (enable) {
            this.startLightAnimation();
        } else {
            if (this.lightTween) {
                this.lightTween.stop();
                this.lightTween = undefined;
                this.lightLine.clear();
            }
        }
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
        this.lightLine.destroy();
        this.interactiveArea.destroy();
        this.startComponent = null;
        this.endComponent = null;
        if (this.lightTween) {
            this.lightTween.stop();
            this.lightTween.remove(); // Properly remove the tween
        }
    }
}
