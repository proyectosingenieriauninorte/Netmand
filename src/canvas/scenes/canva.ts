import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Pc, Switch, Cable, Router} from '../components/netComponents';
import { NetworkData, saveCanvas, openCanvasProject} from '@/requests/requests';

export class canva extends Scene
{   
    private _zoom: number = 1;
    private pc: Pc[] = [];
    private switches: Switch[] = [];
    private routers: Router[] = [];
    private cables: Cable[] = [];
    private vlans: string[] = [];
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
        //this.input.on('pointerdown', this.componentDropMenu.bind(this));
        EventBus.on('addPc', () => {this.addComponent('pc'); this.isBeingAddedToCanvas = true;});
        EventBus.on('addSwitch', () => {this.addComponent('switch'); this.isBeingAddedToCanvas = true;});
        EventBus.on('addRouter', () => {this.addComponent('router'); this.isBeingAddedToCanvas = true;});
        EventBus.on('deleteComponent', (data: {x: number, y: number, obj: string, id: number}) => { 
            this.deleteComponentFromMenu(data); 
        });
        EventBus.on('buildJson',this.buildJson.bind(this));
        EventBus.on('addCable', () => {this.addCable(); this.isBeingAddedToCanvas = true;});
        EventBus.on('sliderChange', (value: number) => {
            // Map the slider value (0-100) to the zoom range (0.6-2)
            const newZoom = Phaser.Math.Linear(0.6, 2, value / 100);
            this._zoom = newZoom;
            this.cameras.main.setZoom(this._zoom);
        });

        EventBus.on('displayComponentProperties', (data: {id: number, type: string}) => {

            switch(data.type){
                case 'Pc':
                    this.pc.forEach(pc => {
                        if(pc.identifier === data.id){
                            pc.showPcProperties();
                            return;
                        }
                    });
                    break;
                case 'Switch':
                    this.switches.forEach(switch_ => {
                        if(switch_.identifier === data.id){
                            switch_.showSwitchProperties();
                            EventBus.emit('vlans', this.vlans);
                            return;
                        }
                    });
                    break;
                case 'Router':
                    this.routers.forEach(router => {
                        if(router.identifier === data.id){
                            router.showRouterProperties();
                            EventBus.emit('vlans', this.vlans);
                            return;
                        }
                    });
                    break;
                default:
                    break;
            }
        });

        EventBus.on('savePcData', (data: {ip: string, mask: string, red: string,  gateway: string, identifier: string, type: string}) => {
            this.pc.forEach(pc => {
                if(pc.identifier === parseInt(data.identifier)){
                    pc.updateProperties(data);
                    return;
                }
            });
        });

        EventBus.on('saveSwitchData', (data: {ports: { object: Pc | Router | null; vlan: string; speed: string; duplex: string; description: string; status: string; mode: string }[], identifier: string
                    ,message: string, hostname: string}) => {
            this.switches.forEach(switch_ => {
                if(switch_.identifier === parseInt(data.identifier)){
                    switch_.updateProperties(data);
                    return;
                }
            });
        });

        EventBus.on('updateVlans' ,(vlans: string[]) => {
            this.vlans = vlans;
        });

