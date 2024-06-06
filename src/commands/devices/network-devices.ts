import { Interface, RouterInterface, SwitchInterface } from "./network-interfaces";

abstract class NetworkDevice {
    private _hostname: string;
    private _motd: string;
    private _commands: string[];
    protected interfaces: Interface[];

    get commands() {
        return this._commands;
    }

    constructor(config: any) {
        this._hostname = config.hostname;
        this._motd = config.message;
        this._commands = [];
        this.interfaces = [];
    }

    protected enterEnable() {
        this._commands.push("enable");
    }

    protected enterConfTerm() {
        this._commands.push("configure terminal");
    }

    protected enterInterface(interfaceName: string) {
        this._commands.push(`interface ${interfaceName}`);
    }

    protected enterInterfaceRange(range: string) {
        this._commands.push(`interface range ${range}`);
    }

    protected copyRunningConfig() {
        this._commands.push("copy running-config startup-config");
    }

    protected exit() {
        this._commands.push("exit");
    }

    protected end() {
        this._commands.push("end");
    }

    protected setHostname() {
        if (this._hostname) {
            this._commands.push(`hostname ${this._hostname}`);
        }
    }

    protected setMotd() {
        if (this._motd) {
            this._commands.push(`banner motd #${this._motd}#`);
        }
    }

    protected clearCommandsIfEmptyConfig() {
        if (this.commands.length <= 4) {
            this.commands.length = 0;
        }
    }

    protected summarizeInterfacesCommands() {
        const commandInterfaces: { [command: string]: string[] } = {};

        this.interfaces.forEach((switchInterface: Interface) => {
            switchInterface.commands.forEach((command: string) => {

                if (!commandInterfaces[command]) {
                    commandInterfaces[command] = [];
                }

                commandInterfaces[command].push(switchInterface.name);
            });
        });

        const summarizedCommands: { [range: string]: string[] } = {};

        for (const [command, interfaces] of Object.entries(commandInterfaces)) {

            const range = interfaces.length === 1 ? interfaces[0] : this.buildInterfaceRange(interfaces);

            if (!summarizedCommands[range]) {
                summarizedCommands[range] = [];
            }

            summarizedCommands[range].push(command);
        }

        for (const [range, commands] of Object.entries(summarizedCommands)) {
            if (range.includes('-')) {
                this.enterInterfaceRange(range);
            }

            commands.forEach(command => {
                this.commands.push(command);
            });
        }

        for (const [range, commands] of Object.entries(summarizedCommands)) {
            if (!range.includes('-')) {
                this.enterInterface(range);
            }

            commands.forEach(command => {
                this.commands.push(command);
            });
        }
    }

    private buildInterfaceRange(interfaces: string[]): string {
        const interfaceMap: { [interfaceType: string]: number[] } = {};

        interfaces.forEach((interfaceName: string) => {
            const lastSlashIndex = interfaceName.lastIndexOf('/');

            const interfaceType = interfaceName.substring(0, lastSlashIndex);
            const interfaceNumber = interfaceName.substring(lastSlashIndex + 1);

            if (!interfaceMap[interfaceType]) {
                interfaceMap[interfaceType] = [];
            }

            interfaceMap[interfaceType].push(parseInt(interfaceNumber));
        });

        const ranges: string[] = [];

        for (const [interfaceType, interfaces] of Object.entries(interfaceMap)) {
            const numbers = interfaces.sort((a, b) => a - b);
            const typeRanges: string[] = [];

            let start = numbers[0];
            let end = start;

            for (let i = 1; i < numbers.length; i++) {

                if (end + 1 ===  numbers[i]) {
                    end = numbers[i];

                } else {
                    typeRanges.push(`${interfaceType}/${start === end ? start : start + '-' + end}`);
                    start = numbers[i];
                    end = start;
                }
            }

            typeRanges.push(`${interfaceType}/${start === end ? start : start + '-' + end}`);

            ranges.push(...typeRanges);
        }

        return ranges.join(', ');
    }
}

export class Switch extends NetworkDevice {
    protected interfaces: SwitchInterface[];

    constructor(switchConfig: any) {
        super(switchConfig);
        this.interfaces = (switchConfig.ports ?? []).map((interfaceConfig: any) => new SwitchInterface(interfaceConfig));
        this.setSwitchCommands();
    }

    private setSwitchCommands() {
        this.enterEnable();
        this.enterConfTerm();
        this.setHostname();
        this.setMotd();
        this.setVlans();
        this.summarizeInterfacesCommands();
        this.end();
        this.copyRunningConfig();
        this.clearCommandsIfEmptyConfig();
    }

    private setVlans() {
        const vlans: { [id: string]: string } = {};

        this.interfaces.forEach((switchInterface: SwitchInterface) => {
            if (switchInterface.vlan.id) {
                vlans[switchInterface.vlan.id] = switchInterface.vlan.name;
            }
        });

        for (const [id, name] of Object.entries(vlans)) {
            this.commands.push(`vlan ${id}`);

            if (name) {
                this.commands.push(`name ${name}`);
            }
        }
    }
}

export class Router extends NetworkDevice {
    protected interfaces: RouterInterface[];
    private _rip: string[];

    constructor(routerConfig: any) {
        super(routerConfig);

        this.interfaces = routerConfig.ports.map((interfaceConfig: any) => new RouterInterface(interfaceConfig));
        this._rip = routerConfig.rip;

        this.setRouterCommands();
    }

    private setRouterCommands() {
        this.enterEnable();
        this.enterConfTerm();
        this.setHostname();
        this.setMotd();
        this.summarizeInterfacesCommands();
        this.setSubInt();
        this.setRip();
        this.end();
        this.copyRunningConfig();
        this.clearCommandsIfEmptyConfig();
    }

    private setSubInt() {
        this.interfaces.forEach((routerInterface: RouterInterface) => {
            routerInterface.subIntCommands.forEach((command: string) => {
                this.commands.push(command);
            });
        });
    }

    private setRip() {
        if (this._rip.length) {
            this.commands.push("router rip");
            this.commands.push("version 2");
            this.commands.push("no auto-summary");
            this._rip.forEach((rip: string) => {
                this.commands.push(`network ${rip}`);
            });
        }
    }

}
