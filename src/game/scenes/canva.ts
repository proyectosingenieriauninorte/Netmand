import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc, Switch, Cable, Router} from '../components/netComponents';

export class canva extends Scene
{   
    private _zoom: number = 1;
    private pc: Pc[] = [];
    private switches: Switch[] = [];
    private routers: Router[] = [];
    private cables: Cable[] = [];
    private isBeingAddedToCanvas: boolean = false;
    private cableStartType: Pc | Switch | Router | undefined;


    constructor (){super('canva');}

    init (){}

    preload (){
        this.load.setPath('assets');
        this.load.image('pc_component', 'pc.png');
        this.load.image('switch_component', 'switch.png');
        this.load.image('router_component', 'router.png');
    }

    create (){   

        this.input.on('wheel', this.zoom, this);
        //this.input.on('pointerdown', this.componentDropMenu.bind(this));

        EventBus.on('addPc', () => {this.addComponent('pc'); this.isBeingAddedToCanvas = true;});
        EventBus.on('addSwitch', () => {this.addComponent('switch'); this.isBeingAddedToCanvas = true;});
        EventBus.on('addRouter', () => {this.addComponent('router'); this.isBeingAddedToCanvas = true;});
        EventBus.on('addCable', () => {this.addCable(); this.isBeingAddedToCanvas = true;});

        // Delete component on key press
        this.input.keyboard?.on('keydown-BACKSPACE', () => {
            console.log('delete');
            this.pc.forEach(pc => {
                if (pc.image.getBounds().contains(this.input.activePointer.worldX, this.input.activePointer.worldY)) {
                    console.log('delete pc');
                    this.removeComponent(pc);
                }
            });
            this.switches.forEach(switch_ => {
                if (switch_.image.getBounds().contains(this.input.activePointer.worldX, this.input.activePointer.worldY)) {
                    this.removeComponent(switch_);
                }
            });
            this.routers.forEach(router => {
                if (router.image.getBounds().contains(this.input.activePointer.worldX, this.input.activePointer.worldY)) {
                    this.removeComponent(router);
                }
            });
        });

        //this.createPortDomElement();
    }

    /******************************************************************
     * 
                        ** REMOVE COMPONENTS **

    ********************************************************************/

