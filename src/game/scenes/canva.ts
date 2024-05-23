import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc, Switch, Cable, Router} from '../components/netComponents';
import { off } from 'process';
import { start } from 'repl';
import { ComponentNoneIcon } from '@radix-ui/react-icons';

export class canva extends Scene
{   
    private _zoom: number = 1;
    private pc: Pc[] = [];
    private switches: Switch[] = [];
    private routers: Router[] = [];
    private cables: Cable[] = [];
    private isBeingAddedToCanvas: boolean = false;
    private cableInProgress: Cable | null = null;
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
                this.removeConnections(component);
                this.pc.splice(index, 1);
                this.updateIdentifiers(this.pc); // Update identifiers for PCs
            }
            return;
        }
        if (component instanceof Switch) {
            const index = this.switches.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeConnections(component);
                this.switches.splice(index, 1);
                this.updateIdentifiers(this.switches); // Update identifiers for Switches
            }
            return;
        }
        if (component instanceof Router) {
            const index = this.routers.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeConnections(component);
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
                    this.updatePortsAvailability(component);
                }
                console.log('cables', this.cables.length);
            }
        });
    }*/

    private removeConnections(component: Pc | Switch | Router){
        console.log('removing connections', component)
        if(component instanceof Pc){
            component.ports.forEach((port, index) => {
                if(port instanceof Switch){
                    this.removeCable(port);
                }
            });
        }

        if(component instanceof Switch){
            component.ports.forEach((port, index) => {
                if(port.object instanceof Pc){
                    this.removeCable(port.object);
                }
                if(port.object instanceof Router){
                    this.removeCable(port.object);
                }
            });
        }

        if(component instanceof Router){
            component.ports.forEach((port, index) => {
                if(port instanceof Switch){
                    this.removeCable(port);
                }
                if(port instanceof Router){
                    this.removeCable(port);
                }
            });
        }

        console.log(this.cables)

    }

    private removeCable(component : Pc | Switch | Router){
        this.cables.forEach(cable => {
            if(cable.startComponent === component || cable.endComponent === component){
                const index = this.cables.indexOf(cable);
                if(index !== -1){
                    cable.destroy();
                    this.cables.splice(index, 1);
                    this.updatePortsAvailability(component);
                }
            }
        });
    }

    private updatePortsAvailability(component: Pc | Switch | Router) {
        // ***  this method is used for updating the ports between a connection ****

        // update pc ports availability and switch ports availability        
        if (component instanceof Pc) {
            this.switches.forEach(switch_ => {
                switch_.ports.forEach((port, index) => {
                    if (port.object instanceof Pc && port.object === component) {
                        switch_.disconnectFromPort(index);
                        component.disconnectFromPort(0);
                        return;
                    }
                });
            });
        }

        /* If the component is switch:
        if there are pc connected to it, update the pc connected status
        if there are routers connected to it, update the router available ports
        also update the switch's available ports 
         */

        if (component instanceof Switch) {
            console.log(component)
            // Update PCs connected to the removed switch
            component.ports.forEach((port, index) => {
                if (port.object instanceof Pc) {
                    port.object.ports[0] = null;
                    component.disconnectFromPort(index);
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
        console.log(this.switches[0])
    }

    /******************************************************************
     * 
                        ** ADD CABLES **

    ********************************************************************/

    /*private addCable() {
        if (this.isBeingAddedToCanvas) {
            return;
        }
                        
        let message = 'Adding Cable. Press Escape to abort.';
        EventBus.emit('showAlert', message);
        this.isBeingAddedToCanvas = true;
                        
        const handleCableMove = (pointer: Phaser.Input.Pointer) => {
            if (this.cableInProgress) {
                this.cableInProgress.updateEndCoordinates({ x: pointer.worldX, y: pointer.worldY });
            }
        };
                        
        const handleCableCreation = (pointer: Phaser.Input.Pointer) => {

            const component = this.getComponentUnderPointer(pointer);
            
            if (component) {
                if (!this.cableInProgress) {// Start cable creation
                    component.isAconnectionBeingEstablished = true;
                    EventBus.emit('showAlert', message);
                    if(this.checkPortsAvailability(component) === false){ // check if the component has an available port
                        EventBus.emit('showAlert', 'No available ports. Press Escape to abort.');
                    }else{
                        EventBus.emit('showAlert', message);
                        component.displayPorts(this.input.activePointer);
                        this.cableInProgress = new Cable(this, this.cables.length, { x: component.image.x, y: component.image.y });
                        this.cableInProgress.setStartComponent(component);
                        
                        // Listen for port selection on start component
                        EventBus.once('selectedPort', (key: number) => {
                            component.isAconnectionBeingEstablished = true;
                            component.targetPort = key;
                            console.log(`Start port selected: ${key}`);
                        });
                    }
                } else {// Finalize cable creation

                    // Check if the connection is valid
                    if (this.invalidConnections(this.cableInProgress.startComponent, component)) {
                        EventBus.emit('showAlert', 'Invalid connection. Press Escape to abort.');

                    // Check if the ports are available
                    }else if(this.checkPortsAvailability(component) === false){
                        EventBus.emit('hideAlert');
                        EventBus.emit('showAlert', 'No available ports. Press Escape to abort.');
                    
                    // Everything is fine, continue with the cable creation
                    }else{
                        component.displayPorts(this.input.activePointer);
                        this.cableInProgress.setEndComponent(component);
                        this.cableInProgress.updateEndCoordinates({ x: component.image.x, y: component.image.y });
                            
                        // Listen for port selection on end component
                        EventBus.once('selectedPort', (key: number) => {
                            component.isAconnectionBeingEstablished = true;
                            component.targetPort = key;
                            console.log(`End port selected: ${key}`);
                                
                            // Update component connections and finish cable creation
                            if(this.cableInProgress){
                                this.updateComponentConnections(this.cableInProgress);
                            }
                            this.cableInProgress = null;
                            this.isBeingAddedToCanvas = false;
                            EventBus.emit('hideAlert');
                                
                            // Clean up event listeners
                            this.input.off('pointermove', handleCableMove);
                            this.input.off('pointerdown', handleCableCreation);
                        });
                    }
                }
            }
        };
                        
        window.addEventListener('pointerdown', () => {handleCableCreation});
        this.input.on('pointermove', handleCableMove);
                        
        //Cancel cable creation on ESC key press
        this.input.keyboard?.on('keydown-ESC', () => {
            if (this.cableInProgress) {
                if(this.cableInProgress.startComponent){
                    this.cableInProgress.startComponent.isAconnectionBeingEstablished = false;
                }
                if(this.cableInProgress.endComponent){
                    this.cableInProgress.endComponent.isAconnectionBeingEstablished = false;
                }
                this.cableInProgress.destroy();
            }
            this.cableInProgress = null;
            this.isBeingAddedToCanvas = false;
            EventBus.emit('hideAlert');
            this.input.off('pointermove', handleCableMove);
            this.input.off('pointerdown', handleCableCreation);
        });
    }*/

    private addCable() {

        if (this.isBeingAddedToCanvas) {
            return;
        }
                        
        let message = 'Adding Cable. Press Escape to abort.';
        EventBus.emit('showAlert', message);
        this.isBeingAddedToCanvas = true;
                        
        const handleCableMove = (pointer: Phaser.Input.Pointer) => {
            if (this.cableInProgress) {
                this.cableInProgress.updateEndCoordinates({ x: pointer.worldX, y: pointer.worldY });
            }
        };

        const handleCableCreation = (pointer: Phaser.Input.Pointer) => {

            const component = this.getComponentUnderPointer(pointer);

            if(component){
                
                this.makeComponentsUndraggable();

                if(!this.cableInProgress){// Start cable creation
                    if(this.checkPortsAvailability(component) === false){ // check if the component has an available port
                        EventBus.emit('showAlert', 'No available ports. Press Escape to abort.');
                    }else{
                        component.displayPorts(this.input.activePointer);
                        EventBus.once('selectedPort', (key: number) => {
                            this.cableInProgress = new Cable(this, this.cables.length, { x: component.image.x, y: component.image.y });
                            this.cableInProgress.setStartComponent(component);
                            this.cableInProgress.updateEndCoordinates({ x: component.image.x, y: component.image.y });
                            component.targetPort = key;
                            EventBus.emit('showAlert', message);
                        });
                    }

                }else{
                    if(this.checkPortsAvailability(component) === false){
                        EventBus.emit('showAlert', 'No available ports. Press Escape to abort.');
                    } else if (this.invalidConnections(this.cableInProgress.startComponent, component)) {
                        EventBus.emit('showAlert', 'Invalid connection. Press Escape to abort.');
                    }else{
                        component.displayPorts(this.input.activePointer);
                        this.cableInProgress.setEndComponent(component);
                        this.cableInProgress.updateEndCoordinates({ x: component.image.x, y: component.image.y });
                            
                        // Listen for port selection on end component
                        EventBus.once('selectedPort', (key: number) => {
                            component.targetPort = key;
                            console.log(`End port selected: ${key}`);
                                
                            // Update component connections and finish cable creation
                            if(this.cableInProgress){
                                this.updateComponentConnections(this.cableInProgress); // Update the connections between components
                                this.cables.push(this.cableInProgress); // Add the cable to the cables array
                            }
                            this.cableInProgress = null;
                            this.isBeingAddedToCanvas = false;
                            EventBus.emit('hideAlert');

                            this.makeComponentsDraggable();
                                
                            // Clean up event listeners
                            this.input.off('pointermove', handleCableMove);
                            this.input.off('pointerdown', handleCableCreation);
                        });
                    }
                }  
            }
        };

        this.input.on('pointerdown', handleCableCreation);
        this.input.on('pointermove', handleCableMove);

        //Cancel cable creation on ESC key press
        this.input.keyboard?.on('keydown-ESC', () => {
            if (this.cableInProgress) {
                this.cableInProgress.destroy();
            }

            this.makeComponentsDraggable();
            this.cableInProgress = null;
            this.isBeingAddedToCanvas = false;
            EventBus.emit('hideAlert');
            this.input.off('pointermove', handleCableMove);
            this.input.off('pointerdown', handleCableCreation);
        });
    }

    private makeComponentsUndraggable() {
        this.pc.forEach(pc => {
            pc.image.disableInteractive();
        });
        this.switches.forEach(switch_ => {
            switch_.image.disableInteractive();
        });
        this.routers.forEach(router => {
            router.image.disableInteractive();
        });
    }

    private makeComponentsDraggable() {
        this.pc.forEach(pc => {
            pc.image.setInteractive({ draggable: true, useHandCursor: true });
        });
        this.switches.forEach(switch_ => {
            switch_.image.setInteractive({ draggable: true, useHandCursor: true });
        });
        this.routers.forEach(router => {
            router.image.setInteractive({ draggable: true, useHandCursor: true });
        });
    }
            
    private getComponentUnderPointer(pointer: Phaser.Input.Pointer) {
        return this.pc.find(pc => pc.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.switches.find(switch_ => switch_.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.routers.find(router => router.image.getBounds().contains(pointer.worldX, pointer.worldY));
    }

    private invalidConnections(startComponent: Pc | Switch | Router, endComponent: Pc | Switch | Router) {
        if ((startComponent instanceof Pc && endComponent instanceof Router) ||
            (startComponent instanceof Router && endComponent instanceof Pc) ||
            (startComponent instanceof Switch && endComponent instanceof Switch) ||
            (startComponent instanceof Pc && endComponent instanceof Pc)) {
            console.log('Invalid connection');
            return true;
        }
    }

    private checkPortsAvailability(component: Pc | Switch | Router) {
        if (component instanceof Pc) {
            return component.ports[0] === null;
        }
        if (component instanceof Switch) {
            return component.ports.some(port => port.object === null);
        }
        if (component instanceof Router) {
            return component.ports.some(port => port === null);
        }
    }

    private updateComponentConnections(cable: Cable) {
        const startComponent = cable.startComponent;
        const endComponent = cable.endComponent;

        console.log('startComponet port', startComponent.targetPort);
        console.log('endComponent port', endComponent.targetPort);

        if(startComponent){
            if (startComponent instanceof Pc) {
                if(endComponent instanceof Switch){
                    console.log('PC to Switch');
                    startComponent.ports[0] = endComponent;
                    endComponent.ports[endComponent.targetPort].object = startComponent;
                }
            } else if (startComponent instanceof Switch) {
                if(endComponent instanceof Pc){
                    startComponent.ports[startComponent.targetPort].object = endComponent;
                    endComponent.ports[0] = startComponent;
                }
                if(endComponent instanceof Router){
                    startComponent.ports[startComponent.targetPort].object = endComponent;
                    endComponent.ports[endComponent.targetPort] = startComponent;
                }
            } else if (startComponent instanceof Router) {
                if(endComponent instanceof Switch){
                    startComponent.ports[startComponent.targetPort] = endComponent;
                    endComponent.ports[endComponent.targetPort].object = startComponent;
                }
                if(endComponent instanceof Router){
                    startComponent.ports[startComponent.targetPort] = endComponent;
                    endComponent.ports[endComponent.targetPort] = startComponent;
                }
            }
        }

        console.log('startComponent', startComponent);
        console.log('endComponent', endComponent);
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







