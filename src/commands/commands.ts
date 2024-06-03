import { PC } from "./devices/end-devices";
import { Router, Switch } from "./devices/network-devices";

export class Commands {
    switchesCommands: string[][];
    routersCommands: string[][];
    pcsCommands: string[][];

    constructor(config: any) {
        this.switchesCommands = (config.switches ?? []).map((switchConfig: any) => new Switch(switchConfig).commands);
        this.routersCommands = (config.routers ?? []).map((routerConfig: any) => new Router(routerConfig).commands);
        this.pcsCommands = (config.pcs ?? []).map((pcConfig: any) => new PC(pcConfig).commands);
    }
}
