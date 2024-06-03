export interface Vlan {
    readonly name: string;
    readonly id: string;
}

export interface Dot1Q {
    readonly ip: string;
    readonly mask: string;
    readonly vlan: Vlan;
}
