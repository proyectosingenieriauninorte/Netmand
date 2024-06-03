import { Dot1Q, Vlan } from "./interfaces";

export abstract class Interface {
    private _name: string;
    private _speed: string;
    private _duplex: string;
    private _description: string;
    private _status: string;
    private _commands: string[];

    get name() {
        return this._name;
    }

    get commands() {
        return this._commands;
    }

    constructor(config: any) {
        this._name = config.name;
        this._speed = config.speed;
        this._duplex = config.duplex;
        this._description = config.description;
        this._status = config.status;
        this._commands = [];

        this.setInterfaceSpeed();
        this.setInterfaceDuplex();
        this.setInterfaceDescription();
        this.setInterfaceStatus();
    }

    private setInterfaceSpeed() {
        if (this._speed) {
            this._commands.push(`speed ${this._speed}`);
        }
    }

    private setInterfaceDuplex() {
        if (this._duplex) {
            this._commands.push(`duplex ${this._duplex}`);
        }
    }

    private setInterfaceDescription() {
        if (this._description) {
            this._commands.push(`description ${this._description}`);
        }
    }

    private setInterfaceStatus() {
        if (this._status == "on") {
            this._commands.push("no shutdown");
        }
        else if (this._status == "off") {
            this._commands.push("shutdown")
        }
    }
}

export class SwitchInterface extends Interface {
    private _mode: string;
    private _vlan: Vlan;

    get vlan() {
        return this._vlan;
    }

    constructor(config: any) {
        super(config);

        this._mode = config.mode;
        this._vlan = config.vlan;

        this.setInterfaceMode();
    }

    private setInterfaceMode() {
        switch (this._mode) {
            case 'trunk':
                this.commands.push('switchport mode trunk');
                break;
            case 'access':
                this.commands.push('switchport mode access');
                if (this._vlan.id) {
                    this.commands.push(`switchport access vlan ${this._vlan.id}`);
                }
                break;
        }
    }
}

export class RouterInterface extends Interface {
    private _ip: string;
    private _mask: string;
    private _dot1q: Dot1Q[];
    private _subIntCommands: string[];

    get subIntCommands() {
        return this._subIntCommands;
    }

    constructor(config: any) {
        super(config);

        this._ip = config.ip;
        this._mask = config.mask;

        this._dot1q = config.dot1q;
        this._subIntCommands = [];

        this.setRouterInterfaceCommands();
    }

    private setRouterInterfaceCommands() {
        this.setIpConfiguration();
        this.setSubIntCommands();
    }

    private setIpConfiguration() {
        if (this._ip && this._mask) {
            this.commands.push(`ip address ${this._ip} ${this._mask}`);
        }
    }

    private setSubIntCommands() {
        this._dot1q.forEach((dot1q: Dot1Q) => {
            if (dot1q.vlan && dot1q.ip && dot1q.mask) {
                this.subIntCommands.push(`interface ${this.name}.${dot1q.vlan.id}`);
                this.subIntCommands.push(`encapsulation dot1Q ${dot1q.vlan.id}`);
                this.subIntCommands.push(`ip address ${dot1q.ip} ${dot1q.mask}`);
            }
        });
    }
}
