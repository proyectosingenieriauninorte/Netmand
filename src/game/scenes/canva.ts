import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc, Switch } from '../components/netComponents';

export class canva extends Scene
{   
    private _zoom: number = 1;
    private pc: Pc[] = [];
    private switches: Switch[] = [];
    private isBeingAddedToCanvas: boolean = false;


    constructor (){super('canva');}

    init (){}

    preload (){
        this.load.setPath('assets');
        this.load.image('pc_component', 'pc.png');
        this.load.image('switch_component', 'switch.png');
    }

    create (){   
        this.input.on('wheel', this.zoom, this);
        EventBus.on('addPc', () => {this.addComponent('pc'); this.isBeingAddedToCanvas = true;});
        EventBus.on('addSwitch', () => {this.addComponent('switch'); this.isBeingAddedToCanvas = true;});
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

    private createComponent(component: string){

        if(component === 'pc'){
            const pc_ = new Pc(this, this.pc.length, this.add.image(0, 0, 'pc_component').setInteractive({ draggable: true }));
            this.pc.push(pc_);
            console.log('pcs', this.pc.length)
            return pc_;
        }

        if(component === 'switch'){
            const switch_ = new Switch(this, this.switches.length, this.add.image(0, 0, 'switch_component').setInteractive({ draggable: true }));
            this.switches.push(switch_);
            console.log('switches', this.switches.length)
            return switch_;
        }
    }

    private addComponent(component: string) {
        if (this.isBeingAddedToCanvas) {
            return;
        }

        const createdComponent = this.createComponent(component);

        if(createdComponent){
            this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
                if (this.isBeingAddedToCanvas) {
                    createdComponent.image.setPosition(pointer.worldX, pointer.worldY);
                }
            });
    
            this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                if (pointer.leftButtonDown()) {
                    this.isBeingAddedToCanvas = false;
                    this.input.off('pointermove');
                    this.input.off('pointerdown');
                }
            });
        }
    }
}