    private removeComponent(component: Pc | Switch | Router) {
        if (component instanceof Pc) {
            const index = this.pc.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeCable(component);
                this.pc.splice(index, 1);
            }
            return;
        }
        if (component instanceof Switch) {
            const index = this.switches.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeCable(component);
                this.switches.splice(index, 1);
                this.updateConnectedStatus(component);
            }
            return;
        }
        if (component instanceof Router) {
            const index = this.routers.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeCable(component);
                this.routers.splice(index, 1);
            }
            return;
        }
    }

    private destroyComponentGraphics(component: Pc | Switch | Router) {   
        component.image.destroy();
        component.dragBox.destroy();
        component.clickbox.destroy();
        component.text.destroy();
    }

    private removeCable(component: Pc | Switch | Router) {
        this.cables.forEach(cable => {
            if (cable.startComponent === component || cable.endComponent === component) {
                const index = this.cables.indexOf(cable);
                if (index !== -1) {
                    cable.destroy();
                    this.cables.splice(index, 1);
                    this.updateConnectedStatus(component);
                }
                console.log('cables', this.cables.length);
            }
        });
    }

    private updateConnectedStatus(component: Pc | Switch | Router) {
        
        // If the component is pc, update the switch available ports
        if (component instanceof Pc) {
            this.switches.forEach(switch_ => {
                switch_.ports.forEach((port, index) => {
                    if (port === component) {
                        switch_.disconnectFromPort(index);
                        return;
                    }
                });
            });
        }

        /* If the component is switch:
        if there are pc connected to it, update the pc connected status
        if there are routers connected to it, update the router available ports
         */

        if (component instanceof Switch) {
            console.log('removing switch')
            // Update PCs connected to the removed switch
            component.ports.forEach((port, index) => {
                if (port instanceof Pc) {
                    port.connected = false;
                }
            });
            // Update the switch available ports for connected routers
            this.routers.forEach(router => {
                router.ports.forEach((port, index) => {
                    if (port === component) {
                        router.disconnectFromPort(index);
                        return;
                    }
                });
            });
        }
        /* If the component is router:
        if there are switches connected to it, update the switch available ports
        if there are routers connected to it, update the router available ports
         */

        if (component instanceof Router) {
            // Update the switch available ports for connected switches
            this.switches.forEach(switch_ => {
                switch_.ports.forEach((port, index) => {
                    if (port instanceof Router && port === component) {
                        switch_.disconnectFromPort(index);
                        return;
                    }
                });
            });
    
            // Update the router available ports for connected routers
            this.routers.forEach(router => {
                router.ports.forEach((port, index) => {
                    if (port === component) {
                        router.disconnectFromPort(index);
                        return;
                    }
                });
            });
        }
    }

    /******************************************************************

                                ** ZOOM **

    ********************************************************************/
    private zoom(pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) {
        let newZoom: number;
        if (deltaY < 0) {
            newZoom = this._zoom * 1.1; // zoom in
        } else {
            newZoom = this._zoom / 1.1; // zoom out
        }
        this._zoom = Phaser.Math.Clamp(newZoom, 0.6, 2);
        this.cameras.main.setZoom(this._zoom);
    }

    /******************************************************************
     * 
                        ** ADD CABLES **

    ********************************************************************/
    private addCable() {
        if (this.isBeingAddedToCanvas) {
            return;
        }
                        
        const createCable = (pointer: Phaser.Input.Pointer) => {
        const componentUnderPointer = this.getComponentUnderPointer(pointer);
                        
        if (!this.cableStartType) { // STARTING POINT    
            if (componentUnderPointer) {
                if (componentUnderPointer instanceof Pc && componentUnderPointer.connected) {
                    console.log('Pc already connected');
                    return;
                }
                componentUnderPointer?.displayPorts();
                this.startCable(componentUnderPointer, pointer);
                }
            } else { // ENDING POINT
                const lastCable = this.cables[this.cables.length - 1];
                if (lastCable.startComponent) {
                    if (componentUnderPointer && this.isValidConnection(componentUnderPointer, lastCable.startComponent)) {
                        componentUnderPointer?.displayPorts();
                        this.finishCable(componentUnderPointer, lastCable);
                    } else {
                        console.log('Could not connect to anything or the same component');
                        this.cancelCableAdding(lastCable);
                    }
                }
            }
        };
                        
        this.input.on('pointerdown', createCable);

    }
                        
    private getComponentUnderPointer(pointer: Phaser.Input.Pointer) {
        return this.pc.find(pc => pc.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.switches.find(switch_ => switch_.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.routers.find(router => router.image.getBounds().contains(pointer.worldX, pointer.worldY));
    }
                        
    private startCable(component: Pc | Switch | Router, pointer: Phaser.Input.Pointer) {
        this.cableStartType = component;
        const cable = new Cable(this, { x: component.image.x, y: component.image.y });
        this.cables.push(cable);
        cable.startComponent = component;
        console.log(this.cables.length);
                        
        if (component instanceof Pc) {
            this.setComponentConnected(component);
        }
                        
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            cable.EndCoordinates({ x: pointer.worldX, y: pointer.worldY });
        });
    }
                        
    private isValidConnection(component: Pc | Switch | Router, startComponent: Pc | Switch | Router): boolean {
        if (startComponent === component) return false;
        if (startComponent instanceof Pc && component instanceof Router) return false;
        if (startComponent instanceof Router && component instanceof Pc) return false;
        if (startComponent instanceof Switch && component instanceof Switch) return false;
        if (startComponent instanceof Pc && component instanceof Pc) return false;
        if (component instanceof Pc && component.connected) return false;
        return this.checkAvailablePorts(component);
    }
                        
    private finishCable(component: Pc | Switch | Router, cable: Cable) {
        cable.EndCoordinates({ x: component.image.x, y: component.image.y });
        cable.endComponent = component;
        cable.stopAnimation();
        this.isBeingAddedToCanvas = false;
        this.cableStartType = undefined;
        this.input.off('pointermove');
        this.input.off('pointerdown');
        this.setComponentConnected(component);
    }
                        
    private cancelCableAdding(cable: Cable) {
        this.quitComponentConnections(cable);
        this.quitCableAdding(cable);
    }
                        
    private quitComponentConnections(cable: Cable) {
        [cable.startComponent, cable.endComponent].forEach(component => {
            if (component instanceof Pc) {
                component.connected = false;
            } else if (component) {
                component.ports.forEach((port, index) => {
                    if (port === cable.startComponent || port === cable.endComponent) {
                        component.disconnectFromPort(index);
                    }
                });
            }
        });
    }
                        
    private setComponentConnected(component: Pc | Switch | Router) {
        if (component instanceof Pc) {
            component.connected = true;
        }
    }
                        
    private quitCableAdding(cable: Cable) {
        const index = this.cables.indexOf(cable);
        if (index !== -1) {
            this.cables.splice(index, 1);
        }
        cable.destroy();
        this.isBeingAddedToCanvas = false;
        this.cableStartType = undefined;
        this.input.off('pointermove');
        this.input.off('pointerdown');
    }
                        
    private checkAvailablePorts(component: Router | Switch | Pc) {
        if (component instanceof Pc) {
            return true;
        }
        return component.ports.some(port => port === null);
    }
                        
    /******************************************************************
     * 
                        ** ADD COMPONENTS **

    ********************************************************************/
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

        if(component === 'router'){
            const router_ = new Router(this, this.routers.length, this.add.image(0, 0, 'router_component').setInteractive({ draggable: true }));
            this.routers.push(router_);
            console.log('routers', this.routers.length)
            return router_;
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
                }
            });
        }
    }


    /******************************************************************
     * 
                        ** Overlay Div Properties **

    ********************************************************************/

}







