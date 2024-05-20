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
        EventBus.on('deleteComponent', (data: {x: number, y: number, obj: string, id: number}) => { 
            this.deleteComponentFromMenu(data); 
        });

        EventBus.on('addCable', () => {this.addCable(); this.isBeingAddedToCanvas = true;});

        // Delete component on key press
        /*this.input.keyboard?.on('keydown-BACKSPACE', () => {

            EventBus.emit('showAlertDialog');

            const x = this.input.activePointer.worldX;
            const y = this.input.activePointer.worldY;

            EventBus.on('confirmDeletion', () => {
                this.pc.forEach(pc => {
                    if (pc.image.getBounds().contains(x, y)) {
                        console.log('delete pc');
                        this.removeComponent(pc);
                    }
                });
                this.switches.forEach(switch_ => {
                    if (switch_.image.getBounds().contains(x, y)) {
                        this.removeComponent(switch_);
                    }
                });
                this.routers.forEach(router => {
                    if (router.image.getBounds().contains(x, y)) {
                        this.removeComponent(router);
                    }
                });
            });
        });*/

        //this.createPortDomElement();
    }

    /******************************************************************
     * 
                        ** REMOVE COMPONENTS **

    ********************************************************************/
    private deleteComponentFromMenu(data: {x: number, y: number, obj: string, id: number}) {

        EventBus.emit('showAlertDialog', data);

        EventBus.once('confirmDeletion', () => {
            switch(data.obj){
                case 'Pc':
                    this.pc.forEach(pc => {
                        if (pc.identifier === data.id) {
                            this.removeComponent(pc);
                            return;
                        }
                    });
                    break;
                case 'Switch':
                    this.switches.forEach(switch_ => {
                        if (switch_.identifier === data.id) {
                            this.removeComponent(switch_);
                            return;
                        }
                    });
                    break;
                case 'Router':
                    this.routers.forEach(router => {
                        if (router.identifier === data.id) {
                            this.removeComponent(router);
                            return;
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }

    private removeComponent(component: Pc | Switch | Router) {
        if (component instanceof Pc) {
            const index = this.pc.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                //this.removeCable(component);
                this.pc.splice(index, 1);
                this.updateIdentifiers(this.pc); // Update identifiers for PCs
            }
            return;
        }
        if (component instanceof Switch) {
            const index = this.switches.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                //this.removeCable(component);
                this.switches.splice(index, 1);
                this.updateIdentifiers(this.switches); // Update identifiers for Switches
                this.updateConnectedStatus(component);
            }
            return;
        }
        if (component instanceof Router) {
            const index = this.routers.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                //this.removeCable(component);
                this.routers.splice(index, 1);
                this.updateIdentifiers(this.routers); // Update identifiers for Routers
            }
            return;
        }
    }

    private updateIdentifiers(components: (Pc | Switch | Router)[]) {
        components.forEach((component, index) => {
            component.identifier = index; // Update the identifier
            if (component instanceof Pc) {
                component.text.setText(`PC ${component.identifier}`); // Update the text for PCs
            } else if (component instanceof Switch) {
                component.text.setText(`Switch ${component.identifier}`); // Update the text for Switches (assuming they have similar text handling)
            } else if (component instanceof Router) {
                component.text.setText(`Router ${component.identifier}`); // Update the text for Routers (assuming they have similar text handling)
            }
        });
    }
    
    private destroyComponentGraphics(component: Pc | Switch | Router) {   
        component.image.destroy();
        component.dragBox.destroy();
        component.clickbox.destroy();
        component.text.destroy();
    }

    /*
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
    }*/

    private updateConnectedStatus(component: Pc | Switch | Router) {
        
        // If the component is pc, update the switch available ports
        if (component instanceof Pc) {
            this.switches.forEach(switch_ => {
                switch_.ports.forEach((port, index) => {
                    if (port.object instanceof Pc && port.object === component) {
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
            // Update PCs connected to the removed switch
            component.ports.forEach((port, index) => {
                if (port.object instanceof Pc) {
                    port.object.ports[0] = null;
                }
            });
            // Update the switch available ports for connected routers
            this.routers.forEach(router => {
                router.ports.forEach((port, index) => {
                    if (port instanceof Switch && port === component) {
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

        let message = 'Adding Cable. Press Escape to abort.';
        EventBus.emit('showAlert', message);

        const handleCableCreation = (pointer: Phaser.Input.Pointer) => {

            const component = this.getComponnetUnderPointer(pointer);

            if (component) {
                component.isAconnectionBeingEstablished = true;
                component.displayPorts(this.input.activePointer);
            }

        }

        this.input.on('pointerdown', handleCableCreation);

    }

    private getComponnetUnderPointer(pointer: Phaser.Input.Pointer) {
        return this.pc.find(pc => pc.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.switches.find(switch_ => switch_.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.routers.find(router => router.image.getBounds().contains(pointer.worldX, pointer.worldY));
    }

    /******************************************************************
     * 
                        ** ADD COMPONENTS **

    ********************************************************************/
    private createComponent(component: string){
        switch(component) {
            case 'pc':
                const pc_ = new Pc(this, this.pc.length, this.add.image(0, 0, 'pc_component').setInteractive({ draggable: true, useHandCursor: true }));
                this.pc.push(pc_);
                console.log('pcs', this.pc.length);
                return pc_;
            case 'switch':
                const switch_ = new Switch(this, this.switches.length, this.add.image(0, 0, 'switch_component').setInteractive({ draggable: true, useHandCursor: true }));
                this.switches.push(switch_);
                console.log('switches', this.switches.length);
                return switch_;
            case 'router':
                const router_ = new Router(this, this.routers.length, this.add.image(0, 0, 'router_component').setInteractive({ draggable: true, useHandCursor: true }));
                this.routers.push(router_);
                console.log('routers', this.routers.length);
                return router_;
            default:
                return null;
        }
    }

    private addComponent(component: string) {
        if (this.isBeingAddedToCanvas) {
            return;
        }
    
        const createdComponent = this.createComponent(component);
    
        if (createdComponent) {

            let message = '';
    
            if (createdComponent instanceof Pc) {
                message = 'Adding PC. Press Escape to abort.';
            } else if (createdComponent instanceof Switch) {
                message = 'Adding Switch. Press Escape to abort.';
            } else if (createdComponent instanceof Router) {
                message = 'Adding Router. Press Escape to abort.';
            }
    
            EventBus.emit('showAlert', message);

            const handlePointerMove = (pointer: Phaser.Input.Pointer) => {
                if (this.isBeingAddedToCanvas) {
                    createdComponent.image.setPosition(pointer.worldX, pointer.worldY);
                }
            };
    
            const handlePointerDown = (pointer: Phaser.Input.Pointer) => {
                if (pointer.leftButtonDown()) {
                    this.isBeingAddedToCanvas = false;
                    EventBus.emit('hideAlert');
                    this.input.off('pointermove', handlePointerMove);
                    this.input.off('pointerdown', handlePointerDown);
                    this.input.keyboard?.off('keydown-ESC', handleEscape);
                }
            };
    
            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    this.isBeingAddedToCanvas = false;
                    EventBus.emit('hideAlert');
                    this.removeComponent(createdComponent);
                    this.input.off('pointermove', handlePointerMove);
                    this.input.off('pointerdown', handlePointerDown);
                    this.input.keyboard?.off('keydown-ESC', handleEscape);
                    // Remove the component since the addition is aborted
                }
            };
            this.input.on('pointermove', handlePointerMove);
            this.input.on('pointerdown', handlePointerDown);
            this.input.keyboard?.on('keydown-ESC', handleEscape);
            this.isBeingAddedToCanvas = true;
        }
    }
    
    /******************************************************************
     * 
                        ** Overlay Div Properties **

    ********************************************************************/

}







