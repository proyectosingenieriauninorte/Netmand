import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc } from '../classes/pc';


export class canva extends Scene
{   
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
        this.input.on('wheel', this.zoom, this);

        EventBus.on('addpc', () => {
            const isAnyPcBeingDragged = this.pc.some(pc => pc.isDragging); // Check if any PC is currently being dragged
            if (!isAnyPcBeingDragged) {
                this.addPc()
            }
        });

        this.input.on('pointerdown', this.componentProperties, this);



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
        console.log('addPc');
        const pc = new Pc(this, this.pc.length, this.add.image(0, 0, 'pc_component'));
        this.pc.push(pc);
        console.log('lenght:', this.pc.length)
    }


    private componentProperties(event: Phaser.Input.Pointer){
        if (event.rightButtonDown()) {
            console.log('triggering event')
            console.log(event.worldX, event.worldY)
            // Get the associated PC object
            for (const pc of this.pc) {
                // Check if the click coordinates are within the bounds of the PC image
                if (pc.image.getBounds().contains(event.worldX, event.worldY)) {
                    EventBus.emit('handle-property')
                }
            }
        }
    }

}
