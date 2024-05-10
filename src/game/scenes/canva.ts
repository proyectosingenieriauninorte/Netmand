import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc } from '../classes/pc';


export class canva extends Scene
{   
    private propertiesPanel: HTMLElement;
    private _zoom: number = 1;
    private pc: Pc[] = [];
    private isBeingAddedToCanvas: boolean = false;


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
        this.load.image('pc_component', 'pc.png');
    }

    

    create ()
    {   
     

        this.input.on('wheel', this.zoom, this);

        EventBus.on('addpc', () => {this.addPc(); this.isBeingAddedToCanvas = true;});

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

    private addsPc() {
        const isAnyPcBeingDragged = this.pc.some(pc => pc.isBeingAddedToCanvas)
        if (isAnyPcBeingDragged) {
            return;
        }
        const pc = new Pc(this, this.pc.length, this.add.image(-1000, -1000, 'pc_component'));
        this.pc.push(pc);
        console.log('lenght:', this.pc.length)
    }

    private addPc() {
        if (this.isBeingAddedToCanvas) {
            return;
        }

        const pc = new Pc(this, this.pc.length, this.add.image(0, 0, 'pc_component').setInteractive({ draggable: true }));

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isBeingAddedToCanvas) {
                pc.image.setPosition(pointer.worldX, pointer.worldY);
            }
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.isBeingAddedToCanvas = false;
                pc.image.setInteractive({ draggable: true });
                this.input.off('pointermove');
                this.input.off('pointerdown');
            }
        });

        this.pc.push(pc);
    }
}
