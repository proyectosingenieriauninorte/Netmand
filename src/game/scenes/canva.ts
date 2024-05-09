import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc } from '../classes/pc';
import { PropertiesPanel } from '../managers/propertiesPanelManager';


export class canva extends Scene
{   
    private propertiesPanel: HTMLElement;
    private _zoom: number = 1;
    private pc: Pc[] = [];


    constructor ()
    {
        super('canva');
    }

    init ()
    {

    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        const componentImage = this.load.image('pc_component', 'pc.png');
    }

    

    create ()
    {   
        this.setProperties('toolbox');
        this.setProperties('properties-panel');

        this.input.on('wheel', this.zoom, this);
        window.addEventListener('resize', this.updateDivsPositions.bind(this));

        EventBus.on('addpc', () => {
            const isAnyPcBeingDragged = this.pc.some(pc => pc.isDragging); // Check if any PC is currently being dragged
            if (!isAnyPcBeingDragged) {
                this.addPc()
            }
        });

        this.input.on('pointerdown', this.componentProperties, this);
        this.updateDivsPositions();
    }

    private zoom(pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) {
        
        let newZoom: number;
        if (deltaY < 0) {
            newZoom = this._zoom * 1.1; // zoom in
        } else {
            newZoom = this._zoom / 1.1; // zoom out
        }

        // zoom limits
        this._zoom = Phaser.Math.Clamp(newZoom, 0.6, 2);
        this.cameras.main.zoom = this._zoom;
    }

    private addPc() {
        const pc = new Pc(this, this.pc.length, this.add.image(0, 0, 'pc_component'));
        this.pc.push(pc);
        console.log('lenght:', this.pc.length)
    }

    private componentProperties(event: Phaser.Input.Pointer){
        if (event.rightButtonDown()) {
            for (const pc of this.pc) {
                // Check if the click coordinates are within the bounds of the PC image
                if (pc.image.getBounds().contains(event.worldX, event.worldY)) {
                    EventBus.emit('handle-property');
                }
            }
        }
    }

    private setProperties(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'flex';
            element.style.justifyContent = 'center';
            element.style.alignItems = 'center';
            element.style.padding = '0px';
            element.style.marginRight = '0px';
            element.style.marginBottom = '0px';
            element.style.position = 'absolute';
            element.style.overflow = 'hidden';
            element.style.transform = 'scale(1, 1)';
        }
    }

    private updateToolBoxPosition() {
        const element = document.getElementById('toolbox');
        if (element) {
            // Calculate the left position to center the element horizontally
            const leftPosition =  (window.innerWidth / 2 - 100) + 'px';
    
            // Calculate the top position to align it at the top of the parent
            const topPosition = (window.innerHeight - 59) + 'px';
    
            // Set the top and left position
            element.style.top = topPosition;
            element.style.left = leftPosition ;
        }
    }
    

    private updatePropertiesPosition() {
        const element = document.getElementById('properties-panel');
        if (element) {
            const parentContainer = element.parentElement;
            const parentWidth = this.game.canvas.clientWidth;
            const parentHeight = this.game.canvas.clientHeight;
            const elementWidth = element.clientWidth;
            const elementHeight = element.clientHeight;
    
            // Calculate the left position to center the element horizontally
            const leftPosition = (parentWidth - elementWidth) / 2;
    
            // Calculate the bottom position to align it at the bottom of the parent
            const bottomPosition = parentHeight - elementHeight;
    
            // Set the bottom and left position
            element.style.bottom = bottomPosition + 'px';
            element.style.left = leftPosition + 'px';
        }
    }

    private updateDivsPositions() {    
        this.updateToolBoxPosition();
        this.updatePropertiesPosition();
    }
}