        EventBus.on('saveRouterData', (data: { ports: { object: Switch | Router | null; speed: string; duplex: string; description: string; status: string; net: string; interface_ip: string; interface_mask: string; dot1q: { vlan: string; ip: string; mask: string }[] }[], 
            identifier: string; message: string; hostname: string; rip: string;}) =>{
                this.routers.forEach(router =>{
                    if(router.identifier === parseInt(data.identifier)){
                        router.updateProperties(data)
                        return;
                    }         
                });
        });
        
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => {
            if (pointer.event.ctrlKey) {
                this.zoom(pointer, gameObjects, deltaX, deltaY);
            }
        });

        // Event listener for deleting a cable
        EventBus.on('confirmDeletion', () => {
            this.cables.forEach(cable => {
                if(cable.selected){
                    this.removeCable(cable.startComponent);
                    return;
                }
            });
        });

        EventBus.on('updateCommands', () => {
            EventBus.emit('getCommands', this.buildJson())
        });

        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                this.saveWorkspace();
            }
        });

        EventBus.on('saveWork', this.saveWorkspace.bind(this));
        this.openProject();
    }

    private saveWorkspace(){
        var urlParams = new URLSearchParams(window.location.search);
        var name = urlParams.get('name');
        console.log(name);
        if(name){
            saveCanvas(this.buildJson(), name)
        }

        EventBus.emit('showAlert', 'Project saved successfully!');
        setTimeout(() => {
            EventBus.emit('hideAlert');
        }, 3000);
    }

    private openProject(){
        var urlParams = new URLSearchParams(window.location.search);
        var name = urlParams.get('name');

        if(name){
            openCanvasProject(name)
            .then((data) => {
                console.log('data a dibujar xd', data);
                this.drawCanvasComponent(data.doc);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });

            EventBus.emit('showAlert', 'Project loaded successfully');
            setTimeout(() => {
                EventBus.emit('hideAlert');
            }, 3000);
        }
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
                this.removeCable(component);
                this.pc.splice(index, 1);
                this.updateIdentifiers(this.pc); // Update identifiers for PCs
            }
            return;
        }
        if (component instanceof Switch) {
            const index = this.switches.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeCable(component);
                this.switches.splice(index, 1);
                this.updateIdentifiers(this.switches); // Update identifiers for Switches
            }
            return;
        }
        if (component instanceof Router) {
            const index = this.routers.indexOf(component);
            if (index !== -1) {
                this.destroyComponentGraphics(component);
                this.removeCable(component);
                this.routers.splice(index, 1);
                this.updateIdentifiers(this.routers); // Update identifiers for Routers
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

    private removeCable(component: Pc | Switch | Router | null) {
        const cablesToRemove = this.cables.filter(cable => 
            cable.startComponent === component || cable.endComponent === component
        );
    
        cablesToRemove.forEach(cable => {
            const startComponent = cable.startComponent;
            const endComponent = cable.endComponent;
    
            // Remove the cable
            const index = this.cables.indexOf(cable);
            if (index !== -1) {
                this.cables.splice(index, 1);
                cable.destroy();
            }
    
            // Update port availability for both components
            this.updatePortsAvailability(startComponent, endComponent);
            this.updatePortsAvailability(endComponent, startComponent);
        });

        //update cable idenifiers
        this.cables.forEach((cable, index) => {
            cable.identifier = index;
        });

    }

    private updatePortsAvailability(startComponent: Pc | Switch | Router | null , endComponent: Pc | Switch | Router | null ) {

        /* 
        If the startComponent is a PC, then we need to update the port availability 
        for the switch it is connected to.
        */
        if(startComponent instanceof Pc){
           if(endComponent instanceof Switch){
                endComponent.ports.forEach(port => {
                    if(port.object === startComponent){
                        port.object = null;
                        return;
                    }
                });
            }
        }
        /*
        If the startComponent is a Switch, then we need to update the port availability
        of the pc or Router it is connected to. 
        */
        if(startComponent instanceof Switch){
            if(endComponent instanceof Pc){
                endComponent.ports[0] = null;
            }
            if(endComponent instanceof Router){
                endComponent.ports.forEach((port, index)  => {
                    if(port.object === startComponent){
                        endComponent.ports[index].object = null;
                        return;
                    }
                });
            }
        }

        if(startComponent instanceof Router){
            if(endComponent instanceof Switch){
                endComponent.ports.forEach((port, index) => {
                    if(port.object === startComponent){
                        endComponent.ports[index].object = null;
                    }
                });
            }
            if(endComponent instanceof Router){
                endComponent.ports.forEach((port, index) => {
                    if(port.object === startComponent){
                        endComponent.ports[index].object = null;
                    }
                });
            }
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

        // Calculate the proportional slider value
        const sliderValue = Phaser.Math.Linear(0, 100, (this._zoom - 0.6) / (2 - 0.6));
        
        EventBus.emit('updateSlider', sliderValue);
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
        this.isBeingAddedToCanvas = true;
                        
        const handleCableMove = (pointer: Phaser.Input.Pointer) => {
            if (this.cableInProgress) {
                this.cableInProgress.updateEndCoordinates({ x: pointer.worldX, y: pointer.worldY });
            }
        };

        this.makeComponentsUndraggable();

        const handleCableCreation = (pointer: Phaser.Input.Pointer) => {

            const component = this.getComponentUnderPointer(pointer);

            if(component){

                if(!this.cableInProgress){// Start cable creation
                    if(this.checkPortsAvailability(component) === false){ // check if the component has an available port
                        EventBus.emit('showAlert', 'No available ports. Press Escape to abort.');
                    }else{
                        component.displayPorts(this.input.activePointer);
                        EventBus.once('selectedPort', (key: number) => {
                            if (this.cableInProgress) {
                                this.cableInProgress.setStartComponent(component);
                                this.cableInProgress.updateStartCoordinates({ x: component.image.x, y: component.image.y });
                                this.cableInProgress.updateEndCoordinates({ x: component.image.x, y: component.image.y });
                                this.cableInProgress.isSomethingBeingAdded = true;
                                return; // Prevent multiple cables from being created
                            }
                            this.cableInProgress = new Cable(this, this.cables.length, { x: component.image.x, y: component.image.y });
                            this.cableInProgress.setStartComponent(component);
                            this.cableInProgress.updateEndCoordinates({ x: component.image.x, y: component.image.y });
                            this.cableInProgress.isSomethingBeingAdded = true;
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

        const handleCancel = () => {
            if (this.cableInProgress) {
                this.cableInProgress.destroy();
            }

            this.makeComponentsDraggable();
            this.cableInProgress = null;
            this.isBeingAddedToCanvas = false;
            EventBus.emit('hideAlert');
            this.input.off('pointermove', handleCableMove);
            this.input.off('pointerdown', handleCableCreation);
        }

        //Cancel cable creation on ESC key press
        this.input.keyboard?.on('keydown-ESC', () => {
           handleCancel();
        });

        EventBus.once('abortCable', () => {
            handleCancel();
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
        this.cables.forEach(cable => {
            cable.isSomethingBeingAdded = true;
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
        this.cables.forEach(cable => {
            cable.isSomethingBeingAdded = false;
        });
    }
            
    private getComponentUnderPointer(pointer: Phaser.Input.Pointer) {
        return this.pc.find(pc => pc.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.switches.find(switch_ => switch_.image.getBounds().contains(pointer.worldX, pointer.worldY)) ||
                            this.routers.find(router => router.image.getBounds().contains(pointer.worldX, pointer.worldY));
    }

    private invalidConnections(startComponent: Pc | Switch | Router | null, endComponent: Pc | Switch | Router| null) {
        if ((startComponent instanceof Pc && endComponent instanceof Router) ||
            (startComponent instanceof Router && endComponent instanceof Pc) ||
            (startComponent instanceof Switch && endComponent instanceof Switch) ||
            (startComponent instanceof Pc && endComponent instanceof Pc)) {
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
            return component.ports.some(port => port.object === null);
        }
    }

    private updateComponentConnections(cable: Cable) {
        const startComponent = cable.startComponent;
        const endComponent = cable.endComponent;

        if(startComponent){
            if (startComponent instanceof Pc) {
                if(endComponent instanceof Switch){
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
                    endComponent.ports[endComponent.targetPort].object = startComponent;
                }
            } else if (startComponent instanceof Router) {
                if(endComponent instanceof Switch){
                    startComponent.ports[startComponent.targetPort].object = endComponent;
                    endComponent.ports[endComponent.targetPort].object = startComponent;
                }
                if(endComponent instanceof Router){
                    startComponent.ports[startComponent.targetPort].object = endComponent;
                    endComponent.ports[endComponent.targetPort].object = startComponent;
                }
            }
        }

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
                return pc_;
            case 'switch':
                const switch_ = new Switch(this, this.switches.length, this.add.image(0, 0, 'switch_component').setInteractive({ draggable: true, useHandCursor: true }));
                this.switches.push(switch_);
                return switch_;
            case 'router':
                const router_ = new Router(this, this.routers.length, this.add.image(0, 0, 'router_component').setInteractive({ draggable: true, useHandCursor: true }));
                this.routers.push(router_);
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
    private buildJson(){

        const pcs = this.pc.map(pc => ({
            x: pc.image.x, // x coordinate
            y: pc.image.y, // y coordinate
            textx: pc.text.x, // x coordinate of the text
            texty: pc.text.y, // y coordinate of the text
            identifier: pc.identifier, // identifier
            text: pc.text.text, // text
            ports: {
                object_id: pc.ports[0]?.identifier, 
                type: pc.ports[0] ? pc.ports[0].constructor.name : null}, // object_id and type
            mask: pc.mask, // mask
            ip: pc.ip, // ip
            gateway: pc.gateway // gateway
        }));

        const switches = this.switches.map(switch_ => ({
            x: switch_.image.x, // x coordinate
            y: switch_.image.y, // y coordinate
            textx: switch_.text.x, // x coordinate of the text
            texty: switch_.text.y, // y coordinate of the text
            identifier: switch_.identifier, // identifier
            text: switch_.text.text, 
            ports: switch_.ports.map((port, index) => ({
                object_id: port.object ? port.object.identifier : null, 
                type: port.object ? port.object.constructor.name : null,
                speed: port.speed,
                duplex: port.duplex,
                description: port.description,
                status: port.status,
                mode: port.mode,
                vlan: {
                    "name": "",
                    "id": port.vlan
                },
                name: `FastEthernet0/${index+1}`
                })),
            hostname: switch_.hostname,
            message: switch_.message
        }));

        const routers = this.routers.map(router => ({
            x: router.image.x, // x coordinate
            y: router.image.y, // y coordinate
            textx: router.text.x, // x coordinate of the text
            texty: router.text.y, // y coordinate of the text
            identifier: router.identifier, // identifier
            text: router.text.text, 
            ports: router.ports.map((port, index) => ({
                object_id: port.object ? port.object.identifier : null, 
                type: port.object ? port.object.constructor.name : null,
                speed: port.speed,
                duplex: port.duplex,
                description: port.description,
                status: port.status,
                net: port.net,
                interface_ip: port.interface_ip,
                interface_mask: port.interface_mask,
                dot1q: port.dot1q.map(dot1q => ({
                    vlan: {
                        "name": "",
                        "id": dot1q.vlan
                    },
                    ip: dot1q.ip,
                    mask: dot1q.mask
                })),
                name: `FastEthernet0/${index+1}`
            })),
            hostname: router.hostname,
            message: router.message,
            rip: router.rip
        }));

        const cables = this.cables.map(cable => ({
            startCoordinates: { x: cable.startCoordinates.x, y: cable.startCoordinates.y }, // x and y coordinates
            endCoordinates: { x: cable.endCoordinates.x, y: cable.endCoordinates.y }, // x and y coordinates
            startComponent: {
                type: cable.startComponent ? cable.startComponent.constructor.name : null,
                object_id: cable.startComponent ? cable.startComponent.identifier : null
            }, // identifier
            endComponent:{
                type: cable.endComponent ? cable.endComponent.constructor.name : null,
                object_id: cable.endComponent ? cable.endComponent.identifier : null
            }, // identifier
            identifier: cable.identifier // identifier
        }));
        


        const json = {
            pcs,
            switches,
            routers,
            cables,
            vlans: this.vlans
        };

        console.log('buildJson', json);
        return json;
    }

    private drawCanvasComponent(data: NetworkData) {

        data.pcs.forEach(pc => {
            const pc_ = new Pc(this, pc.identifier, this.add.image(pc.x, pc.y, 'pc_component').setInteractive({ draggable: true, useHandCursor: true }));
            pc_.text.setPosition(pc.textx, pc.texty);
            pc_.identifier = pc.identifier;
            pc_.text.setText(pc.text);
            pc_.mask = pc.mask;
            pc_.ip = pc.ip;
            pc_.gateway = pc.gateway;
            pc_.destroyDragbox();
            this.pc.push(pc_);
        });

        data.switches.forEach(switch_ => {
            const switch__ = new Switch(this, switch_.identifier, this.add.image(switch_.x, switch_.y, 'switch_component').setInteractive({ draggable: true, useHandCursor: true }));
            switch__.text.setPosition(switch_.textx, switch_.texty);
            switch__.identifier = switch_.identifier;
            switch__.text.setText(switch_.text);
            switch__.hostname = switch_.hostname;
            switch__.message = switch_.message;
            switch_.ports.forEach((port, index) => {
                switch__.ports[index].speed = port.speed;
                switch__.ports[index].duplex = port.duplex;
                switch__.ports[index].description = port.description;
                switch__.ports[index].status = port.status;
                switch__.ports[index].mode = port.mode;
                switch__.ports[index].vlan = port.vlan.id;
            });
            switch__.destroyDragbox();
            this.switches.push(switch__);
        });

        data.routers.forEach(router => {
            const router_ = new Router(this, router.identifier, this.add.image(router.x, router.y, 'router_component').setInteractive({ draggable: true, useHandCursor: true }));
            router_.text.setPosition(router.textx, router.texty);
            router_.identifier = router.identifier;
            router_.text.setText(router.text);
            router_.hostname = router.hostname;
            router_.message = router.message;
            router_.rip = router.rip;
            router.ports.forEach((port, index) => {
                router_.ports[index].speed = port.speed;
                router_.ports[index].duplex = port.duplex;
                router_.ports[index].description = port.description;
                router_.ports[index].status = port.status;
                router_.ports[index].net = port.net;
                router_.ports[index].interface_ip = port.interface_ip;
                router_.ports[index].interface_mask = port.interface_mask;
                router_.ports[index].dot1q = port.dot1q.map(dot1q => ({
                    vlan: dot1q.vlan.id,
                    ip: dot1q.ip,
                    mask: dot1q.mask
                }));
            });
            router_.destroyDragbox();
            this.routers.push(router_);
        });

        // Assign ports to the corresponding objects

          // Assign connections to PC ports
        this.pc.forEach(pc => {
            data.pcs.forEach(pcData => {
                this.switches.forEach(switch_ => {
                    if (pcData.ports.object_id === switch_.identifier) {
                        pc.ports[0] = switch_;
                    }
                });
            });
        });

        // Assign connections to Switch ports
        this.switches.forEach(switch_ => {
            data.switches.forEach(switchData => {
                switchData.ports.forEach((port, index) => {
                    if (port.type === 'Pc') {
                        this.pc.forEach(pc => {
                            if (port.object_id === pc.identifier) {
                                switch_.ports[index].object = pc;
                            }
                        });
                    } else if (port.type === 'Router') {
                        this.routers.forEach(router => {
                            if (port.object_id === router.identifier) {
                                switch_.ports[index].object = router;
                            }
                        });
                    }
                });
            });
        });

        // Assign connections to Router ports
        this.routers.forEach(router => {
            data.routers.forEach(routerData => {
                routerData.ports.forEach((port, index) => {
                    if (port.type === 'Switch') {
                        this.switches.forEach(switch_ => {
                            if (port.object_id === switch_.identifier) {
                                router.ports[index].object = switch_;
                            }
                        });
                    } else if (port.type === 'Router') {
                        this.routers.forEach(otherRouter => {
                            if (port.object_id === otherRouter.identifier) {
                                router.ports[index].object = otherRouter;
                            }
                        });
                    }
                });
            });
        });

        // Create and connect cables
        data.cables.forEach(cableData => {
            const startComponent = this.findComponentByIdentifierAndType(cableData.startComponent.type, cableData.startComponent.object_id);
            const endComponent = this.findComponentByIdentifierAndType(cableData.endComponent.type, cableData.endComponent.object_id);
            
            if (startComponent && endComponent) {
                const cable = new Cable(this, cableData.identifier, { x: cableData.startCoordinates.x, y: cableData.startCoordinates.y });
                cable.setStartComponent(startComponent);
                cable.setEndComponent(endComponent);
                cable.update()
                this.cables.push(cable);
            }
        });

        this.vlans = data.vlans;
        
        //update the comands
        EventBus.emit('getCommands', this.buildJson());
    }

    private findComponentByIdentifierAndType(type: string | null, id: number | null): Pc | Switch | Router | null {
        if (type === 'Pc') {
            return this.pc.find(pc => pc.identifier === id) || null;
        } else if (type === 'Switch') {
            return this.switches.find(switch_ => switch_.identifier === id) || null;
        } else if (type === 'Router') {
            return this.routers.find(router => router.identifier === id) || null;
        }
        return null;
    }
}

