export class PC {
    private _mask: string;
    private _ip: string;
    private _gateway: string;
    private _commands: string[];

    get commands() {
        return this._commands
    }

    constructor(config: any) {
        this._ip = config.ip;
        this._mask = config.mask;
        this._gateway = config.gateway;
        this._commands = [];

        this.setIpConfig();
    }

    private setIpConfig() {
        if (this._ip && this._mask) {
            if (this._gateway) {
                this._commands.push(`ipconfig ${this._ip} ${this._mask} ${this._gateway}`);
            } else {
                this._commands.push(`ipconfig ${this._ip} ${this._mask}`);
            }
        }
    }

}

