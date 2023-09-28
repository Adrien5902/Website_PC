import { Component, Connection, PowerSource, Récepteur } from "./types";

export class Circuit{
    connections: Connection[]
    I: number
    components: Component[]
    Rtotal: number
    V: number
    
    constructor(connections: Connection[]){
        this.components = connections.map(c => c.getComponents()).flat(1).reduce((array, c): Component[] => {
            if(array.find((c) => c)){
                array.push(c)
            }
            return array
        }, [])

        const récepteurs: Récepteur[] = this.components.filter(c => "R" in c) as Récepteur[]
        this.Rtotal = récepteurs.reduce((r, c) => r + c.R, 0)

        const powerSources : PowerSource[] = this.components.filter(c => "getVoltage" in c) as PowerSource[]
        this.V = powerSources.reduce((v, c) => v + c.getVoltage(), 0)

        this.I = this.V / this.Rtotal
    }
}